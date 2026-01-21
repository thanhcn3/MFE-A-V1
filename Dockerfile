# =====================
# Stage 1: Build Angular
# =====================
FROM node:20-bullseye AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

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
