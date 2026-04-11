# ============================================================================
# College Internship Management System - Development Server Starter (PowerShell)
# ============================================================================
# This script starts both the backend and frontend development servers
# Frontend: http://localhost:5173 (with auto-reload via Vite HMR)
# Backend: http://127.0.0.1:5000 (with auto-reload via Flask reloader)
# ============================================================================

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = $scriptDir

Write-Host "`n" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  >> COLLEGE INTERNSHIP MANAGEMENT SYSTEM - DEV SERVER" -ForegroundColor Cyan
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting both frontend and backend servers..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173 (with HMR - Hot Module Reload)" -ForegroundColor Yellow
Write-Host "Backend:  http://127.0.0.1:5000 (with Flask auto-reload)" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Keep both PowerShell windows open to run the system" -ForegroundColor Magenta
Write-Host "           Press CTRL+C in any window to stop that server" -ForegroundColor Magenta
Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Python from https://www.python.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if MongoDB is accessible (non-blocking warning)
Write-Host ""
Write-Host "Checking MongoDB connection..." -ForegroundColor Gray
$mongoCheck = & {
    try {
        $timeout = New-TimeSpan -Seconds 2
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $tcpConnection = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
        if ($tcpConnection.TcpTestSucceeded) {
            Write-Host "✓ MongoDB is running" -ForegroundColor Green
        } else {
            Write-Host "⚠ WARNING: MongoDB might not be running at localhost:27017" -ForegroundColor Yellow
            Write-Host "  Make sure MongoDB is started before using the application" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠ Could not verify MongoDB connection (non-critical)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Function to start backend server
function Start-BackendServer {
    Write-Host "[1/2] Starting Backend Server (Python Flask)..." -ForegroundColor Cyan
    Push-Location "$projectRoot\backend"
    & python run_dev.py
    Pop-Location
}

# Function to start frontend server
function Start-FrontendServer {
    # Wait for backend to start
    Start-Sleep -Seconds 2
    
    Write-Host "[2/2] Starting Frontend Server (React Vite)..." -ForegroundColor Cyan
    Push-Location $projectRoot
    & npm run dev
    Pop-Location
}

# Start both servers in parallel
Write-Host "Starting servers..." -ForegroundColor Green
Write-Host ""

# Start backend in background job
$backendJob = Start-Job -ScriptBlock {
    param($root)
    Set-Location "$root\backend"
    Write-Host "[Backend] Starting Flask server with auto-reload..." -ForegroundColor Cyan
    & python run_dev.py
} -ArgumentList $projectRoot

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server (foreground so user can see it)
Write-Host "[Frontend] Starting Vite dev server..." -ForegroundColor Cyan
Push-Location $projectRoot
& npm run dev
Pop-Location

# Cleanup
Stop-Job $backendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "============================================================================" -ForegroundColor Cyan
Write-Host "  SERVERS STOPPED" -ForegroundColor Red
Write-Host "============================================================================" -ForegroundColor Cyan
