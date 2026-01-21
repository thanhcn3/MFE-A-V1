@echo off
echo ========================================
echo Clean, Build, Docker ^& Deploy Pipeline
echo ========================================
echo.

REM Step 1: Stop and remove existing containers
echo [1/6] Stopping and removing existing containers...
docker-compose -f docker-compose.separate.yml down 2>nul
docker stop shell remote-home remote-about remote-profile 2>nul
docker rm shell remote-home remote-about remote-profile 2>nul

REM Step 2: Remove old images
echo.
echo [2/6] Removing old Docker images...
docker rmi mfe-shell:latest 2>nul
docker rmi mfe-remote-home:latest 2>nul
docker rmi mfe-remote-about:latest 2>nul
docker rmi mfe-remote-profile:latest 2>nul

REM Step 3: Clean dist folder
echo.
echo [3/6] Cleaning dist folder...
if exist dist rmdir /s /q dist

REM Step 4: Build all projects
echo.
echo [4/6] Building all micro-frontends...
call npm run build shell
if %errorlevel% neq 0 (
    echo ERROR: Shell build failed!
    exit /b %errorlevel%
)

call npm run build remote-home
if %errorlevel% neq 0 (
    echo ERROR: Remote-Home build failed!
    exit /b %errorlevel%
)

call npm run build remote-about
if %errorlevel% neq 0 (
    echo ERROR: Remote-About build failed!
    exit /b %errorlevel%
)

call npm run build remote-profile
if %errorlevel% neq 0 (
    echo ERROR: Remote-Profile build failed!
    exit /b %errorlevel%
)

REM Step 5: Create Docker images
echo.
echo [5/6] Creating Docker images...
docker build -f Dockerfile.shell -t mfe-shell:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build for Shell failed!
    exit /b %errorlevel%
)

docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build for Remote-Home failed!
    exit /b %errorlevel%
)

docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build for Remote-About failed!
    exit /b %errorlevel%
)

docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .
if %errorlevel% neq 0 (
    echo ERROR: Docker build for Remote-Profile failed!
    exit /b %errorlevel%
)

REM Step 6: Start containers
echo.
echo [6/6] Starting containers...
docker-compose -f docker-compose.separate.yml up -d

echo.
echo ========================================
echo [32m✓[0m Deployment completed successfully!
echo ========================================
echo.
echo Access your applications:
echo   Shell:         http://localhost:8080
echo   Remote-Home:   http://localhost:8081
echo   Remote-About:  http://localhost:8082
echo   Remote-Profile: http://localhost:8083
echo.
echo View logs:
echo   docker-compose -f docker-compose.separate.yml logs -f
echo.
echo Check status:
echo   docker ps
echo.
