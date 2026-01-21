#!/bin/bash

echo "========================================"
echo "Building and Dockerizing Remote-Home"
echo "========================================"

set -e

echo "Building Remote-Home..."
npm run build remote-home

echo "Creating Docker image for Remote-Home..."
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .

echo ""
echo "========================================"
echo "Remote-Home Docker image created successfully!"
echo "Run: docker run -d -p 8081:80 --name remote-home mfe-remote-home:latest"
echo "========================================"
