@echo off
REM Build MFE locally then create Docker image
REM This is useful when Docker build has network issues

echo Building MFE applications locally...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm ci --legacy-peer-deps
    if errorlevel 1 (
        echo Failed to install dependencies
        exit /b 1
    )
)

REM Build all MFE projects
echo Building shell...
call npm run ng build shell -- --configuration=production
if errorlevel 1 (
    echo Failed to build shell
    exit /b 1
)

echo Building remote-home...
call npm run ng build remote-home -- --configuration=production
if errorlevel 1 (
    echo Failed to build remote-home
    exit /b 1
)

echo Building remote-about...
call npm run ng build remote-about -- --configuration=production
if errorlevel 1 (
    echo Failed to build remote-about
    exit /b 1
)

echo Building remote-profile...
call npm run ng build remote-profile -- --configuration=production
if errorlevel 1 (
    echo Failed to build remote-profile
    exit /b 1
)

echo Local build completed!
echo.
echo Creating Docker image...
docker build -f Dockerfile.local -t mfe-app:local .

if %errorlevel% equ 0 (
    echo Docker image created successfully!
    echo.
    echo To run the application:
    echo   docker run -p 8080:80 mfe-app:local
    echo.
    echo   Or with docker-compose ^(update docker-compose.yml first^):
    echo   docker compose up
) else (
    echo Docker build failed!
    exit /b 1
)
