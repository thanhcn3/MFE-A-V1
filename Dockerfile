## Simple, generic Angular build + Nginx serve
## Works for any project via ARG PROJECT_NAME

# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies using lockfiles for reproducible builds
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
ARG PROJECT_NAME
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npx ng build ${PROJECT_NAME} --configuration production --ssr=false

# Runtime stage
FROM nginx:1.25-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
ARG PROJECT_NAME
COPY --from=build /app/dist/${PROJECT_NAME}/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
