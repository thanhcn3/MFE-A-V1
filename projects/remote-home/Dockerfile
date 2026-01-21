# =====================
# Remote-Home: Build + Nginx serve
# Build with context at repo root: docker build -f projects/remote-home/Dockerfile -t mfe-a-v1-remote-home .
# =====================
FROM node:20.19-bullseye AS build

WORKDIR /app

RUN npm i -g npm@10.5.0

ENV npm_config_optional=true
ENV npm_config_platform=linux
ENV npm_config_arch=x64
ENV npm_config_libc=glibc

COPY package.json package-lock.json ./

RUN npm cache clean --force \
 && npm ci --legacy-peer-deps --include=optional --platform=linux --arch=x64 --libc=glibc

COPY . .

RUN npm install --no-save --include=optional --platform=linux --arch=x64 --libc=glibc \
    @napi-rs/magic-string-linux-x64-gnu@0.3.4 \
    @oxc-parser/binding-linux-x64-gnu@0.8.0 || true

ENV NODE_OPTIONS="--max-old-space-size=8192"

# Even though SSR is enabled, we only serve the browser build here
RUN npx ng build remote-home --configuration production


# =====================
# Stage 2: Nginx
# =====================
FROM nginx:1.25-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY projects/remote-home/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/remote-home/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
