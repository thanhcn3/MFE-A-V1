#!/bin/bash
# Build MFE locally then create Docker image
# This is useful when Docker build has network issues

set -e

echo "🔨 Building MFE applications locally..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --legacy-peer-deps
fi

# Build all MFE projects
echo "🏗️  Building shell..."
npm run ng build shell -- --configuration=production

echo "🏗️  Building remote-home..."
npm run ng build remote-home -- --configuration=production

echo "🏗️  Building remote-about..."
npm run ng build remote-about -- --configuration=production

echo "🏗️  Building remote-profile..."
npm run ng build remote-profile -- --configuration=production

echo "✅ Local build completed!"
echo ""
echo "📦 Creating Docker image..."
docker build -f Dockerfile.local -t mfe-app:local .

if [ $? -eq 0 ]; then
    echo "✅ Docker image created successfully!"
    echo ""
    echo "🚀 To run the application:"
    echo "   docker run -p 8080:80 mfe-app:local"
    echo ""
    echo "   Or with docker-compose (update docker-compose.yml first):"
    echo "   docker compose up"
else
    echo "❌ Docker build failed!"
    exit 1
fi
