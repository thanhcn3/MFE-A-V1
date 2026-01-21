#!/bin/bash

echo "========================================"
echo "Building and Dockerizing Remote-Profile"
echo "========================================"

set -e

echo "Building Remote-Profile..."
npm run build remote-profile

echo "Creating Docker image for Remote-Profile..."
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .

echo ""
echo "========================================"
echo "Remote-Profile Docker image created successfully!"
echo "Run: docker run -d -p 8083:80 --name remote-profile mfe-remote-profile:latest"
echo "========================================"
