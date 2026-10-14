# 东盟约（dongShip）

[《卫戍协议：盟约》](https://github.com/sganggs/Stronghold-Protocol)（网页版）非官方同人**工坊包** —— 为核心盟约【东】而做。

## 适配版本

| | |
|---|---|
| 引擎 | **Forge 0.18.3 – 0.18.4**（[Stronghold-Protocol-Forge](https://github.com/XiaMo233M/Stronghold-Protocol-Forge)）|
| 游戏数据 | **0.2.5 – 0.2.6** |
| 下载 Forge | [Forge Releases](https://github.com/XiaMo233M/Stronghold-Protocol-Forge/releases) · 本包实测过的版本：[`v0.18.4-0.2.6`](https://github.com/XiaMo233M/Stronghold-Protocol-Forge/releases/tag/v0.18.4-0.2.6) · [`v0.18.3-0.2.5`](https://github.com/XiaMo233M/Stronghold-Protocol-Forge/releases/tag/v0.18.3-0.2.5) |
| 包声明 | `api: ">=1 <2"`（模组 API = 1）· `game: "0.2.x"` · 层 B · **`combat: true`（会改变对局结果）** |
| 实测 | 引擎校验器 `errors = 0`（VALID）· `tools/doctor.mjs` 正常 · `tools/check-imports.mjs` 无错 · `tools/sim-check.mjs` 267 场无头战斗跑通 · 16 个回归脚本全过 · 用 Forge 导入工具装进空工坊根通过 |

> 引擎升级后若加载器报 `MOD_API_INCOMPATIBLE`，说明模组 API 版本变了（当前为 1）。

## 更新记录

### 1.2.4 — 吉星能量条 / 入场动画修复 · 0.18.4 适配 · 一次性平衡调整（含削弱）

**① 修复：吉星战斗中不显示能量条**

本包 `kits/chess_char_3_kichi_a.js` 把两个技能的 spec 写成 `spCost: 0, spType: 'none', trigger: 'NEVER'`，而数据里 S1/S2 是 `MANUAL` / `spCost 50 / 44`。引擎取值是 **spec 覆盖数据**（`server/sim/skills.js:93`）⇒ `spMax = 0`（`server/sim/units.js:229`）⇒ 客户端 `public/js/render/units.js:1546` 的 `showSp = (spMax > 0 || !!ammo)` 为假 ⇒ **不画能量条**；`trigger NEVER` 更让 kit 里所有判 `skill.active` 的钩子永不触发 ⇒ **S1/S2 此前一次都没生效**。修复：删掉这两行覆盖，技能按数据充能（spMax 50 / 44），`MANUAL` 由引擎自动施放（36 s / 30 s）。

**② 修复：包自带模型的入场动画没绑**

`art.chars[*].spine.*` 只声明了 `skel`/`atlas`、没有 `anims`；客户端 `public/js/render/spine.js:697` 的 `deploy()` **只认 `roles.deploy`**（`die()` 有 `|| 'Die'` 兜底，deploy 没有）⇒ 4 名自带模型干员**全都没有入场动画**。修复：用引擎自带工具在同一份 `.skel` 上解析角色（`tools/assets/skel.mjs` + `tools/assets/anim-roles.mjs`，运行时 `@pixi-spine/runtime-3.8`），把 `anims` / `animations` / `events` / `hits` / `bounds` / `pma` / `textures` 写进 `art.chars`（与官方 `data/assets.json` 同形）。夜刀只有 `Start_1/2/3` ⇒ 入场显式绑 `Start_1`。另查出**白雪 back 模型 `.skel` 已损坏** ⇒ 移除该侧声明（客户端回退 front）。

**③ 修复：盟约的追加攻击会触发宴的武者特性回血**

宴是**武者**，引擎 `server/sim/professions.js` 的 `installMushaHeal` 是「每次**输出伤害**回血」，并**排除** `talent` / `dot` / `periodic` 三种标签。修复：给盟约追加攻击打上 `talent` 标签（`tags: [bond:dongShip, talent]`）⇒ 不再从追加攻击回血。

**④ 修复：夜刀的天赋会吃盟约的追加攻击（伤害超模）**

`kits/chess_char_9_yato_a.js` 的天赋原本只要求 `d.isAttack`（追加攻击没有该字段），本轮再加一道显式护栏 `if (tagged(d, 'bond:dongShip')) return;` ⇒ 追加攻击**不会**再触发她的天赋法伤。

**⑤ 适配：Forge 0.18.4 / 游戏数据 0.2.6**

- `chess` / `bonds` / `garrisons` / `items` / `config` 五张表在 0.2.4 → 0.2.6 之间**逐字节相同** ⇒ 覆盖记录无需重同步（17 条逐条报「不变」）；模组 API 仍为 **1**；
- 在 0.18.4 上：校验器 `0 error`（VALID）· `doctor` 正常 · `check-imports` 无错 · `sim-check` **267 场无头战斗跑通** · 16–17 个回归脚本全过；
- 上游 0.18.4 顺带修掉了「固定干员赠礼受共享道具池限制」（`acquire.js:301` 的 `unlimitedGift`、`gamedata.js:183` 的 `_fixedGiftItems`）⇒「买了缪尔赛思不给变形同构体」消失。

**⑥ 平衡调整（本轮一次性做完，含削弱）**

| 项目 | 调整前 | **调整后** |
|---|---|---|
| 【东】追加攻击斜率 | 0.0032233（**300 层** = 100%）| **0.0029754（325 层 = 100%）** |
| 神经损伤积蓄 | 60 / 次 | **30 / 次** |
| 吉星 · 专属特质（普通） | 每花费 1 资金 → +1 层 | **每花费 2 资金 → +1 层** |
| 吉星 · 专属特质（精锐） | 每花费 1 资金 → +2 层 | **每花费 1 资金 → +1 层** |
| 嵯峨 · 专属特质攻速 | +1.5（精锐 +3） | **+1（精锐 +2）**，攻击力/生命值不变 |
| 麒麟R夜刀 上架本数 | 4 本 | **5 本**（price 4） |
| 遥 上架本数 | 5 本 | **4 本** |

同时：**麒麟R夜刀 加入【不屈】盟约**（`indomShip`，含该盟约成员表补全，界面才会显示她）；**白雪特性追加「可攻击空中单位」**（炮手原本不对空，本包保留对空）。

**⑦ 其他**

- 新增自检脚本：`audit-kit-skill-sp.mjs`（全包技能 SP 一致性，36 条）· `audit-spine-anims.mjs`（逐模型断言入场/待机/攻击与贴图，7/7）；
- `pack.json` 描述里过期的公式数值同步为现行值（描述、公告、`bond-specs` 与战斗模块一致）。

### 1.2.0 — 首次发布

核心盟约【东】（12 名成员 / 24 枚棋子）、10 组专属特质（19 条记录）、1 件新装备「艺人见面抽选券」、4 名新干员的语音与美术（112 个 mp3 + Spine/立绘/头像/技能图标）、7 条官方盟约成员表补全。

## 本包目前有什么

### 核心盟约【东】

- **12 名成员 / 24 枚棋子**（每名成员都有普通与精锐两版；精锐面板更高）；入口门槛 **3 名**、强化门槛 **6 名**不同【东】干员；
- **效果一**：成员造成伤害时追加一次攻击，按目标弱点类型结算（物理 / 法术取更痛的那一种），
  **攻击力 × (3.3% + 0.2975% × 层数)** —— 325 层正好 100%；
- **效果二**：在场 6 名不同【东】干员时，追加攻击同时积累目标的**神经损伤 30/次**（攒满触发官方神经爆发）。

### 成员（12 名）

| 来源 | 干员 |
|---|---|
| 本包新增（带动画 / 立绘 / 语音） | 火龙S黑角 · 白雪 · 吉星 · 麒麟R夜刀 · 遥 · 嵯峨 · 斩业星熊 |
| 本体已有、加入【东】 | 宴 · 风丸 · 水月 · 星熊 · 安洁莉娜 |

### 专属特质（10 组 / 19 条记录）

- **白雪**：获得时自身所属盟约层数 +2（精锐 +3，无需激活盟约）
- **吉星**：休整期结束时，本回合每花费 1 资金使已激活的【东】层数 +1（精锐 +2）
- **安洁莉娜**：休整期结束时，本回合每刷新过 1 次使已激活的【东】层数 +4（每回合至多 12；精锐 +8 / 至多 24）——她原本的【叙拉古】特质保持官方原样
- **遥**：① 休整期结束时整备区每有 1 名干员使【东】层数 +1（精锐 +2）；② 【东】每叠加 3 层，本干员攻击力和生命值 +1%（精锐 +2%）
- **嵯峨**：【东】每叠加 3 层，本干员攻击力、生命值 +1.5%、攻击速度 +1.5（精锐 3% / 3% / +3）
- **水月**：【东】每叠加 3 层，本干员攻击力 +1%（精锐 +2%）
- **斩业星熊**：核心盟约每叠加 3 层，本干员攻击力和生命值 +1.5%
- **麒麟R夜刀**：部署时使自身已激活的盟约层数 +2（每场作战至多 24；精锐 +3 / 至多 36）
- **火龙S黑角**：进入休整期时，若棋盘上有 5 名以上【东】干员，获得 1 个等级不高于当前商店等级的【东】干员（精锐获得 2 个）

### 新装备

- **艺人见面抽选券**（4 阶 · 3 金）：休整期结束时，使携带者**已激活的盟约层数 +2**（精锐 +3，每回合一次）；
- 与「**变形同构体**」一同装备时，携带者**视为【东】盟约成员** —— 一件装备就能补上第 3 名东，或让非东干员吃满【东】的追加攻击。

### 干员模组

- **火龙S黑角**：X 模组「黑角的随身笔记」；**遥**：Y 模组「迟来的纪念」；**嵯峨**：Y「身向云泥」与 X「何处寻驮？」可选；
- 精锐版默认装备上表模组，干员调配里可以改成「不装备」。

### 新增干员的语音与美术

- **战斗语音 112 个 mp3**：白雪 / 吉星 / 麒麟R夜刀 / 火龙S黑角 × 12 个战斗槽位 × **日文 · 中文**两套；
- **Spine 模型 36 个**（正/背面）、**立绘 8 张**、**头像 4 张**、**技能图标 9 个**、**道具图标 2 个**（普通/精锐）、**盟约图标 1 个**（自制）。

### 界面

- **7 条官方盟约的成员表已补全**：精准 · 远见 · 迅捷 · 助力 · 突袭 · 坚守 · 炎 —— 本包新增的干员在盟约界面里与官方成员一样可见；
- **公告 8 节**：核心盟约 / 成员 / 棋子 / 专属特质 / 干员模组 / 新装备 / 默认技能 / 须知。

## 怎么装

1. 到 [Releases](https://github.com/CLAPXO/-modpack/releases) 下载 `dongShip-1.2.0.zip`；
2. 把 zip **拖到 Forge 整合包根目录的 `安装工坊包.bat`** 上；或命令行：

   ```bat
   cd /d <Forge 目录>
   node tools\workshop-pack.mjs import D:\tmp\dongShip-1.2.0.zip
   ```

   也可以手动解压：把 zip 里全部内容解到 `<Forge 目录>\app\workshop\dongShip\`（`pack.json` 必须在这一层）；
3. 重启服务器（`启动游戏.bat`），浏览器 **Ctrl+Shift+R**。

验收：`curl.exe -s http://127.0.0.1:3000/healthz` 里应有 `"modPacks":1`；游戏里盟约一览能看到【东】。

## 许可与素材

- 本包代码（`kits/**`、`server/**` 中本包部分、原创 JSON 数据）：**GPL-3.0-or-later**；
- 随包素材**含《明日方舟》官方素材**（Spine / 立绘 / 头像 / 技能图标 / 干员语音 / 道具图标，共 171 个文件；盟约图标为作者自制）。
  版权归**上海鹰角网络科技有限公司 / Yostar 及其授权方**，本包与发布者**不主张**任何权利，
  **仅供非商业**的学习与个人娱乐使用，**请勿用于任何商业场景**；
- 逐条来源与实测清点见 [dongShip/PROVENANCE.md](dongShip/PROVENANCE.md) 第 6 节。

## 相关链接


- **游戏本体（卫戍协议：盟约 · 网页版）**：https://github.com/sganggs/Stronghold-Protocol
- 游戏 Releases（整合包下载）：https://github.com/sganggs/Stronghold-Protocol/releases
- Forge（引擎）：https://github.com/XiaMo233M/Stronghold-Protocol-Forge
- Forge 版本下载：https://github.com/XiaMo233M/Stronghold-Protocol-Forge/releases
- 本包实测所用 Forge 版本：https://github.com/XiaMo233M/Stronghold-Protocol-Forge/releases/tag/v0.18.3-0.2.5
- 工坊包仓库（Forge-Mods）：https://github.com/XiaMo233M/Stronghold-Protocol-Forge-Mods
- 部署文档：https://github.com/XiaMo233M/Stronghold-Protocol-Forge/blob/main/docs/DEPLOY.md
