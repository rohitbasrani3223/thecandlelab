@echo off
setlocal enabledelayedexpansion
title The Candle Lab — Backend Server Launcher

echo ====================================================
echo  Launching The Candle Lab Backend Server...
echo ====================================================

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0START-BACKEND.ps1"

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Backend launcher encountered an error.
    pause
)

