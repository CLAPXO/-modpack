// server/meta/dong.mjs —— 东盟约（dongShip）的**准备阶段**特质处理器。
//
// 这是工坊的 `server.meta` 通道（DESIGN §29）：包用一个导出 `registerMeta(registry)` 的模块，
// 在**这一局**的注册表上登记自己的 effectKey 处理器。`pack.json` 的
// `server.meta.registers` 是**白名单**——没列在那里的键一注册就抛（防止静默顶掉官方处理器）。
//
// 为什么必须写代码，而不能照抄官方处理器：
//
//   · `custom_dong_prep_pool`（火龙S黑角）：官方最接近的是 `SERVER_POOL_CHAR`，但它的条件是**写死**的
//     `rowCondition(ctx, selfView(ctx))`——只认"同行/同列 N 人"（`character_same_row` / `character_same_col`）。
//     而我们要的条件是**"棋盘上有 ≥5 名不同的【东】干员"**，官方没有任何 conditionkey 能表达它。
//     能力本身是齐的（`ctx.bondCount` / `ctx.rollChess` / `ctx.grantChess` 都是引擎给包的 `api`），
//     所以按工坊公约注册一个新处理器，而不是去改引擎源码。
//
//   · `item:chess_item_ws_artist_ticket`（**艺人见面抽选券**装备，`custom_dong_round_layers`；名字/风味取自官方
//     道具「艺人见面抽选券」PRTS: https://prts.wiki/w/艺人见面抽选券）：装备的"每回合给层"是
//     **准备阶段**的行为，引擎的装备行为表（`server/sim/content/items/battle.js` 的 `STAT_BUFFS` / `BY_BUFF`）
//     是引擎内部的、包改不了；而工坊给装备留的通道是 meta 注册表的 `item:<itemKey>`（装备装在自己干员身上的
//     每一个钩子都会跑它）—— 所以这件装备的数值仍然写在 `items.json` 的 `bb` 里，行为写在这里。
//
//   · `custom_dong_refresh_layers`（安洁莉娜**新增**的那条【东】特质）：官方
//     `SERVER_ADD_REFRESH_CNT_MULTIPLIER_BOND_LAYER` 的行为本身够用，但它是**官方的键**：拿它挂在包新增的
//     特质上，等于借官方的处理器跑包的效果 —— 写不写 `multiplier` / `max_layer`、读不读 `bbStr.bond`
//     全由官方决定，上游改一次包就悄悄变一次。而且【甲】方案的全部意义就是**与官方那条特质并存**：
//     安洁莉娜的官方特质（`garrison_147_a/_b`，"本回合每刷新过1次，使已激活的【叙拉古】层数+N"）
//     **一个字节都不动**（本包不再覆盖它），我们只**新增**一条只给【东】加层的特质并自己实现它。
//
// ⚠ 纪律（与 `server.battle` 同一条，两者都改对局结果 ⇒ 都要 `combat: true`）：
//   两端都不跑（meta 只有服务端加载）；不许 Math.random / Date.now / 定时器 / 网络 / 文件系统 / 模块级可变状态；
//   随机数一律用 `ctx.rng`（引擎的确定性随机源），否则服务端复算会对不上。
//
// 只能 import 引擎给的 api（`registry.api`）——本模块**不 import 任何东西**，全部走 `ctx` / `registry.api`。

/** 本包认的盟约 id：`bbStr.bond` 缺省时的兜底（数值与条件都写在数据里，代码里一个魔数都不写）。 */
const DONG = 'dongShip';

/** `bbStr.bond`："A,B" → ['A','B']（官方数据用逗号分隔多盟约，如 `siracusaShip,arcaneShip`）。 */
const ids = (s) => String(s ?? '').split(',').map((x) => x.trim()).filter(Boolean);

/** `bbStr.bond` 的第一个盟约；没写时退回 DONG。 */
const bondOf = (s) => ids(s)[0] || DONG;

/**
 * "使已激活的…" → true；"（无需激活盟约）" → false。
 * 与官方 `server/sim/content/garrisons/meta.js` 的 `requireActiveOf` **同一判据**（读 `desc` 原文）：
 * 特质说明写"已激活"时只给已激活的盟约加层，写"（无需激活盟约）"时不要求激活。
 */
const requireActiveOf = (desc) => {
  const d = String(desc ?? '');
  if (d.includes('无需激活')) return false;
  return /已激活|激活且/.test(d);
};
/**
 * 棋盘上有多少名【东】干员：数棋子（token 不算、备战席不算），普通与精锐各算 1 名。
 * 成员资格用引擎的 ctx.pieceBonds（自己的 bonds ∪ 装备/特质/变形同构体授予的）。
 * 不用 ctx.bondCount()：那个会额外 +1 调和（maniShip 激活时给 isCore 盟约 +1），拿它当人数门槛会误触发。
 */
const boardCount = (ctx, bond) => {
  let n = 0;
  for (const p of ctx.board()) {
    if (!p || p.kind !== 'chess' || !p.id) continue;
    if (ctx.pieceBonds(p.uid).includes(bond)) n++;
  }
  return n;
};

  /** 调试开关：`set DONG_DEBUG=1` 启动服务器（或全局 `__DONG_DEBUG = true`）时，每次触发都把判定过程打到控制台。 */
  
/**
 * 登记本包的处理器。键 = `garrison:<effectKey>`（`pack.json.server.meta.registers` 里逐条声明）。
 * 处理器形状与官方内容模块逐字相同：`{ run(ctx) }`（`run` 在特质自己的 `eventType` 对应的钩子上被调用）。
 */
export function registerMeta(registry) {
  // 引擎给的辅助函数（`registry.api` = 冻结的 META_API）：这里只借它的数值兜底读法
  // （bb 里的值可能是字符串），其余一律走 ctx —— 那才是唯一能改对局状态的地方。
  const num = registry.api.num;

  /**
   * 火龙S黑角：棋盘上 ≥5 名**不同**【东】干员时（普通/精锐去重、备战席不算），整备阶段开始获得一个
   * tier ≤ 商店等级的【东】干员。
   *
   * 数据（garrisons.json 的 `garrison_noirc2_dong_a/_b`，`eventType: SERVER_PREP_START`）：
   *   bb    { count: 1, check_count: 5 }   count = 给几个；check_count = 门槛人数
   *   bbStr { bond: "dongShip" }           数哪个盟约
   * （`desc` 里没有"无需激活"，但这条特质按设计**不要求盟约已激活**：它是把盟约凑起来的发动机。）
   */
const DONG_PREP_POOL = {
  /**
   * <进入休整期时>若棋盘上有 5 名以上【东】干员，获得 N 个等级不高于当前商店等级的【东】干员。
   *
   * 发牌这一段完全照引擎自己的写法（server/sim/content/garrisons/meta.js 的 SERVER_MOST_BOND）：
   *   const id = ctx.rollChess({ bond, maxTier });  if (id) ctx.grantChess(id);
   * 即：从共享池按盟约 + 商店等级抽一张（尊重剩余份数），抽到就给 —— 不加任何自定义兜底。
   * 唯一自写的部分只有"数 5 名【东】"这个门槛（官方没有 conditionkey 能表达它）。
   */
  run(ctx) {
    const { bb, bbStr } = ctx.source;
    const bond = bondOf(bbStr.bond);
    if (boardCount(ctx, bond) < num(bb.check_count, 5)) return;
    const maxTier = Math.max(1, Math.min(6, ctx.shopLevel()));
    for (let i = 0; i < Math.min(10, num(bb.count, 1)); i++) {
      const id = ctx.rollChess({ bond, maxTier });
      if (id) ctx.grantChess(id);
    }
  },
};

  /**
   * 安洁莉娜（新增特质，与官方那条并存）：<休整期结束时>本回合每刷新过 1 次，使已激活的【东】层数 +N。
   *
   * 数据（garrisons.json 的 `garrison_angelina_dong_a/_b`，`eventType: SERVER_PREP_FIN`）：
   *   bb    { multiplier: 4, max_layer: 12 }   N = 本回合刷新次数 × multiplier，每回合至多 max_layer 层
   *   bbStr { bond: "dongShip", conditionkey: "character_target_inboard" }
   *
   * 与官方 `SERVER_ADD_REFRESH_CNT_MULTIPLIER_BOND_LAYER`（阿罗玛 / 安洁莉娜的【叙拉古】那条）**逐条同义**：
   *   · 刷新次数是**玩家本回合的**（`ctx.roundStats().refreshes`，见 effectsMeta 的 roundStats），不是这一份的；
   *   · `max_layer > 0` 时先封顶再入账（"每回合至多 N 层"）；<= 0 表示不封顶；
   *   · "使已激活的…" ⇒ `requireActive: true`（盟约没激活就不加层，与官方一致）。
   * 走的是**准备阶段**的入账口（`ps.addLayers`），服务器自己算、不经战斗校验 —— 没有 `bad('layer bound')` 的风险
   * （见 docs/design 与 README-东-叠层方案-代码级研究.md 第 2 章）。
   */
  const DONG_REFRESH_LAYERS = {
    run(ctx) {
      const { bb, bbStr, garrison } = ctx.source;
      const per = num(bb.multiplier);
      if (!(per > 0)) return;
      let n = (ctx.roundStats().refreshes | 0) * per;
      const cap = num(bb.max_layer, 0);
      if (cap > 0) n = Math.min(n, cap);
      if (!(n > 0)) return;
      const requireActive = requireActiveOf(garrison && garrison.desc);
      for (const bond of ids(bbStr.bond)) ctx.addLayers(bond, n, { requireActive });
    },
  };

  /**
   * 艺人见面抽选券（装备，`item:chess_item_ws_artist_ticket`）：<休整期结束时>使携带者**自身已激活的盟约**层数 +2（精锐 +3）。
   *
   * 数据（items.json 的 `chess_item_ws_artist_ticket_a/_b`，源是 `item-specs/artist_ticket.json`）：
   *   bb { layer: 2, golden_layer_bonus: 1 } → 普通 +2、精锐 +2+1=+3；`category: BOND`、
   *   `giveBondId: "dongShip"`（所以和**变形同构体**同装时，携带者还额外被算作【东】成员）。
   *
   * ⚠ 精锐那一层为什么走 `golden_layer_bonus`：编辑器的装备模型是"一个 spec → 普通 + 精锐两份**相同**数值"
   *   （`shared/itemAuthoring.js deriveItem` 的 `common`），所以两份的差额只能写在 bb 里让代码加；
   *   手改 items.json 的 `_b` 会被下一次"在编辑器里保存这件装备"重写掉（2026-10-13 实际发生过一次）。
   *
   * 语义照官方 `随身身份牌`（`use_equip_reward_char_chess_bond_layer`）：**逐条**给携带者的盟约加层；
   * 区别是我们写的是"**已激活**的盟约"（requireActive: true，且先用 ctx.bondActive 过滤一次），且每回合都会结算。
   * `ctx.pieceBonds(uid)` 给的是"这枚棋子算数的盟约"= 自己的 bonds ∪ 变形同构体配对授予的 —— 所以装上抽选券的
   * 同时再装变形同构体时，【东】也在这一列里（若已激活就会被一起加层）。
   */
  const DONG_ITEM_ROUND_LAYERS = {
    onPrepEnd(ctx) {
      const { holder, item } = ctx.source;
      if (!holder || holder.kind !== 'chess') return;          // 只对"装在某名干员身上"生效
      const p = item && item.params ? item.params : {};
      const golden = !!(item && item.isGolden === true);
      const n = num(p.layer, 0) + (golden ? num(p.golden_layer_bonus, 0) : 0);   // 普通 +layer，精锐再 +bonus
      if (!(n > 0)) return;
      for (const bondId of ctx.pieceBonds(holder.uid)) {
        if (!ctx.bondActive(bondId)) continue;                  // "已激活的盟约"
        ctx.addLayers(bondId, n, { requireActive: true, reason: 'dong_inro' });
      }
    },
  };

  registry.garrison('custom_dong_prep_pool', DONG_PREP_POOL);
  registry.garrison('custom_dong_refresh_layers', DONG_REFRESH_LAYERS);
  registry.item('chess_item_ws_artist_ticket', DONG_ITEM_ROUND_LAYERS);
}
