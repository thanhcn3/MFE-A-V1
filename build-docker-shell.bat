@echo off
echo ========================================
echo Building and Dockerizing Shell
echo ========================================

echo Building Shell...
call npm run build shell
if %errorlevel% neq 0 (
    echo ERROR: Shell build failed!
    exit /b %errorlevel%
)

echo Creating Docker image for Shell...
docker build -f Dockerfile.shell -t mfe-shell:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Shell Docker image created successfully!
echo Run: docker run -d -p 8080:80 --name shell mfe-shell:latest
echo ========================================
