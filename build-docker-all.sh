#!/bin/bash

echo "========================================"
echo "Building and Dockerizing All Apps"
echo "========================================"

set -e

./build-docker-shell.sh
echo ""

./build-docker-remote-home.sh
echo ""

./build-docker-remote-about.sh
echo ""

./build-docker-remote-profile.sh

echo ""
echo "========================================"
echo "All Docker images created successfully!"
echo "========================================"
echo ""
echo "Available images:"
docker images | grep mfe-
echo ""
echo "Run all containers:"
echo "  docker-compose -f docker-compose.separate.yml up -d"
echo ""
