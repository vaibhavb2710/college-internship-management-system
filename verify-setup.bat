@echo off
REM ============================================================================
REM Verification Script - Check Development Environment Setup
REM ============================================================================

setlocal enabledelayedexpansion
color 0A
cls

echo.
echo ============================================================================
echo  DEVELOPMENT ENVIRONMENT VERIFICATION
echo ============================================================================
echo.

set "passed=0"
set "failed=0"

REM Helper functions
set "checkmark=[OK]"
set "cross=[FAIL]"

echo Checking prerequisites...
echo.

REM 1. Check Node.js
echo [1] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo    %cross% Node.js is not installed
    set /a failed+=1
) else (
    for /f "tokens=*" %%A in ('node --version') do (
        echo    %checkmark% Node.js found: %%A
        set /a passed+=1
    )
)

REM 2. Check NPM
echo [2] Checking NPM...
npm --version >nul 2>&1
if errorlevel 1 (
    echo    %cross% NPM is not installed
    set /a failed+=1
) else (
    for /f "tokens=*" %%A in ('npm --version') do (
        echo    %checkmark% NPM found: %%A
        set /a passed+=1
    )
)

REM 3. Check Python
echo [3] Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo    %cross% Python is not installed
    set /a failed+=1
) else (
    for /f "tokens=*" %%A in ('python --version') do (
        echo    %checkmark% Python found: %%A
        set /a passed+=1
    )
)

REM 4. Check Git
echo [4] Checking Git...
git --version >nul 2>&1
if errorlevel 1 (
    echo    [SKIP] Git is not installed ^(optional^)
) else (
    for /f "tokens=*" %%A in ('git --version') do (
        echo    %checkmark% Git found: %%A
        set /a passed+=1
    )
)

REM 5. Check MongoDB
echo [5] Checking MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo    [SKIP] MongoDB is not installed as command-line tool ^(may be service^)
) else (
    for /f "tokens=*" %%A in ('mongod --version') do (
        echo    %checkmark% MongoDB found
        set /a passed+=1
    )
)

echo.
echo ============================================================================
echo Checking project files...
echo.

REM Check project files
if exist "package.json" (
    echo    %checkmark% package.json found
    set /a passed+=1
) else (
    echo    %cross% package.json not found
    set /a failed+=1
)

if exist "vite.config.ts" (
    echo    %checkmark% vite.config.ts found ^(with HMR configured^)
    set /a passed+=1
) else (
    echo    %cross% vite.config.ts not found
    set /a failed+=1
)

if exist "backend\app.py" (
    echo    %checkmark% backend/app.py found
    set /a passed+=1
) else (
    echo    %cross% backend/app.py not found
    set /a failed+=1
)

if exist "backend\run_dev.py" (
    echo    %checkmark% backend/run_dev.py found ^(development server^)
    set /a passed+=1
) else (
    echo    %cross% backend/run_dev.py not found
    set /a failed+=1
)

if exist "backend\requirements.txt" (
    echo    %checkmark% backend/requirements.txt found
    set /a passed+=1
) else (
    echo    %cross% backend/requirements.txt not found
    set /a failed+=1
)

echo.
echo ============================================================================
echo Checking symbolic files for development setup...
echo.

if exist "dev-start.bat" (
    echo    %checkmark% dev-start.bat found ^(main startup script^)
    set /a passed+=1
) else (
    echo    %cross% dev-start.bat not found
    set /a failed+=1
)

if exist "dev-frontend-only.bat" (
    echo    %checkmark% dev-frontend-only.bat found
    set /a passed+=1
) else (
    echo    %cross% dev-frontend-only.bat not found
    set /a failed+=1
)

if exist "dev-backend-only.bat" (
    echo    %checkmark% dev-backend-only.bat found
    set /a passed+=1
) else (
    echo    %cross% dev-backend-only.bat not found
    set /a failed+=1
)

if exist "QUICK_START.md" (
    echo    %checkmark% QUICK_START.md found ^(quick reference^)
    set /a passed+=1
) else (
    echo    %cross% QUICK_START.md not found
    set /a failed+=1
)

if exist "DEV_SERVER_GUIDE.md" (
    echo    %checkmark% DEV_SERVER_GUIDE.md found ^(full documentation^)
    set /a passed+=1
) else (
    echo    %cross% DEV_SERVER_GUIDE.md not found
    set /a failed+=1
)

if exist "ARCHITECTURE_DEV_FLOW.md" (
    echo    %checkmark% ARCHITECTURE_DEV_FLOW.md found ^(architecture reference^)
    set /a passed+=1
) else (
    echo    %cross% ARCHITECTURE_DEV_FLOW.md not found
    set /a failed+=1
)

echo.
echo ============================================================================
echo RESULTS
echo ============================================================================
echo.
echo Passed checks: %passed%
echo Failed checks: %failed%
echo.

if %failed% equ 0 (
    color 0A
    echo ✓ ALL CHECKS PASSED! Your development environment is ready!
    echo.
    echo Next step: Double-click dev-start.bat to start coding!
    echo.
) else (
    color 0C
    echo ✗ Some checks failed. See above for details.
    echo.
    echo Please install missing components and try again.
    echo.
)

echo ============================================================================
echo.

pause
