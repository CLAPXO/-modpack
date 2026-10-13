# 东盟约（dongShip）v1.2.0 —— 部署说明（包内副本）

一个可以直接拿到**别人的服务器**上用 Forge 装上就跑的完整工坊包（不需要改引擎、不需要额外素材）。

| | |
|---|---|
| 包 id / 名称 | `dongShip` / **东盟约** |
| 版本 | `1.2.0`（`pack.json` 的 `version`） |
| 发布件 | `dong-pack-v1.2.zip`（zip 根就是包根，192 个文件 / 6.69 MB）；另有 `dong-pack-v1.2-repo.zip`（外面套一层 `dongShip/`） |
| 哈希 / 指纹 | 见包内 `PROVENANCE.md`（发布件内容指纹）与发放时一起附的那份说明（zip 的 sha256） |
| 引擎 | 卫戍协议：盟约 **v0.17.0**（`pack.json` 声明 `game: "0.2.x"`、`api: ">=1 <2"`、`combat: true`） |
| 实测 | 在**全新工作坊目录**里导入 → 与源包**逐字节一致**；`workshop-validate` **0 error / VALID**；另起一台服务器（`PORT=3001` + `SP_WORKSHOP` 指向刚导入的目录）实测：`modPacks=1`，道具图标 / 语音 / Spine / 立绘 / 盟约图标 / 公告全部 200 |

---

## 一、怎么装（三种，任选一种）

**① 用 Forge 自带的导入工具（最稳）**

```bat
:: Windows：把 zip 拖到 安装工坊包.bat 上，或者
cd <游戏目录>\app
node tools\workshop-pack.mjs import "路径\dong-pack-v1.2.zip"
```

装完输出形如：`已安装 dongShip → <游戏目录>\app\workshop\dongShip`。

**② 用编辑器**

双击 `启动编辑器.bat` → 右上角 **包管理** → 导入 zip → 确认启用。

**③ 手动解压**

把 zip 里的全部内容解压到 `<游戏目录>\app\workshop\dongShip\`（`pack.json` 必须正好在这一层），再到编辑器的包管理里确认它被启用。

> 三种方式装出来的目录是同一份东西；① 和 ② 还会在 `<游戏目录>\app\var\mod-registry.json` 里登记/启用这个包。

**装完必须**：重启游戏服务器（`启动游戏.bat`），浏览器 **Ctrl+Shift+R**。

## 二、包里有什么

```
dongShip/
├─ pack.json              包清单：content / overrides / server.meta.registers / itemIcons / voices / voiceLangs / art
├─ bonds.json             核心盟约【东】1 条（12 名成员）
├─ chess.json             24 枚棋子（12 名成员 × 普通/精锐）
├─ garrisons.json         17 条特质记录（9 组，含 2 个自定义 effectKey）
├─ items.json             2 条（新装备「艺人见面抽选券」普通/精锐）
├─ kits/                  7 个行为层脚本（白雪 / 火龙S黑角 / 吉星 / 夜刀 / 遥 / 嵯峨 / 斩业星熊）
├─ server/
│   ├─ meta/dong.mjs      meta 通道：2 个特质处理器（火龙整备池、安洁莉娜加层）+ 1 个装备处理器
│   └─ battle/dong.mjs    战斗层：追加攻击（按目标弱点类型结算）+ 6 名时的神经损伤
├─ notice/announcement.json   8 节公告（会显示在游戏公告里）
├─ bond-specs/ item-specs/    编辑器的"源"（用编辑器改数值时的单一来源）
├─ assets/                172 个素材文件 / 13.6 MB
│   ├─ spine/  36 个（6 名干员 × 正/背面模型）
│   ├─ char/   12 个（4 名自增干员的头像 + 立绘）
│   ├─ skill/   9 个技能图标
│   ├─ item/    2 个（新装备图标：普通=银、精锐=金）
│   ├─ bond/    1 个盟约图标
│   └─ voice/ 112 个 mp3 / 2.27 MB（白雪 / 吉星 / 麒麟R夜刀 / 火龙S黑角 × 12 个战斗槽位 × 日·中两套）
└─ PROVENANCE.md          出处与改动台账（含素材版权声明）
```

**玩法速览**：入口门槛 3 名不同【东】；6 名强化。核心效果 = 成员造成伤害时**追加一次按目标弱点类型结算的攻击**（攻击力 ×（3.3% + 0.275% × 层数）），6 名时同时积累神经损伤（60/次）。另有 9 组专属特质、4 名新干员的模组、1 件新装备（每回合给已激活盟约加层，并与「变形同构体」配对时授予【东】）。

## 三、装完怎么验（30 秒）

1. `http://<服务器>:3000/healthz` → `"modPacks": 1`；
2. 游戏里**盟约一览**能看到【东】、公告里能看到「东盟约」那一栏；
3. 商店刷到 4 阶装备 **「艺人见面抽选券」**（图标就是那张票券）；
4. 局内打一把：满 3 名【东】后伤害会多跳一次；把语音语言切 日本語 / 中文，4 名自增干员都会说话（白雪 / 吉星 / 夜刀 / 黑角）。

命令行复核（可选）：

```bat
cd <游戏目录>\app
node tools\workshop-validate.mjs workshop\dongShip      :: 期望 0 error(s) / VALID
```

## 四、卸载

编辑器 → 包管理 → 删除该包（会同时清掉 `var/mod-registry.json` 里的登记），或直接删 `app\workshop\dongShip\` 目录，然后重启服务器。

## 五、在云服务器（Windows）上部署 Forge + 装这个包

> **路径约定**：**整合包 / 发布包**（`Stronghold-Protocol-v<版本>.zip`）解压后**根目录就是游戏目录**（下面写作 `C:\Stronghold-Protocol`），`workshop\`、`tools\`、`var\`、`logs\`、`scripts\` 都在它下面。
> **源码 / 开发布局**（像我这台）在根目录下多一层 `app\`：这时把下面所有 `C:\Stronghold-Protocol\...` 换成 `<游戏目录>\app\...`。
> 本包声明的引擎版本是 **0.17.0 / 游戏 0.2.x**（`pack.json` 的 `game`、`api`）。

### 5.0 Forge 是什么？和"游戏包"要不要覆盖？

**不用覆盖。Forge 就是你服务器上跑的那份程序本身**（`server\` 服务端 + `editor\`/`tools\` 工坊工具 + `workshop\` 包目录 + `data\` 上游数据 + `public\` 客户端），装"包"是导入进它的 `workshop\`，不是把文件拷进游戏。

两套版本号别混淆：

| 版本号 | 含义 | 看哪 |
|---|---|---|
| **0.2.4**（0.2.x） | **上游游戏内容**（干员/技能/道具数据 + 素材） | `pack.json` 的 `game`、`docs\PS100-MIGRATION.md` |
| **0.17.0** | **Forge 自研引擎**（服务端 + 工坊 + 客户端） | `package.json` 的 `version`、`/healthz` 的 `app` |

Forge 已经**包含**上游数据（`data\*.json`）与素材（`public\assets`），所以"另外那个 0.2.4 游戏包"**不需要**盖进来。一条命令确认你手上这份就是 Forge：

```powershell
cd C:\Stronghold-Protocol
node -e "console.log(require('./package.json').name, require('./package.json').version)"
# → stronghold-protocol-alliance 0.17.x     并且  tools\workshop-pack.mjs 存在
```

**只有这两种情况才叫"覆盖到文件夹"**：

| 目的 | 正确做法 |
|---|---|
| 升级 **Forge 自己** | 用官方**更新包**：`-Stop` → `Expand-Archive -Force <下载>\Stronghold-Protocol-v<版本>-update.zip <安装目录的上一层>` → `-Restart`（`docs\DEPLOY.md` §1.5） |
| 把**上游数据**升到新版本 | 用 Forge 自带的构建/素材工具（`npm run build-data`、`node tools\fetch-assets.mjs`），或直接用带新数据的 Forge 更新包；**不要**手工把某个游戏包的 `data\` 解压覆盖进来（会和 `data\assets.json`、golden 语料对不上） |

本包声明 `game: "0.2.x"`（含 0.2.4）、`api: ">=1 <2"`，数据是 0.2.2 还是 0.2.4 都能装；你这台与打包时一致 ⇒ 直接按下面 5.1 → 5.2 做即可。
### 5.1 先把 Forge（引擎 + 编辑器）跑起来

1. **准备**：Windows 10/11 x64；整合包**自带 `node\`**（没有的话装 Node ≥ 22：`winget install OpenJS.NodeJS.LTS`）；解压到短、无空格、无中文、不在 OneDrive 下的目录，例如 `C:\Stronghold-Protocol`。
2. **首次启动**：双击 `C:\Stronghold-Protocol\scripts\start-windows.bat`（完整包已含运行依赖与素材，会跳过 `npm ci` 与素材下载）。窗口会打印可用地址，例如 `http://192.168.1.23:3000`；用另一台设备打开确认能进大厅。首次会弹「Windows 安全中心警报」——勾**专用网络**并允许。
   > 没装成服务时，**关掉这个窗口就是停服**。
3. **常驻后台（云服务器建议必做）**：先关掉上一步的窗口（否则端口冲突），然后管理员 PowerShell：

   ```powershell
   cd C:\Stronghold-Protocol
   powershell -ExecutionPolicy Bypass -File scripts\install-service-windows.ps1
   ```

   它会跑一次 `tools\setup.mjs` → 写 `scripts\service.env.cmd`（node 路径、端口等）→ 注册计划任务 **StrongholdProtocol**（开机 20 秒后**以 SYSTEM 身份**跑 `scripts\run-server.cmd`，无需登录，退出后 5 秒自动重启）→ 加防火墙规则 → 立即启动并打印状态。日志在 `logs\server.log`（>10 MB 自动轮换）。

   | 需求 | 在后面加的参数 |
   |---|---|
   | 换端口 / 只给反代监听 | `-Port 8080`、`-BindHost 127.0.0.1` |
   | 查看状态与最近日志 | `-Status` |
   | 重启（改完配置 / 装完包） | `-Restart` |
   | 停止（下次开机仍自启） / 彻底卸载 | `-Stop` / `-Uninstall` |
   | 公用网络（Tailscale 网卡等）也放行 | `-AllowPublicNetwork` |

   > ⚠️ **别把服务器挂在远程桌面会话里**：会话注销会带走控制台进程。用上面的计划任务（或 NSSM，见 `docs\DEPLOY.md` §1.4）。
   > 台机器是云主机时，**云厂商控制台的「安全组 / 防火墙」还要放行端口**（默认 3000，入方向 TCP）——这一步在 Windows 里面做不了。
4. **编辑器（工坊编辑器，就是 Forge 的那半）**：

   ```bat
   cd C:\Stronghold-Protocol
   node tools\workshop-editor.mjs --open        :: 默认 http://127.0.0.1:3311
   ```

   它**故意只绑定 127.0.0.1**（编辑器能改包与 `data\support.json`；`--host 0.0.0.0` 会打警告）。远程要用：
   - 远程桌面里直接在服务器上开浏览器访问 `http://127.0.0.1:3311`；
   - 或 SSH 端口转发：`ssh -L 3311:127.0.0.1:3311 user@<服务器>` 然后本地开 `http://127.0.0.1:3311`；
   - **不要**把 3311 直接暴露到公网。
   > `启动编辑器.bat`（源码布局）/ `scripts\` 里对应的那个，等价于这条命令。

### 5.2 再装这个包（dongShip）

```bat
:: ① 传上去：远程桌面直接拖拽，或用 Windows 自带的 scp / 面板文件管理
scp .\dong-pack-v1.2.zip user@<服务器>:D:\tmp\

:: ② 装包（最省事：把 zip 拖到 安装工坊包.bat 上）
cd /d C:\Stronghold-Protocol
node tools\workshop-pack.mjs import D:\tmp\dong-pack-v1.2.zip
::   → 已安装 dongShip → C:\Stronghold-Protocol\workshop\dongShip
::   装到别的工作坊目录：--workshop <目录>；覆盖同名包：--force；只看已装包：node tools\workshop-pack.mjs list

:: ③ 重启服务（包是启动时加载的，刷新浏览器没用）
powershell -ExecutionPolicy Bypass -File scripts\install-service-windows.ps1 -Restart
::   没装服务的：关掉 start-windows.bat 的窗口再双击一次
```

### 5.3（可选）只有"云服务器的游戏版本与打包时不同"才需要

你这台**与打包时一致** ⇒ **跳过这一步**。以后换版本再做：

```bat
node D:\tmp\refresh-chess-overrides.mjs --app C:\Stronghold-Protocol --dry   :: 先看
node D:\tmp\refresh-chess-overrides.mjs --app C:\Stronghold-Protocol         :: 再写（备份进 .tune-backup\）
```

它以**那台服务器自己的** `data\*.json` 为底，把本包重写的 **10 条官方棋子记录 + 7 条官方盟约成员表**（精准 / 远见 / 迅捷 / 助力 / 突袭 / 坚守 / 炎，加入本包新增干员）换成"本机官方副本 + 本包的差值"，
并做**兼容性体检**（本包新增的 id 若已被新版官方收录会点名，需要加进 `pack.json` 的 `overrides`）。源码布局加 `\app`。

### 5.4 验收

```powershell
curl.exe -s http://127.0.0.1:3000/healthz | Select-Object -First 1        :: 期望 "modPacks":1
cd C:\Stronghold-Protocol
node tools\workshop-validate.mjs workshop\dongShip                       :: 期望 0 error(s) / VALID
node tools\workshop-pack.mjs list                                        :: 应看到 dongShip 1.1.0
```

游戏里再点一眼：盟约一览有【东】、公告里有「东盟约」、4 阶商店能刷到「艺人见面抽选券」、语音切中/日时 4 名自增干员会说话。

### 5.5 常见卡点

| 现象 | 原因 / 处理 |
|---|---|
| `'node' 不是内部或外部命令` | Node 不在 PATH：用整合包自带的 `C:\Stronghold-Protocol\node\node.exe` 代替命令里的 `node` |
| `MOD_API_INCOMPATIBLE` | 那台的 mod API 不是 1；本包声明 `api: ">=1 <2"`，按提示确认引擎版本 |
| `OFFICIAL_ID_COLLISION` | 新版官方数据已含本包某个"新增" id ⇒ 跑 5.3 的体检，把点名的加进 `overrides` |
| `healthz` 里 `modPacks: 0` | 包没启用 / 没重启：编辑器包管理里确认启用，或看 `var\mod-registry.json` |
| 朋友连不上、本机通 | ① 云控制台**安全组**没放行端口；② Windows 防火墙（`install-service-windows.ps1` 会加，`-AllowPublicNetwork` 管公用网络）；③ `-BindHost 127.0.0.1` 时只能反代访问 |
| 道具图标或语音 404 | 素材走 `/workshop-assets/<包id>/…`；反向代理要放行这个前缀（默认同源） |
| 干员显示菱形占位 | `art` 没生效：确认 zip 完整（`assets\spine\**`）并已重启 |
| 端口被占用 | 先 `-Stop`（或关掉前台窗口）再启动；换端口用 `-Port 8080` |
| 路径带空格 / 中文 | 命令里加引号；安装目录尽量用 `C:\Stronghold-Protocol` 这种短路径 |
## 六、须知（三件小事）

1. **不需要改引擎**：所有数据、行为脚本、素材都在包内；素材走引擎既有的 `/workshop-assets` 路由，客户端零改动。
2. **校验器会报 8 条 `VOICE_UNKNOWN_OPERATOR`**（"这行永远播不出来"）—— 那是**工具的误报**：它拿 charId 去和"棋子 id 集合"比较，对任何包都成立不了。包里这 4 名干员的语音是**包自带**的（`pack.json` 的 `voices` / `voiceLangs`），实测中文与日文都能取到并播放（`/workshop-assets/dongShip/voice/<charId>/{jp,cn}/…` → 200 `audio/mpeg`）。其余 52 条警告是包内联 kits 的 bb 键（由 kits 自己读）与本包覆盖官方棋子记录时的既有项。
3. **版权**：随包的游戏素材（Spine、立绘、头像、技能图标、语音）版权归**上海鹰角网络科技有限公司 / Yostar 及其授权方**所有，本包为**非商业同人**内容，不主张任何权利；请勿用于售卖、付费分发、收费开服、广告、打赏等任何商业场景。细节见包内 `PROVENANCE.md` §6.3。