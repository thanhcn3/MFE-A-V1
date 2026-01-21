# =====================
# Stage 1: Build Angular (Debian, NOT Alpine)
# =====================
FROM node:20-bullseye AS build

WORKDIR /app

# 1️⃣ Toolchain native (BẮT BUỘC cho magic-string / esbuild)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2️⃣ Copy dependency files
COPY package.json package-lock.json ./

# 3️⃣ Clean + install deps (lock mới sẽ kéo đúng native binary)
RUN npm cache clean --force \
 && npm ci --legacy-peer-deps

# 4️⃣ Copy source code
COPY . .

# 5️⃣ Tăng heap cho Angular build
ENV NODE_OPTIONS="--max-old-space-size=8192"

# 6️⃣ Build đúng project MFE
ARG PROJECT_NAME
RUN npx ng build ${PROJECT_NAME} --configuration production

# =====================
# Stage 2: Runtime (Nginx)
# =====================
FROM nginx:1.25-alpine

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
ARG PROJECT_NAME
COPY --from=build /app/dist/${PROJECT_NAME}/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
