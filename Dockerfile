# =====================
# Stage 1: Build Angular
# =====================
FROM node:20-bullseye AS build

WORKDIR /app

# Toolchain cho native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# ÉP npm hiểu đúng môi trường Linux
ENV npm_config_optional=true
ENV npm_config_platform=linux
ENV npm_config_arch=x64

# Copy lock trước để cache
COPY package.json package-lock.json ./

# Install deps + ép cài native binary
RUN npm cache clean --force \
 && npm ci --legacy-peer-deps \
 && npm install @napi-rs/magic-string-linux-x64-gnu --no-save

# Copy source
COPY . .

# Tăng heap cho Angular
ENV NODE_OPTIONS="--max-old-space-size=8192"

ARG PROJECT_NAME
RUN npx ng build ${PROJECT_NAME} --configuration production


# =====================
# Stage 2: Nginx
# =====================
FROM nginx:1.25-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

ARG PROJECT_NAME
COPY --from=build /app/dist/${PROJECT_NAME}/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
