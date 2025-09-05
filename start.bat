@echo off
echo 🚀 Bridge Project 快速启动
echo ================================
echo.

echo 选择启动方式:
echo 1. 开发模式 (前后端同时启动)
echo 2. 部署工具 (一键部署)
echo 3. Docker 部署
echo 4. 安装依赖
echo.

set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" (
    echo.
    echo 🔧 启动开发模式...
    npm run dev
) else if "%choice%"=="2" (
    echo.
    echo 🚀 启动部署工具...
    npm run deploy
) else if "%choice%"=="3" (
    echo.
    echo 🐳 启动 Docker 部署...
    docker-compose up -d
    echo.
    echo ✅ Docker 服务已启动
    echo 前端访问: http://localhost
    echo 后端API: http://localhost:3000
    echo.
    echo 查看日志: docker-compose logs -f
    echo 停止服务: docker-compose down
) else if "%choice%"=="4" (
    echo.
    echo 📦 安装所有依赖...
    npm run install:all
    echo.
    echo ✅ 依赖安装完成
) else (
    echo.
    echo ❌ 无效选择
)

echo.
pause
