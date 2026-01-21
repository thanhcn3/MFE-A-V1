#!/bin/bash

echo "========================================"
echo "Building and Dockerizing Remote-About"
echo "========================================"

set -e

echo "Building Remote-About..."
npm run build remote-about

echo "Creating Docker image for Remote-About..."
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .

echo ""
echo "========================================"
echo "Remote-About Docker image created successfully!"
echo "Run: docker run -d -p 8082:80 --name remote-about mfe-remote-about:latest"
echo "========================================"
