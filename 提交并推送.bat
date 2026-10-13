@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

:: ======== 只改下面这两行（你的名字 / 你的邮箱） ========
set "GITNAME=CLa"
set "GITMAIL=cbt163163163@email.com"
:: =======================================================

echo [1/4] 设置本仓库的作者信息
git config user.name "%GITNAME%"
git config user.email "%GITMAIL%"
git config core.autocrlf false

echo [2/4] 暂存 + 提交
git add -A
git commit -m "东盟约 dongShip 1.2.0（Forge 0.18.3 / 游戏 0.2.5）"

echo [3/4] 设置远程仓库
set /p URL=粘贴你新建的空仓库地址（https://github.com/用户名/仓库名.git）：
git remote remove origin 2>nul
git remote add origin "%URL%"

echo [4/4] 推送
git branch -M main
git push -u origin main

echo.
echo 若认证失败：GitHub 不收密码 —— 密码处填 Personal Access Token（勾 repo），或先跑 gh auth login。
pause
