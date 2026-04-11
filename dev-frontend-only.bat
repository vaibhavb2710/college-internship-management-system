@echo off
REM ============================================================================
REM Simple Frontend-Only Server Starter
REM Use this if backend is already running elsewhere
REM ============================================================================

SETLOCAL ENABLEDELAYEDEXPANSION

SET "PROJECT_ROOT=%~dp0"

echo.
echo ============================================================================
echo  ^>^> FRONTEND SERVER ONLY (React Vite + HMR)
echo ============================================================================
echo.
echo Frontend: http://localhost:5173 (with auto-reload)
echo Backend:  Expecting http://127.0.0.1:5000 (should be running)
echo.
echo ============================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    pause
    exit /b 1
)

REM Start Frontend Server
cd /d "!PROJECT_ROOT!"
npm run dev

pause
