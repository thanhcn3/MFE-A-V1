# =====================
# Stage 1: Build Angular
# =====================
FROM node:20-alpine
# ⬆️ node 18 ổn định hơn node 20 với npm trong Docker

WORKDIR /app

# Fix npm network + cache
RUN npm config set registry https://registry.npmjs.org \
 && npm config set fetch-retries 2 \
 && npm config set fetch-retry-mintimeout 10000 \
 && npm config set fetch-retry-maxtimeout 60000

# Cài Angular CLI global (QUAN TRỌNG)
RUN npm install -g @angular/cli@latest

# Copy dependency files
COPY package.json package-lock.json ./

# Install deps (KHÔNG song song)
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy source
COPY . .

# Tăng heap cho Angular build
ENV NODE_OPTIONS="--max-old-space-size=8096"

ARG PROJECT_NAME
RUN ng build ${PROJECT_NAME} --configuration production

# =====================
# Stage 2: Nginx
# =====================
FROM nginx:1.25-alpine

ARG PROJECT_NAME
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/${PROJECT_NAME}/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
