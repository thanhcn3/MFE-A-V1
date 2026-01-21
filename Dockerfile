# ============================
# Stage 1: Build Angular MFE
# ============================
FROM node:22-bullseye AS build

WORKDIR /app

# Toolchain
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    && rm -rf /var/lib/apt/lists/*

# Pin npm
RUN npm install -g npm@10.5.0

# 🔥🔥🔥 CẤM native binding (CỰC KỲ QUAN TRỌNG)
ENV MAGIC_STRING_FORCE_WASM=1
ENV NAPI_RS_FORCE_WASM=1
ENV npm_config_optional=false
ENV npm_config_platform=linux
ENV npm_config_arch=x64
ENV npm_config_libc=glibc

# Copy lockfile
COPY package.json package-lock.json ./

# Install deps (KHÔNG optional native)
RUN npm cache clean --force \
 && npm ci --legacy-peer-deps --omit=optional

# 🔥 ĐẢM BẢO không còn native magic-string
RUN rm -rf node_modules/@napi-rs/magic-string-* \
 && rm -rf node_modules/@napi-rs/magic-string/binding.js || true

# Copy source
COPY . .

# Build MFE
RUN npx --no-install ng build shell \
 && npx --no-install ng build remote-home \
 && npx --no-install ng build remote-about \
 && npx --no-install ng build remote-profile


# ============================
# Stage 2: Nginx
# ============================
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/shell/browser /usr/share/nginx/html/shell
COPY --from=build /app/dist/remote-home/browser /usr/share/nginx/html/remote-home
COPY --from=build /app/dist/remote-about/browser /usr/share/nginx/html/remote-about
COPY --from=build /app/dist/remote-profile/browser /usr/share/nginx/html/remote-profile

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
