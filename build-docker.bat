@echo off
REM Build script for MFE Docker on Windows

echo Starting MFE Docker Build...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker first.
    exit /b 1
)

REM Clean previous build
echo Cleaning old images...
docker compose down >nul 2>&1

REM Build with BuildKit
echo Building Docker image...
set DOCKER_BUILDKIT=1
docker compose build --no-cache --progress=plain

if %errorlevel% equ 0 (
    echo Build successful!
    echo.
    echo To run the application:
    echo   docker compose up
    echo.
    echo To run in background:
    echo   docker compose up -d
) else (
    echo Build failed!
    exit /b 1
)
