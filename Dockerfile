# =====================
# Stage 1: Build Angular
# =====================
FROM node:20-bullseye AS build

WORKDIR /app

# Toolchain cho native module (RUST/NAPI)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy lock trước để cache
COPY package.json package-lock.json ./

# Install deps + rebuild native binary (CỰC KỲ QUAN TRỌNG)
RUN npm cache clean --force \
 && npm ci --legacy-peer-deps \
 && npm rebuild @napi-rs/magic-string --force

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
