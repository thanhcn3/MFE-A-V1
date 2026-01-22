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

#!/bin/bash
