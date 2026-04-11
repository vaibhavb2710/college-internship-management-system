@echo off
REM ============================================================================
REM College Internship Management System - Development Server Starter
REM ============================================================================
REM This script starts both the backend and frontend development servers
REM Frontend: http://localhost:5173 (with auto-reload via Vite HMR)
REM Backend: http://127.0.0.1:5000 (with auto-reload via Flask reloader)
REM ============================================================================

SETLOCAL ENABLEDELAYEDEXPANSION

REM Get the directory where this script is located
SET "SCRIPT_DIR=%~dp0"
SET "PROJECT_ROOT=%SCRIPT_DIR%"

echo.
echo ============================================================================
echo  ^>^> COLLEGE INTERNSHIP MANAGEMENT SYSTEM - DEV SERVER
echo ============================================================================
echo.
echo Starting both frontend and backend servers...
echo.
echo Frontend: http://localhost:5173 (with HMR - Hot Module Reload)
echo Backend:  http://127.0.0.1:5000 (with Flask auto-reload)
echo.
echo IMPORTANT: Keep both terminal windows open to run the system
echo            Press CTRL+C in any window to stop that server
echo.
echo ============================================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

REM Check if MongoDB is running
echo Checking MongoDB connection...
node -e "const { MongoClient } = require('mongodb'); MongoClient.connect('mongodb://localhost:27017').catch(() => process.exit(1)).then(c => c.close());" 2>nul
if errorlevel 1 (
    echo.
    echo WARNING: MongoDB might not be running
    echo Make sure MongoDB is started before continuing
    echo.
    timeout /t 3
)

REM Start Backend Server in a new window
echo.
echo [1/2] Starting Backend Server (Python Flask)...
start "College Internship Mgmt - Backend" cmd /k ^
    cd /d "!PROJECT_ROOT!backend" ^& ^
    title Backend Server: http://127.0.0.1:5000 ^& ^
    python run_dev.py

REM Wait 2 seconds for backend to start
timeout /t 2 /nobreak

REM Start Frontend Server in a new window
echo.
echo [2/2] Starting Frontend Server (React Vite)...
start "College Internship Mgmt - Frontend" cmd /k ^
    cd /d "!PROJECT_ROOT!" ^& ^
    title Frontend Server: http://localhost:5173 ^& ^
    npm run dev

REM Keep this window open with instructions
echo.
echo ============================================================================
echo  ^>^> SERVERS STARTED SUCCESSFULLY!
echo ============================================================================
echo.
echo FRONTEND - http://localhost:5173
echo   - Vite HMR enabled: Changes auto-reload in browser
echo   - Proxies /api requests to backend
echo.
echo BACKEND - http://127.0.0.1:5000
echo   - Flask auto-reloader enabled: Changes restart server
echo   - REST API endpoints for frontend
echo.
echo TO STOP:
echo   - Frontend window: Press CTRL+C
echo   - Backend window:  Press CTRL+C
echo.
echo TROUBLESHOOTING:
echo   - If port 5173 is in use, Vite uses next available (5174, 5175...)
echo   - If port 5000 is in use, change FLASK_PORT in backend/.env or config.py
echo   - Make sure both Node.js and Python are installed
echo   - Make sure MongoDB is running
echo.
echo ============================================================================
echo.

REM Keep this window open
pause
