# 东盟约（dongShip）1.2.22 → 1.2.28 变更记录

时间跨度：2026-10-18 → 2026-10-20　·　基线：**1.2.21**（安洁莉娜改用引擎官方键）　·　终点：**1.2.28**

## 一、按版本

### 1.2.22 — 夜刀：去掉【不屈】、叠层上限下调
| 对象 | 改动 |
|---|---|
| 麒麟R夜刀（`chess_char_9_yato_a/_b`） | `bonds`：`["dongShip","raidShip","indomShip"]` → **`["dongShip","raidShip"]`**（移除【不屈】） |
| `bonds.json` 的 `indomShip` | `members` / `visibleMembers` 里删掉 `chess_char_9_yato_a` |
| `garrison_yato_dong_a/_b` | `bb.max_add_count_per_battle`：普通 **24 → 12**、精锐 **36 → 24**；`desc/descRaw` 同步「每场作战至多 12 / 24 层」；每次部署仍 +2 / +3 层 |
| 覆盖记录 | 按 **0.3.1 官方数据**重刷 8 条 chess 覆盖（`chess_char_5_20_b` 的 `modules` 等在 0.3.1 有变动） |

### 1.2.23 — 白雪价格
| 对象 | 改动 |
|---|---|
| 白雪（`chess_char_1_21_a/_b`） | `price`：**1 → 2 金**（`sellPrice` 保持 1，与官方 2 金单位一致） |

### 1.2.24 — 黑角门槛改「本排 ≥4 枚」
| 对象 | 改动 |
|---|---|
| 火龙S黑角（`garrison_noirc2_dong_a/_b`） | 门槛：棋盘上 5 枚【东】 → **自身所在的那一排 ≥4 枚棋子**（`bb.check_count: 5 → 4`）；数量仍 1 / 精锐 2；等级 ≤ 商店等级；`desc` 同步 |
| 实现 | 当时的自定义 meta 处理器 `custom_dong_prep_pool`：`rowCountOf(ctx)`（`ctx.piece(uid)` 取位置 + 同行计数；token / 备战席 / 另一排不算） |

### 1.2.25 — 黑角改成歌蕾蒂娅同款内置键（不再要 meta）
| 对象 | 改动 |
|---|---|
| `garrison_noirc2_dong_a/_b` | `effectKey/effectType` → **`SERVER_POOL_CHAR`**（引擎内置，歌蕾蒂娅/焰尾同款）；`bb {count, check_count:4}`、`bbStr {pool:"pool_char_dongShip", conditionkey:"character_same_row"}` |
| 新增 `server/modules/pool.mjs` | `server.modules` + `uses:["matchClass"]`：在这一局的 `data.choices.pools` 里浅拷贝注入 `pool_char_dongShip`（`kind:chess, bond:dongShip, maxTier:shopLevel`）——包的 `choices.json` 加不了池子 |
| 删除 | `server/meta/dong.mjs` 里的黑角处理器；`registers` 去掉该键 |

### 1.2.26 — 抽选券改纯数据（三选一 + 返钱）；整包去掉 `server.meta`
| 对象 | 改动 |
|---|---|
| 艺人见面抽选券 | `buffs` = `use_equip_reward_special_goods_char_chess {refresh_cnt:3}` + `equip_destory_gain_random_coin {min:1,max:2}`；`kind: consume_on_equip` |
| 包 | **删除 `pack.json.server.meta` 与 `server/meta/`**（三件效果全部走引擎内置键） |

### 1.2.27 — 抽选券恢复常驻；效果换成「出售计数」
| 对象 | 改动 |
|---|---|
| 抽选券 | 恢复**常驻**（`duration:-1`、`kind: passive_player`、不销毁），恢复 **`giveBondId:"dongShip"`**（保留与【变形同构体】同装时"携带者视为【东】"） |
| 效果 | 引擎内置键 `sell_char_count_gain_equip_owner_bond {count:5}`：每出售 5 名干员 → 抽 1 名同盟约干员（≤商店等级） |

### 1.2.28 — 抽选券改成「每消耗 15 资金（精锐 10）发一个」
| 对象 | 改动 |
|---|---|
| 抽选券数据 | `buffs` = `custom_dong_ticket_spend`，`params.gold`：普通 **15** / 精锐 **10**；仍常驻、仍 `giveBondId:"dongShip"` |
| `server/modules/dong.mjs` | `matchClass` 层在这一局的**注册表副本**（`registry.fork()`）上注册 `item:chess_item_ws_artist_ticket` 的 **`onSpend`**：按件累计消耗资金，每满 `gold` → 发 1 名；携带者算【东】时**只抽【东】**，否则退回"与携带者任一盟约相同"的官方口径；等级 ≤ 商店等级 |
| 池子注入 | 同上（仍在同一模块里做） |

## 二、净效果（1.2.21 → 1.2.28）
| 项 | 1.2.21 | 1.2.28 |
|---|---|---|
| 夜刀盟约 | dongShip + raidShip + **indomShip** | **dongShip + raidShip** |
| 夜刀叠层上限 | 24 / 36 | **12 / 24** |
| 白雪价格 | 1 金 | **2 金** |
| 黑角发牌 | 棋盘 5 名【东】→ 1 / 2 张（自定义 meta 处理器） | **自身所在排 ≥4 枚 → 每回合 1 / 2 张**（引擎内置 `SERVER_POOL_CHAR` + 池子注入） |
| 安洁莉娜加层 | 官方键（1.2.21 已改） | 不变 |
| 抽选券 | 常驻，每休整期结束 +2 / +3 层（meta） | **常驻，每消耗 15 / 10 金 → 发 1 名【东】**（`server.modules` 的 `onSpend`） |
| `server.meta` | 有（3 个处理器） | **完全没有** |
| `pack.json.server` | `battle` + `meta` | **`battle` + `modules`** |
| 引擎补丁 | 需要（lobby.js 一行） | **不需要**（引擎上游原样） |

## 三、文件级差异（1.2.21 → 1.2.28：9 改 / 1 增 / 8 删）
```
改动  bonds.json · chess.json · garrisons.json · items.json · pack.json
      PROVENANCE.md · README-部署说明.md · item-specs/artist_ticket.json · notice/announcement.json
新增  server/modules/dong.mjs                ← 池子注入 + 抽选券 onSpend
删除  server/meta/dong.mjs                   ← 不再需要 meta 通道
      .tune-backup/（7 个调参备份，误带进 1.2.21 的包）
```

## 四、验证（1.2.28）
- 引擎校验器：**0 error / 62 warning / VALID**（Forge 0.19.1 + 数据 0.3.1）
- 全套自检脚本：**20 / 20 通过**（`audit-dong-traits` 0 错 1 警、`audit-bond-display` 0 错 0 警、`audit-garrison-text` 47 条、`test-akafuyu` 89 条、`test-dong-item` 45 条、`test-dong-noirc2-gate` 41 条、`test-dong-handlers` 16 条、`test-yato-dong-instances` 21 条 …）
- 真对局复核：黑角本排 4 枚 → 1 张【东】（精锐 2 张）；安洁莉娜 3 次刷新 +12 层；抽选券花 15 / 10 金 → 1 名【东】（≤商店等级；与变形同构体同装时也是【东】）；夜刀上限 12 / 24 生效
- 覆盖式更新包：1321 条目逐条目与目标一致