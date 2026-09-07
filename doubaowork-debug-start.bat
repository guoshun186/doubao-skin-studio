@echo off
title DoubaoWork Debug Start (CDP port 9223)
echo ============================================
echo  DoubaoWork - start with CDP debug port 9223
echo ============================================
echo.
echo [1/3] Killing running DoubaoWork processes...
taskkill /IM DoubaoWork.exe /F >nul 2>&1
echo [2/3] Waiting 2 seconds...
timeout /t 2 /nobreak >nul
echo [3/3] Starting DoubaoWork with --remote-debugging-port=9223 ...
start "" "E:\Program Files (x86)\DoubaoWork\Application\DoubaoWork\app\DoubaoWork.exe" --remote-debugging-port=9223
echo.
echo Started. Verify with: curl http://127.0.0.1:9223/json/version
echo.
pause
