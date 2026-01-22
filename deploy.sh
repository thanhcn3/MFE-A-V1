#!/bin/bash

echo "========================================"
echo "Clean, Build, Docker & Deploy Pipeline"
echo "========================================"

set -e

# 1. Clean dist folder
rm -rf dist/

# 2. Build all micro-frontends
npm run build shell
npm run build remote-home
npm run build remote-about
npm run build remote-profile

# 3. Build Docker images
docker build -f Dockerfile.shell -t mfe-shell:latest .
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .
docker build -f docker/nginx/Dockerfile -t mfe-nginx:latest docker/nginx

# 4. Deploy containers
docker compose -f docker-compose.yml down || true
docker compose -f docker-compose.yml up -d

echo "========================================"
echo "✅ Deployment completed successfully!"
echo "========================================"
