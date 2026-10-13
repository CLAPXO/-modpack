# 上传到 GitHub（XiaMo233M/Stronghold-Protocol-Forge-Mods）—— 照着做

**前提判断**：本包（`dongShip` 1.2.0）**已经能装**、两道闸门都过了 ⇒ 按 `UPLOAD.md` / `packs/README.md` 的定义，
它走 **`packs/`**，**不是 `incoming/`**（`incoming/` 是"还没做兼容"的原件存放处，投过去会被要求改走 packs）。

---

## 路线 A · 网页上传（不装 git，192 个文件要分批）

1. 打开 https://github.com/XiaMo233M/Stronghold-Protocol-Forge-Mods
2. **没有写权限**：先点右上角 **Fork**（得到 `<你的用户名>/Stronghold-Protocol-Forge-Mods`），之后所有操作都在你的 fork 里做。
3. 进 `packs/` 目录 → **Add file ▾ → Upload files**。
4. 把提交包里的 **`packs-layout/dongShip` 整个文件夹**拖进去（拖文件夹会保留相对路径 ⇒ 落到 `packs/dongShip/…`）。
   - ⚠️ **网页一次最多 100 个文件**，本包 192 个 ⇒ 分 2～3 批，每批都往 **同一个 `packs/dongShip/`** 路径传。
     建议顺序：第 1 批 `pack.json` `bonds.json` `chess.json` `garrisons.json` `items.json` `PROVENANCE.md` `README-部署说明.md` `kits/` `server/` `notice/` `bond-specs/` `item-specs/`；
     第 2 批 `assets/char` + `assets/skill` + `assets/item` + `assets/bond` + `assets/voice`；
     第 3 批 `assets/spine`。
5. 页面底部 **Commit changes**：
   - 有写权限：选 **Commit directly to the `main` branch**；
   - 没有写权限：选 **Create a new branch for this commit and start a pull request** → 提交后到 PR 页面点 **Create pull request**。
6. 提交信息（一行，仓库规矩：一个主题一个 commit、不加 `Co-Authored-By` 之类的署名尾巴）：

   ```
   上传 packs/dongShip（东盟约 1.2.0，含官方素材已标注）
   ```

---

## 路线 B · git（推荐：192 个文件一次到位，字节最稳）

> 仓库 `packs/` 里放的是**解开的文件**（不是 zip），并且 `packs/README.md` 提醒过：git 的
> 换行归一化（`core.autocrlf`）会让仓库里那份与 zip 差几个字节 ⇒ **先关掉它**。

```bat
:: ① 关掉换行转换（一次就够，全局设置）
git config --global core.autocrlf false

:: ② 克隆仓库（有写权限用主仓库；没有就 fork 后 clone 你自己的）
cd /d F:\wsxy
mkdir _gh 2>nul & cd _gh
git clone https://github.com/XiaMo233M/Stronghold-Protocol-Forge-Mods.git
:: 没有写权限时改成：
:: git clone https://github.com/<你的用户名>/Stronghold-Protocol-Forge-Mods.git
cd Stronghold-Protocol-Forge-Mods

:: ③ 把包解到 packs/ 下（仓库形态 zip 的顶层目录就是包 id，条目名全是 /）
cd packs
tar -xf F:\wsxy\dong-pack-v1.2-repo.zip
::   解出来就是 packs\dongShip\**（pack.json 在 packs\dongShip\pack.json）
cd ..

:: ④ 确认只多了我们这一个包（仓库规矩：只应看到自己改的文件）
git status --porcelain
::   期望：只有  ?? packs/dongShip/  （以及它下面的一堆文件）

:: ⑤ 提交（用**明确路径**，不要 git add -A）
git add packs/dongShip
git commit -m "上传 packs/dongShip（东盟约 1.2.0，含官方素材已标注）"

:: ⑥ 推送
git push
::   没有写权限：先 push 到你自己的 fork（上面 clone 的是你的 fork 时直接 push 即可），
::   然后到 GitHub 上点 "Compare & pull request" 开 PR
```

### 可选：用 Git 桌面 / VS Code
同样是"把 `dongShip` 文件夹放进 `packs/` → commit → push/PR"，没有额外规则；只要**别**顺手改 `site/**`、
别的包，或往包里"优化"文件（`packs/` 下的包内容按只读对待）。

---

## 路线 C · 只要上传到**审核站**（不走仓库）

用提交包里的 **`site-upload/dong-pack-v1.2.zip`**（**扁平**：`pack.json` 在 zip 根 —— 套了顶层目录会被 400 拒收），
在站点首页填「mod 名 + 备注」→ 选 zip → 上传 ⇒ 进待审队列。备注里贴提交包 `上传说明.md` 第 4 节那段素材披露。

---

## 提交时可以直接粘的 PR 说明

```markdown
## 什么
新增 packs/dongShip（东盟约 v1.2.0）：核心盟约【东】+ 12 名成员 / 24 枚棋子 / 10 组专属特质（19 条记录）/
1 件新装备 / 1 个战斗层模块 / 7 个手写 kit / 7 条官方盟约成员表补全 / 4 名干员的语音与美术。

## 来源
作者 CLa 本人的作品（原为面向 r25 / v0.2.1 的安装器型 mod，本包是它的工坊包重写版）。
包内 PROVENANCE.md 六项俱全、SOURCE.md 五件事俱全。

## 契合性
- combat: true（会改对局结果；pack.json.description 与公告「须知」均已讲明）
- 未改引擎源码；不使用任何"整份覆盖引擎文件"的形态；包内无可执行物（实测扫描 .bat/.cmd/.exe/.dll/.ps1 = 0）
- 含官方素材（172 个文件中 171 个，另有 1 个自制盟约图标）：PROVENANCE.md §6 有机械清点与逐条来源，
  已写明版权归鹰角网络 / Yostar、仅供非商业使用、本包与发布者不主张权利

## 验证（引擎 0.18.3 / 游戏 0.2.5，原始输出在提交包 verify/）
node tools/check-packs.mjs --engine <引擎 app 目录> --root packs
  ✓ dongShip  1.2.0  层 B · 会改战斗结果  api=>=1 <2  东盟约
  ✓ 闸门通过（packs/ 与 demo/ 里的包全部装上）   退出码 0
SP_WORKSHOP=<干净工坊根> node <引擎>/tools/workshop-validate.mjs --workshop <根> --json
  errors = 0，warnings = 60
  （52 条 BB_UNKNOWN_KEY = 本包手写 kit 自己读的 bb 键；8 条 VOICE_UNKNOWN_OPERATOR = 校验器拿 charId
    比棋子 id 的既有误报，本包自带语音实测中/日双语可播）
```

---

## 常见卡点（仓库 docs 里踩过的）

| 现象 | 原因 / 处理 |
|---|---|
| 上传后装不上、报 `PACK_ID_MISMATCH` | 目录名必须 **等于** `pack.json.id` ⇒ 路径必须是 `packs/dongShip/pack.json` |
| 包内容"少了几字节" | `core.autocrlf` 改了换行 ⇒ 先 `git config --global core.autocrlf false` 再 `git add` |
| 网页上传只进去一半 | 网页一次最多 100 个文件 ⇒ 分批（见路线 A 第 4 步） |
| 站点 400 拒收 | 站点只读 **zip 根**的 `pack.json` ⇒ 用扁平件（`site-upload/`），不要用仓库形态 |
| `git status` 里混进别的东西 | 仓库规矩：提交用明确路径 `git add packs/dongShip`，不要 `-A` |
| PR 里被要求改引擎/改校验 | **不要** —— 校验不过就改包，不放开闸门（`AGENTS.md` 硬规则） |
