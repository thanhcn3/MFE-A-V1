#!/bin/bash

echo "========================================"
echo "Clean, Build, Docker & Deploy Pipeline"
echo "========================================"

set -e

# ============================
# 0. Stop & remove old containers
# ============================
echo ""
echo "[0/5] Stopping & removing old containers..."

docker compose -f docker-compose.yml down --remove-orphans || true

# Nếu muốn chắc chắn xóa theo tên container
docker rm -f mfe-shell mfe-remote-home mfe-remote-about mfe-remote-profile mfe-nginx 2>/dev/null || true


# ============================
# 1. Remove old Docker images
# ============================
echo ""
echo "[1/5] Removing old Docker images..."

docker rmi -f \
  mfe-shell:latest \
  mfe-remote-home:latest \
  mfe-remote-about:latest \
  mfe-remote-profile:latest \
  mfe-nginx:latest \
  2>/dev/null || true


# ============================
# 2. Clean dist folder
# ============================
echo ""
echo "[2/5] Cleaning dist folder..."
rm -rf dist/


# ============================
# 3. Build all micro-frontends
# ============================
echo ""
echo "[3/5] Building Angular MFEs..."

npm run build shell
npm run build remote-home
npm run build remote-about
npm run build remote-profile


# ============================
# 4. Build Docker images
# ============================
echo ""
echo "[4/5] Building Docker images..."

docker build -f Dockerfile.shell -t mfe-shell:latest .
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .
docker build -f docker/nginx/Dockerfile -t mfe-nginx:latest docker/nginx


# ============================
# 5. Deploy containers
# ============================
echo ""
echo "[5/5] Deploying containers..."

docker compose -f docker-compose.yml up -d

echo "========================================"
echo "✅ Deployment completed successfully!"
echo "========================================"
