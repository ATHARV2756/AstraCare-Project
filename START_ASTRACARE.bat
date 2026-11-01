@echo off
setlocal
title AstraCare - AI-Based Women's Health Platform

:: Navigate to script directory
cd /d "%~dp0"

echo =====================================================================
echo           ASTRACARE - AI-BASED WOMEN'S HEALTH PLATFORM
echo =====================================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not detected in your system PATH.
    echo Please install Node.js from https://nodejs.org/ and run this file again.
    echo.
    pause
    exit /b 1
)

:: 2. Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [*] First-time run: Installing dependencies...
    echo     Please wait a moment...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: 3. Launch application (Starts Backend, Starts Frontend, Opens Browser)
node launch.mjs

if %errorlevel% neq 0 (
    echo.
    echo [Notice] Launcher process exited.
    pause
)
