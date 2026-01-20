# Stage 1: Build the Angular application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Biến nhận tên dự án cần build (vd: shell, remote-home,...)
ARG PROJECT_NAME

# Build dự án cụ thể ở chế độ production
RUN npm run ng -- build ${PROJECT_NAME} --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy cấu hình Nginx đã tạo
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Tham số tên dự án để copy đúng thư mục dist
ARG PROJECT_NAME

# Copy kết quả build từ Stage 1 sang thư mục html của Nginx
COPY --from=build /app/dist/${PROJECT_NAME}/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]