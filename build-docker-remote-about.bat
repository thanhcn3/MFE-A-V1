@echo off
echo ========================================
echo Building and Dockerizing Remote-About
echo ========================================

echo Building Remote-About...
call npm run build remote-about
if %errorlevel% neq 0 (
    echo ERROR: Remote-About build failed!
    exit /b %errorlevel%
)

echo Creating Docker image for Remote-About...
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Remote-About Docker image created successfully!
echo Run: docker run -d -p 8082:80 --name remote-about mfe-remote-about:latest
echo ========================================
