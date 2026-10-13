# 东盟约（dongShip）—— 卫戍协议：盟约 工坊包

本仓库是《卫戍协议：盟约》非官方同人**工坊包**「东盟约」的发布仓库：加入**核心盟约【东】**，
12 名成员 / 24 枚棋子 / 10 组专属特质（19 条记录）/ 1 件新装备 / 1 个战斗层效果 / 7 个手写行为层 kit，
并把 7 条官方盟约的成员表补全。

| | |
|---|---|
| 包 id / 名称 / 版本 | dongShip / 东盟约 / **1.2.0** |
| 引擎 / 游戏 | Forge **0.18.3** / 游戏数据 **0.2.5**（api >=1 <2，game 0.2.x） |
| 层 / combat | B / **true（会改变对局结果）** |
| 包内容位置 | [packs/dongShip/](packs/dongShip)（与上游 Stronghold-Protocol-Forge-Mods 的 packs/ 同形状） |
| 下载件 | [dist/dong-pack-v1.2.zip](dist/dong-pack-v1.2.zip)（**扁平**，pack.json 在 zip 根）/ [dist/dong-pack-v1.2-repo.zip](dist/dong-pack-v1.2-repo.zip)（顶层目录 = 包 id） |
| 署名与来源 | [packs/dongShip/PROVENANCE.md](packs/dongShip/PROVENANCE.md)（六项）/ [SOURCE.md](SOURCE.md)（五件事）|
| 验证 | [verify/](verify)：引擎校验器 errors=0、仓库闸门 check-packs 通过（退出码 0）|

## 怎么装

1. 下载 [dist/dong-pack-v1.2.zip](dist/dong-pack-v1.2.zip)（或用仓库形态那份，两种装载器都认）；
2. 在整合包里把 zip **拖到 `安装工坊包.bat`** 上，或命令行：

   ```bat
   cd /d <游戏目录>
   node tools\workshop-pack.mjs import D:\tmp\dong-pack-v1.2.zip
   ```

3. 重启服务器（`启动游戏.bat` / `scripts\install-service-windows.ps1 -Restart`），浏览器 Ctrl+Shift+R。

验收：`curl.exe -s http://127.0.0.1:3000/healthz` 里应有 `"modPacks":1`；游戏里盟约一览能看到【东】。

## 仓库结构

```
packs/dongShip/       工坊包本体（pack.json 在这一层）
dist/                 两个可下载的 zip（扁平 / 仓库形态）
verify/               引擎 0.18.3 上的两道闸门原始输出
SOURCE.md             原件叫什么/从哪来、原作者、许可、改了什么、素材哪来的
上传说明.md           上游投稿的三条落点、素材披露段、PR 说明模板
git上传步骤.md        想把包提到上游 packs/ 的完整步骤（网页 / git 两条路线）
```

## 许可与素材

- 本包代码（`kits/**`、`server/**` 中本包部分、原创 JSON 数据）：**GPL-3.0-or-later**；
- 随包素材：**含《明日方舟》官方素材**（Spine / 立绘 / 头像 / 技能图标 / 干员语音 / 道具图标，共 171 个文件），
  版权归**上海鹰角网络科技有限公司 / Yostar 及其授权方**，本包与发布者**不主张**任何权利，
  **仅供非商业**的学习与个人娱乐使用，**请勿用于任何商业场景**；盟约图标为作者自制；
- 逐条来源与实测清点见 [packs/dongShip/PROVENANCE.md](packs/dongShip/PROVENANCE.md) 第 6 节。

## 更新这个包

1. 改 `packs/dongShip/` 里的数据 / 模块 / kit（改数值时 `bonds.json` 与 `bond-specs/` 一起改）；
2. 用引擎校验：`SP_WORKSHOP=<干净工坊根> node <引擎>/tools/workshop-validate.mjs --workshop <根> --json`（errors 必须 0）；
3. 重打 zip（条目名必须是正斜杠 `/`，别用会把成员名写成 `\` 的工具）并更新 `dist/` 与 `verify/`；
4. 提交：一个主题一个 commit，信息一行说清改了什么。
