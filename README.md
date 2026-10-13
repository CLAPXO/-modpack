# 东盟约（dongShip）—— 卫戍协议：盟约 工坊包

《卫戍协议：盟约》非官方同人**工坊包**：加入**核心盟约【东】**。

| | |
|---|---|
| 包 id / 名称 / 版本 | dongShip / 东盟约 / **1.2.0** |
| 引擎 / 游戏 | Forge **0.18.3** / 游戏数据 **0.2.5**（api >=1 <2，game 0.2.x） |
| 层 / combat | B / **true（会改变对局结果）** |
| 包本体 | [packs/dongShip/](packs/dongShip)（`pack.json` 在这一层） |
| 下载 | [dist/dong-pack-v1.2.zip](dist/dong-pack-v1.2.zip)（**扁平**，`pack.json` 在 zip 根）/ [dist/dong-pack-v1.2-repo.zip](dist/dong-pack-v1.2-repo.zip)（顶层目录 = 包 id） |

## 内容

- **核心盟约【东】**：12 名成员 / 24 枚棋子，入口门槛 3 名、强化门槛 6 名不同【东】干员；
  效果一 = 成员造成伤害时追加一次按目标弱点类型（物理/法术取更痛的一种）结算的攻击，
  攻击力 × (3.3% + 0.4835% × 层数)，**200 层正好 100%**；效果二 = 6 名时追加攻击同时积累神经损伤 60/次；
- **10 组专属特质（19 条记录）**：白雪 / 吉星 / 安洁莉娜 / 遥（两条）/ 嵯峨 / 水月 / 斩业星熊 / 麒麟R夜刀 / 火龙S黑角；
- **1 件新装备**「艺人见面抽选券」：休整期结束给携带者已激活盟约加层（普通 +2 / 精锐 +3），
  与「变形同构体」同装时授予【东】；
- **4 名新增干员的语音与美术**：白雪 / 吉星 / 麒麟R夜刀 / 火龙S黑角（日·中两套战斗语音 112 个 mp3，
  以及 Spine 模型、立绘、头像、技能图标）；
- **7 条官方盟约成员表补全**：精准 / 远见 / 迅捷 / 助力 / 突袭 / 坚守 / 炎（把本包新增的干员补进去，界面才看得到）。

## 怎么装

1. 下载 [dist/dong-pack-v1.2.zip](dist/dong-pack-v1.2.zip)；
2. 在整合包里把 zip **拖到 `安装工坊包.bat`** 上，或命令行：

   ```bat
   cd /d <游戏目录>
   node tools\workshop-pack.mjs import D:\tmp\dong-pack-v1.2.zip
   ```

   也可以手动解压：把 zip 里全部内容解到 `<游戏目录>\workshop\dongShip\`（`pack.json` 必须在这一层）；
3. 重启服务器（`启动游戏.bat`，或 `scripts\install-service-windows.ps1 -Restart`），浏览器 Ctrl+Shift+R。

验收：`curl.exe -s http://127.0.0.1:3000/healthz` 里应有 `"modPacks":1`；游戏里盟约一览能看到【东】。

## 仓库结构

```
packs/dongShip/        工坊包本体（pack.json 在这一层；装载器认这个形状）
  ├─ pack.json         清单：content / overrides / server.meta.registers / itemIcons / voices / art
  ├─ bonds.json chess.json garrisons.json items.json
  ├─ kits/             7 个手写行为层脚本
  ├─ server/           meta 与 battle 两个模块
  ├─ assets/           172 个素材（含 112 个语音 mp3）
  ├─ notice/ bond-specs/ item-specs/
  └─ PROVENANCE.md     署名、来源、改动台账与素材清点
dist/                  两个可下载的 zip（扁平 / 仓库形态）
```

## 许可与素材

- 本包代码（`kits/**`、`server/**` 中本包部分、原创 JSON 数据）：**GPL-3.0-or-later**；
- 随包素材**含《明日方舟》官方素材**（Spine / 立绘 / 头像 / 技能图标 / 干员语音 / 道具图标，共 171 个文件；
  盟约图标为作者自制），版权归**上海鹰角网络科技有限公司 / Yostar 及其授权方**，
  本包与发布者**不主张**任何权利，**仅供非商业**的学习与个人娱乐使用，**请勿用于任何商业场景**；
- 逐条来源与实测清点见 [packs/dongShip/PROVENANCE.md](packs/dongShip/PROVENANCE.md) 第 6 节。

## 怎么更新

1. 改 `packs/dongShip/` 里的数据 / 模块 / kit（改盟约数值时 `bonds.json` 与 `bond-specs/` 一起改）；
2. 用引擎自己的校验器过一遍：
   `SP_WORKSHOP=<干净工坊根> node <引擎>/tools/workshop-validate.mjs --workshop <根> --json`（**errors 必须 0**）；
3. 重打 `dist/` 两个 zip（条目名必须是正斜杠 `/`，别用会把成员名写成反斜杠的工具）；
4. 一个主题一个 commit，信息一行说清改了什么，然后 `git push`。
