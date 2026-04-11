@echo off
REM ============================================================================
REM Simple Backend-Only Server Starter
REM Use this if frontend is already running elsewhere
REM ============================================================================

SETLOCAL ENABLEDELAYEDEXPANSION

SET "PROJECT_ROOT=%~dp0"

echo.
echo ============================================================================
echo  ^>^> BACKEND SERVER ONLY (Python Flask + Auto-reload)
echo ============================================================================
echo.
echo Backend:  http://127.0.0.1:5000 (with auto-reload)
echo Frontend: Expecting http://localhost:5173 (should be running)
echo.
echo ============================================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed
    pause
    exit /b 1
)

REM Start Backend Server
cd /d "!PROJECT_ROOT!backend"
python run_dev.py

pause
