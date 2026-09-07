@echo off
title DoubaoWork - Restore Native Appearance
echo ============================================
echo   DoubaoWork - restore native appearance
echo ============================================
echo.
echo [1/3] Closing DoubaoWork processes...
taskkill /IM DoubaoWork.exe /F >nul 2>&1
echo [2/3] Waiting 2 seconds...
timeout /t 2 /nobreak >nul
echo [3/3] Starting DoubaoWork in native mode...
start "" "E:\Program Files (x86)\DoubaoWork\Application\DoubaoWork\app\DoubaoWork.exe"
echo.
echo Restored to native appearance.
echo.
pause
