# ============================
# Stage 1: Build Angular MFE
# ============================
FROM node:20-bullseye AS build

WORKDIR /app

# Cài toolchain cho native modules (@napi-rs/*)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Pin npm version ổn định (tránh lỗi native loader)
RUN npm install -g npm@10.5.0

# ÉP npm hiểu đúng môi trường Linux (glibc)
ENV npm_config_optional=true
ENV npm_config_platform=linux
ENV npm_config_arch=x64
ENV npm_config_libc=glibc

# Copy lockfile trước để tận dụng cache Docker
COPY package.json package-lock.json ./

# Clean cache + cài deps đúng platform Linux
RUN npm cache clean --force \
 && npm ci \
    --legacy-peer-deps \
    --include=optional \
    --platform=linux \
    --arch=x64 \
    --libc=glibc

# Copy toàn bộ source code
COPY . .

# Build tất cả các MFE (dùng Angular CLI local)
RUN npx --no-install ng build shell \
 && npx --no-install ng build remote-home \
 && npx --no-install ng build remote-about \
 && npx --no-install ng build remote-profile


# ============================
# Stage 2: Nginx Production
# ============================
FROM nginx:alpine

# Xoá config mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy kết quả build từ stage build
COPY --from=build /app/dist/shell/browser /usr/share/nginx/html/shell
COPY --from=build /app/dist/remote-home/browser /usr/share/nginx/html/remote-home
COPY --from=build /app/dist/remote-about/browser /usr/share/nginx/html/remote-about
COPY --from=build /app/dist/remote-profile/browser /usr/share/nginx/html/remote-profile

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
