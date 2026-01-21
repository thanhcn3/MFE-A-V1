# ============================
# Stage 1: Build Angular MFE
# ============================
FROM node:20-bullseye AS build

WORKDIR /app

# Toolchain cho native + Rust (BẮT BUỘC)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# ---- CÀI RUST TOOLCHAIN ----
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Pin npm version ổn định
RUN npm install -g npm@10.5.0

# ÉP npm Linux
ENV npm_config_optional=true
ENV npm_config_platform=linux
ENV npm_config_arch=x64
ENV npm_config_libc=glibc

# Copy lockfile trước
COPY package.json package-lock.json ./

# Cài dependencies
RUN npm cache clean --force \
 && npm ci \
    --legacy-peer-deps \
    --include=optional

# 🔥 BẮT BUỘC rebuild native module từ source
RUN npm rebuild @napi-rs/magic-string --build-from-source

# Copy source code
COPY . .

# Build MFE
RUN npx --no-install ng build shell \
 && npx --no-install ng build remote-home \
 && npx --no-install ng build remote-about \
 && npx --no-install ng build remote-profile


# ============================
# Stage 2: Nginx Production
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
