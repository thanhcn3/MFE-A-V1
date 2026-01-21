# =====================
# Shell: Build + Nginx serve
# Build with context at repo root: docker build -f projects/shell/Dockerfile -t mfe-a-v1-shell .
# =====================
FROM node:20.19-bullseye AS build

WORKDIR /app

# Toolchain for optional/native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Pin npm for stability
RUN npm i -g npm@10.5.0

# Make installs platform-aware inside container
ENV npm_config_optional=true
ENV npm_config_platform=linux
ENV npm_config_arch=x64
ENV npm_config_libc=glibc

# Copy lockfiles early for caching
COPY package.json package-lock.json ./

# Install deps
RUN npm cache clean --force \
 && npm ci --legacy-peer-deps --include=optional --platform=linux --arch=x64 --libc=glibc

# Copy source
COPY . .

# Ensure native bindings are present when needed
RUN npm install --no-save --include=optional --platform=linux --arch=x64 --libc=glibc \
    @napi-rs/magic-string-linux-x64-gnu@0.3.4 \
    @oxc-parser/binding-linux-x64-gnu@0.8.0 || true

# Increase node heap for build
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Build project
RUN npx ng build shell --configuration production


# =====================
# Stage 2: Nginx
# =====================
FROM nginx:1.25-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/shell/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
