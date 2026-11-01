@echo off
setlocal
title AstraCare - Stop Services
cd /d "%~dp0"

echo =====================================================================
echo           ASTRACARE - STOPPING ALL RUNNING SERVICES
echo =====================================================================
echo.

echo [*] Freeing port 5000 (Backend API)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)

echo [*] Freeing port 3000 (Vite Web App)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>nul
)

echo [✓] All AstraCare background services have been stopped.
echo.
pause
