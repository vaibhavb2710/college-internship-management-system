@echo off
REM College Internship Management System - Startup Script (Windows)
REM This script starts both the backend and frontend servers

echo.
echo ============================================
echo College Internship Management System
echo Startup Script - Windows
echo ============================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] MongoDB might not be running!
    echo Please start MongoDB first:
    echo   - Windows: Start MongoDB service or run 'mongod'
    echo.
    pause
)

REM Start Backend in new terminal
echo Starting Backend Server...
start cmd /k "cd backend && venv\Scripts\activate && python app.py"

REM Wait a bit for backend to start
timeout /t 2 /nobreak

REM Check if requirements are installed
if not exist "backend\venv" (
    echo [ERROR] Backend virtual environment not found!
    echo Please run: cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start Frontend in new terminal
echo Starting Frontend Server...
start cmd /k "npm run dev"

echo.
echo ============================================
echo Servers starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Test Login (if database seeded):
echo   Email: rahul.sharma@vit.edu.in (Student)
echo   Password: student123
echo ============================================
echo.
echo Note: Close the terminal windows when done
pause
