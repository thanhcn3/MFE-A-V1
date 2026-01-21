#!/bin/bash

echo "========================================"
echo "Clean, Build, Docker & Deploy Pipeline"
echo "========================================"

set -e

# Step 1: Stop and remove existing containers
echo ""
echo "[1/6] Stopping and removing existing containers..."
docker compose -f docker-compose.separate.yml down 2>/dev/null || true
docker stop shell remote-home remote-about remote-profile 2>/dev/null || true
docker rm shell remote-home remote-about remote-profile 2>/dev/null || true

# Step 2: Remove old images
echo ""
echo "[2/6] Removing old Docker images..."
docker rmi mfe-shell:latest 2>/dev/null || true
docker rmi mfe-remote-home:latest 2>/dev/null || true
docker rmi mfe-remote-about:latest 2>/dev/null || true
docker rmi mfe-remote-profile:latest 2>/dev/null || true

# Step 3: Clean dist folder
echo ""
echo "[3/6] Cleaning dist folder..."
rm -rf dist/

# Step 4: Build all projects
echo ""
echo "[4/6] Building all micro-frontends..."
npm run build shell
npm run build remote-home
npm run build remote-about
npm run build remote-profile

# Step 5: Create Docker images
echo ""
echo "[5/6] Creating Docker images..."
docker build -f Dockerfile.shell -t mfe-shell:latest .
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .

# Step 6: Start containers
echo ""
echo "[6/6] Starting containers..."
docker compose -f docker-compose.separate.yml up -d

echo ""
echo "========================================"
echo "✅ Deployment completed successfully!"
echo "========================================"
echo ""
echo "Access your applications:"
echo "  Shell:         http://localhost:8080"
echo "  Remote-Home:   http://localhost:8081"
echo "  Remote-About:  http://localhost:8082"
echo "  Remote-Profile: http://localhost:8083"
echo ""
echo "View logs:"
echo "  docker compose -f docker-compose.separate.yml logs -f"
echo ""
echo "Check status:"
echo "  docker ps"
echo ""
