@echo off
echo ========================================
echo Building and Dockerizing Remote-Profile
echo ========================================

echo Building Remote-Profile...
call npm run build remote-profile
if %errorlevel% neq 0 (
    echo ERROR: Remote-Profile build failed!
    exit /b %errorlevel%
)

echo Creating Docker image for Remote-Profile...
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Remote-Profile Docker image created successfully!
echo Run: docker run -d -p 8083:80 --name remote-profile mfe-remote-profile:latest
echo ========================================
