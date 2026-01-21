#!/bin/bash
# Build script for MFE Docker
# Author: Docker Build Helper

set -e  # Exit on error

echo "🚀 Starting MFE Docker Build..."

# Check if docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Choose Dockerfile
DOCKERFILE="${1:-Dockerfile}"
echo "📦 Using: $DOCKERFILE"

# Clean previous build
echo "🧹 Cleaning old images..."
docker compose down 2>/dev/null || true

# Build with options
echo "🔨 Building Docker image..."
DOCKER_BUILDKIT=1 docker compose build \
    --no-cache \
    --progress=plain \
    --build-arg BUILDKIT_INLINE_CACHE=1

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "To run the application:"
    echo "  docker compose up"
    echo ""
    echo "To run in background:"
    echo "  docker compose up -d"
else
    echo "❌ Build failed!"
    exit 1
fi
