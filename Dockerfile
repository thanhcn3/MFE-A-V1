# =====================
# Stage 1: Build Angular
# =====================
FROM node:20-bullseye AS build

WORKDIR /app

# Cài toolchain native (BẮT BUỘC cho magic-string / esbuild)
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json package-lock.json ./

# Clean cache + install + rebuild native
RUN npm cache clean --force \
 && npm ci --legacy-peer-deps \
 && npm rebuild

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

ARG PROJECT_NAME
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/${PROJECT_NAME}/browser /usr/share/nginx/html

EXPOSE 80
CMD ["ng]()
