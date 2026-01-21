# =====================
# Stage 1: Build Angular
# =====================
FROM node:20.19-bullseye AS build

WORKDIR /app

RUN apt-get update && apt-get install -y \
  build-essential \
  python3 \
  git \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm cache clean --force && npm ci --legacy-peer-deps

COPY . .

ENV NODE_OPTIONS="--max-old-space-size=4096"

# ⚠️ CHỈ BUILD PROJECT DUY NHẤT
RUN npx ng build mfe-demo --configuration production

# =====================
# Stage 2: Nginx
# =====================
FROM nginx:1.25-alpine

RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Native federation output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
