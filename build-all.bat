@echo off
echo ========================================
echo Building all Micro-Frontends
echo ========================================

echo.
echo [1/4] Building Shell...
call npm run build shell
if %errorlevel% neq 0 (
    echo ERROR: Shell build failed!
    exit /b %errorlevel%
)

echo.
echo [2/4] Building Remote-Home...
call npm run build remote-home
if %errorlevel% neq 0 (
    echo ERROR: Remote-Home build failed!
    exit /b %errorlevel%
)

echo.
echo [3/4] Building Remote-About...
call npm run build remote-about
if %errorlevel% neq 0 (
    echo ERROR: Remote-About build failed!
    exit /b %errorlevel%
)

echo.
echo [4/4] Building Remote-Profile...
call npm run build remote-profile
if %errorlevel% neq 0 (
    echo ERROR: Remote-Profile build failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo You can now build Docker image:
echo   docker build -t mfe-angular-app:latest .
echo.
