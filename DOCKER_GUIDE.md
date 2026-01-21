# Hướng Dẫn Build và Chạy MFE Project với Docker

## 📋 Yêu Cầu
- Docker Desktop đã được cài đặt
- Docker Compose (thường đi kèm với Docker Desktop)

## 🚀 Cách Sử Dụng

### 1. Build Docker Image

```bash
# Build image
docker compose build
```

### 2. Chạy Container

```bash
# Chạy container
docker compose up -d

# Hoặc chạy và xem logs
docker compose up
```

### 3. Truy Cập Ứng Dụng

Sau khi container chạy thành công, mở trình duyệt và truy cập:

- **Shell (Main App)**: http://localhost:8080
- **Remote Home**: http://localhost:8080/remote-home
- **Remote About**: http://localhost:8080/remote-about
- **Remote Profile**: http://localhost:8080/remote-profile

### 4. Quản Lý Container

```bash
# Xem logs
docker compose logs -f

# Stop container
docker compose down

# Restart container
docker compose restart

# Xem status
docker compose ps
```

### 5. Rebuild Sau Khi Thay Đổi Code

```bash
# Stop container hiện tại
docker compose down

# Rebuild và start lại
docker compose up -d --build
```

## 🏗️ Cấu Trúc Docker

### Dockerfile
- **Stage 1 (Build)**: Build tất cả các MFE apps sử dụng Node.js
- **Stage 2 (Production)**: Serve các apps đã build bằng Nginx

### nginx.conf
- Cấu hình routing cho tất cả các MFE apps
- Gzip compression để tối ưu performance
- Cache control headers

### docker-compose.yml
- Định nghĩa service và port mapping
- Port 8080 trên host → Port 80 trong container

## 🛠️ Tùy Chỉnh

### Thay Đổi Port
Sửa trong `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"  # Thay YOUR_PORT bằng port bạn muốn
```

### Build Riêng Lẻ Từng App
Nếu cần build riêng lẻ, sửa trong `Dockerfile` phần build:
```dockerfile
# Ví dụ: chỉ build shell và remote-home
RUN npm run build shell && \
    npm run build remote-home
```

## 🐛 Troubleshooting

### Lỗi Port Already in Use
```bash
# Kiểm tra process đang dùng port 8080
# Windows:
netstat -ano | findstr :8080

# Stop Docker container
docker compose down
```

### Container Build Failed
```bash
# Xóa cache và rebuild
docker compose build --no-cache

# Xem logs chi tiết
docker compose logs
```

### Vấn Đề Memory
Nếu build bị lỗi do thiếu memory, tăng memory cho Docker Desktop:
- Docker Desktop → Settings → Resources → Memory

## 📝 Lưu Ý
- Đảm bảo file `package.json` có đầy đủ build scripts cho các apps
- Kiểm tra `angular.json` đã cấu hình đúng output paths
- Module Federation cần được cấu hình đúng trong `federation.config.js`
