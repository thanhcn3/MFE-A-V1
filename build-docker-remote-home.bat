@echo off
echo ========================================
echo Building and Dockerizing Remote-Home
echo ========================================

echo Building Remote-Home...
call npm run build remote-home
if %errorlevel% neq 0 (
    echo ERROR: Remote-Home build failed!
    exit /b %errorlevel%
)

echo Creating Docker image for Remote-Home...
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Remote-Home Docker image created successfully!
echo Run: docker run -d -p 8081:80 --name remote-home mfe-remote-home:latest
echo ========================================
