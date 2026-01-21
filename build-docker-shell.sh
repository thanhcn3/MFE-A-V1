#!/bin/bash

echo "========================================"
echo "Building and Dockerizing Shell"
echo "========================================"

set -e

echo "Building Shell..."
npm run build shell

echo "Creating Docker image for Shell..."
docker build -f Dockerfile.shell -t mfe-shell:latest .

echo ""
echo "========================================"
echo "Shell Docker image created successfully!"
echo "Run: docker run -d -p 8080:80 --name shell mfe-shell:latest"
echo "========================================"
