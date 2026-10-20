# 东盟约 1.2.29 —— 本版改动一览

**基线 1.2.21 → 1.2.29**。本文只列**最终生效**的改动，不记中间调整。

## 一、数值与规则

| 对象 | 最终效果 |
|---|---|
| **麒麟R夜刀**（`chess_char_9_yato_a/_b`） | 盟约：**dongShip + raidShip**（移除【不屈】；`bonds.json` 的 `indomShip` 成员表同步删掉夜刀）。叠层上限：普通 **12** 层 / 精锐 **24** 层（每次部署仍 +2 / +3） |
| **白雪**（`chess_char_1_21_a/_b`） | 价格 **2 金**（`sellPrice` 1） |
| **火龙S黑角**（`garrison_noirc2_dong_a/_b`） | **自身所在的那一排 ≥4 枚棋子** → 进入休整期获得 1 张【东】（精锐 2 张），等级不高于当前商店等级；token / 备战席 / 另一排不算，黑角在备战席不触发 |
| **艺人见面抽选券**（`chess_item_ws_artist_ticket_a/_b`） | **常驻装备**（不销毁）：每**消耗 15 资金**（精锐 **10 资金**）→ 获得 1 名与携带者**已激活的盟约**相同的干员（等级不高于当前调度中心等级）；携带者没有已激活盟约时不累计、不发放；**与【变形同构体】一同装备时，携带者视为【东】盟约成员** |
| **安洁莉娜**（`garrison_angelina_dong_a/_b`） | 本回合每刷新 1 次 → 已激活【东】+4 层（精锐 +8），上限 12 / 24（1.2.21 起用引擎官方键，本次未变） |

## 二、实现结构（最终形态）

| 内容 | 靠什么实现 |
|---|---|
| 【东】的追加攻击 / 神经损伤 | `server.battle`（`server/battle/dong.mjs`） |
| 安洁莉娜加层 | 引擎内置键 `SERVER_ADD_REFRESH_CNT_MULTIPLIER_BOND_LAYER`（纯数据） |
| 黑角发牌 | 引擎内置键 `SERVER_POOL_CHAR`（歌蕾蒂娅同款）+ 池子 `pool_char_dongShip` 由 `server.modules` 在这一局的 `data.choices.pools` 里注入 |
| 抽选券 | `server.modules` 在这一局的注册表副本上注册 `item:chess_item_ws_artist_ticket` 的 `onSpend`（引擎内置道具键里没有 onSpend）；发放范围取 `ctx.pieceBonds(携带者) ∩ ctx.bondActive()` |

- **`server.meta` 已经完全移除**：`pack.json.server` 只剩 `battle` + `modules`。
- 因此**不需要任何引擎补丁**（`lobby.js` 保持上游原样），也不受"房间声明 mod 集合"那个上游 bug 影响。
- 包的覆盖记录已按 **数据 0.3.1** 刷新；包内不再带 `.tune-backup` 调参备份。

## 三、文件级差异（相对 1.2.21）

```
改动  9：bonds.json · chess.json · garrisons.json · items.json · pack.json
        PROVENANCE.md · README-部署说明.md · item-specs/artist_ticket.json · notice/announcement.json
新增  1：server/modules/dong.mjs        ← 池子注入 + 抽选券 onSpend
删除  8：server/meta/dong.mjs            ← 不再需要 meta 通道
        .tune-backup/（7 个调参备份，此前误带进包）
```

## 四、验证

- 引擎校验器：**0 error / 62 warning / VALID**（Forge 0.19.1 + 数据 0.3.1）
- 自检脚本：**20 / 20 通过**（`audit-dong-traits` 0 错 1 警、`audit-bond-display` 0 错 0 警、`audit-garrison-text` 47 条、`audit-kit-skill-sp` 40 条、`test-akafuyu` 89 条、`test-dong-item` 45 条、`test-dong-noirc2-gate` 41 条、`test-dong-handlers` 16 条、`test-yato-dong-instances` 21 条 …）
- 真对局：黑角本排 4 枚 → 1 张【东】（精锐 2 张）；安洁莉娜 3 次刷新 +12 层；抽选券花 15 / 10 金 → 1 名【东】（≤商店等级；与【变形同构体】同装时也是【东】）；夜刀上限 12 / 24 生效
- 覆盖式更新包：1321 个条目逐条目与目标一致

## 五、安装与联机

- 单独用：把 `dongShip/` 放进 `<Forge>/app/workshop/`，重启服务器
- 覆盖升级：用"覆盖式更新包"解压到 Forge 的上一层目录（提示覆盖时选"是"）
- 联机双方 `pack.json` 的 `version` 必须一致（本版 = **1.2.29**）
- 自查：`/healthz` 的 `app` 为 `0.19.1`；`/data/items.json` 里抽选券 `params.gold` = 15 / 10；`/data/garrisons.json` 里黑角 `effectKey` = `SERVER_POOL_CHAR`