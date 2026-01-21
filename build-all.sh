#!/bin/bash

echo "========================================"
echo "Building all Micro-Frontends"
echo "========================================"

# Exit on error
set -e

echo ""
echo "[1/4] Building Shell..."
npm run build shell

echo ""
echo "[2/4] Building Remote-Home..."
npm run build remote-home

echo ""
echo "[3/4] Building Remote-About..."
npm run build remote-about

echo ""
echo "[4/4] Building Remote-Profile..."
npm run build remote-profile

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "You can now build Docker image:"
echo "  docker build -t mfe-angular-app:latest ."
echo ""
