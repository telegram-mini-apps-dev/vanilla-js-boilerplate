@echo off
 
:: 设置Git仓库的路径
set REPO_PATH=git@github.com:higherzhouhui/telegram-mini.git
 
:: 进入Git仓库目录
cd H:\telegrammini\telegram-mini
 
:: 配置Git用户信息（如果尚未配置）
git config --global user.email "782492184@qq.com"
git config --global user.name "ahui"
 
:: 检查是否有未提交的改动
git diff-index --quiet HEAD
if errorlevel 1 (
    :: 添加所有改动到暂存区
    git add .
 
    :: 提交改动
    git commit -m "Auto-commit"
 
    :: 推送改动到远程仓库
    git push origin/master
)
 
:: 退出批处理
exit