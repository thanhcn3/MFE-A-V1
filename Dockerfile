# =====================
# Stage 1: Build Angular
# =====================
FROM node:20-alpine AS build
# Node 20 aligns with @types/node 20 and Angular 21

WORKDIR /app

# Fix npm network + cache
RUN npm config set registry https://registry.npmjs.org \
 && npm config set fetch-retries 2 \
 && npm config set fetch-retry-mintimeout 10000 \
 && npm config set fetch-retry-maxtimeout 60000

# Use project-local Angular CLI via npx to ensure version match

# Copy dependency files
COPY package.json package-lock.json ./

# Install deps (KHÔNG song song)
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy source
COPY . .

# Tăng heap cho Angular build
ENV NODE_OPTIONS="--max-old-space-size=8096"

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
CMD ["nginx", "-g", "daemon off;"]
