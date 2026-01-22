@echo off
echo ========================================
echo Clean, Build, Docker & Deploy Pipeline
echo ========================================

REM 1. Clean dist folder
if exist dist rmdir /s /q dist

REM 2. Build all micro-frontends
call npm run build shell
call npm run build remote-home
call npm run build remote-about
call npm run build remote-profile

REM 3. Build Docker images
docker build -f Dockerfile.shell -t mfe-shell:latest .
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .
docker build -f docker/nginx/Dockerfile -t mfe-nginx:latest docker/nginx

REM 4. Deploy containers
docker compose -f docker-compose.yml down
docker compose -f docker-compose.yml up -d

echo ========================================
echo  Deployment completed successfully!
echo ========================================

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
