@echo off
title DoubaoWork - Start with Juzizhou Skin
echo ============================================
echo   DoubaoWork - one-click start with skin
echo ============================================
echo.
echo [1/4] Closing DoubaoWork processes...
taskkill /IM DoubaoWork.exe /F >nul 2>&1
echo [2/4] Starting DoubaoWork with CDP port 9223...
start "" "E:\Program Files (x86)\DoubaoWork\Application\DoubaoWork\app\DoubaoWork.exe" --remote-debugging-port=9223
echo [3/4] Waiting for DoubaoWork UI to load...
cd /d "%~dp0"
node src\apply-skin.mjs
echo.
echo [4/4] Done! DoubaoWork is running with the Juzizhou theme.
echo.
echo NOTE: This skin is designed for DARK MODE only.
echo In light mode, text may be hard to read.
echo.
pause
