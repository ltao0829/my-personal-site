@echo off
chcp 65001 > nul
echo ===================================================
echo   正在启动 LiuTao 的个人网站本地开发服务器...
echo   浏览器窗口将自动打开 http://localhost:8000
echo   若要停止服务器，请关闭当前命令行窗口。
echo ===================================================
start "" "http://localhost:8000"
python -m http.server 8000
