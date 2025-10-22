@echo off
REM 一键启动本地服务器并打开页面（Windows）
REM 运行条件：优先使用 Python；若无，则尝试 Node+npx；否则提示安装

setlocal enabledelayedexpansion
cd /d %~dp0
set PORT=5500

REM 尝试使用 Python (py)
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo 使用 Python 启动本地服务器...
  start "" http://127.0.0.1:%PORT%/index.html
  py -m http.server %PORT% --bind 127.0.0.1
  goto :eof
)

REM 尝试使用 Python (python)
where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo 使用 Python 启动本地服务器...
  start "" http://127.0.0.1:%PORT%/index.html
  python -m http.server %PORT% --bind 127.0.0.1
  goto :eof
)

REM 尝试使用 Node.js (npx http-server)
where node >nul 2>&1
if %ERRORLEVEL%==0 (
  echo 使用 Node.js 启动本地服务器...
  start "" http://127.0.0.1:%PORT%/index.html
  npx -y http-server@latest -p %PORT% -a 127.0.0.1
  goto :eof
)

echo 未检测到 Python 或 Node.js。
echo 请安装 Python 或 Node.js 后，重新雙擊本文件；
echo 或者使用 VS Code 的 Live Server 插件打开 index.html。
pause 