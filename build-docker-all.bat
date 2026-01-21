@echo off
echo ========================================
echo Building and Dockerizing All Apps
echo ========================================

call build-docker-shell.bat
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
call build-docker-remote-home.bat
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
call build-docker-remote-about.bat
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
call build-docker-remote-profile.bat
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ========================================
echo All Docker images created successfully!
echo ========================================
echo.
echo Available images:
docker images | findstr mfe-
echo.
echo Run all containers:
echo   docker-compose -f docker-compose.separate.yml up -d
echo.
