# 🚀 Quick Start - Docker Build & Deploy Guide

## TL;DR

```bash
# Build tất cả projects trước
build-all.bat         # Windows
./build-all.sh        # Linux/Mac

# Tạo và chạy Docker containers
docker-compose -f docker-compose.separate.yml up -d

# Truy cập ứng dụng
http://localhost:8080  # Shell
http://localhost:8081  # Remote-Home
http://localhost:8082  # Remote-About
http://localhost:8083  # Remote-Profile
```

## 🎯 Kiến Trúc Deployment

Project sử dụng **Module Federation** với 4 micro-frontends độc lập:
- **Shell** (Host App) - Port 8080
- **Remote-Home** - Port 8081
- **Remote-About** - Port 8082
- **Remote-Profile** - Port 8083

Mỗi app có Docker image riêng, deploy độc lập.

## 🚀 Deployment Options

### Option 1: Deploy TẤT CẢ (Khuyến nghị)

```bash
# 1. Build tất cả projects
build-all.bat                    # Windows
./build-all.sh                   # Linux/Mac

# 2. Tạo tất cả Docker images
build-docker-all.bat             # Windows
./build-docker-all.sh            # Linux/Mac

# 3. Chạy containers
docker-compose -f docker-compose.separate.yml up -d
```

### Option 2: Deploy TỪNG APP RIÊNG

#### Shell Application
```bash
npm run build shell
docker build -f Dockerfile.shell -t mfe-shell:latest .
docker run -d -p 8080:80 --name shell mfe-shell:latest
```

#### Remote-Home Application
```bash
npm run build remote-home
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .
docker run -d -p 8081:80 --name remote-home mfe-remote-home:latest
```

#### Remote-About Application
```bash
npm run build remote-about
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .
docker run -d -p 8082:80 --name remote-about mfe-remote-about:latest
```

#### Remote-Profile Application
```bash
npm run build remote-profile
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .
docker run -d -p 8083:80 --name remote-profile mfe-remote-profile:latest
```

### Option 3: Deploy ALL-IN-ONE (Legacy)

```bash
# Build tất cả
build-all.bat

# Tạo image tổng hợp
docker build -t mfe-angular-app:latest .

# Chạy container
docker run -d -p 8080:80 --name mfe-app mfe-angular-app:latest
```

## 📊 Quản Lý Containers

### Xem trạng thái
```bash
docker ps
docker-compose -f docker-compose.separate.yml ps
```

### Xem logs
```bash
# Logs từng container
docker logs shell
docker logs remote-home

# Logs tất cả
docker-compose -f docker-compose.separate.yml logs -f
```

### Dừng/Khởi động lại
```bash
# Dừng
docker-compose -f docker-compose.separate.yml down

# Khởi động lại
docker-compose -f docker-compose.separate.yml restart

# Update và restart
docker-compose -f docker-compose.separate.yml up -d --build
```

## ❌ Lỗi Thường Gặp

### "dist folder not found"
```bash
# Build project trước!
build-all.bat         # Windows
./build-all.sh        # Linux/Mac
```

### Port bị chiếm
```bash
# Kiểm tra port
netstat -ano | findstr :8080    # Windows
lsof -i :8080                   # Linux/Mac

# Đổi port trong docker-compose.separate.yml
```

### Container không start
```bash
# Xem logs để biết lý do
docker logs <container-name>

# Rebuild image
docker build -f Dockerfile.<app> --no-cache -t mfe-<app>:latest .
```

### Remote app không load được từ Shell
- Kiểm tra CORS headers trong nginx-remote.conf
- Kiểm tra network giữa containers
- Kiểm tra federation.config.js

## 📁 Files Quan Trọng

### Build Scripts
- `build-all.bat / .sh` → Build tất cả projects
- `build-docker-all.bat / .sh` → Build + Docker tất cả apps
- `build-docker-shell.bat / .sh` → Build + Docker Shell
- `build-docker-remote-*.bat / .sh` → Build + Docker từng remote app

### Dockerfiles
- `DoFeatures

- [x] 4 Micro-frontends độc lập
- [x] Module Federation
- [x] Separate Docker images per app
- [x] Nginx với CORS support
- [x] Health check endpoints
- [x] Build scripts cho Windows & Linux
- [x] Docker Compose support
- [x] Production-ready
- [x] Lightweight (~50-80MB per image)

## 🎯 Ưu Điểm Deploy Separate

1. **Độc lập**: Deploy/update từng app riêng
2. **Scale linh hoạt**: Scale theo nhu cầu từng service
3. **Isolation**: Lỗi ở một app không ảnh hưởng app khác
4. **CI/CD**: Pipeline riêng cho từng app
5. **Versioning**: Quản lý version độc lập

## 🚀 Bắt Đầu Ngay

```bash
# Step 1: Clone/Open project
cd MFE-A-V1

# Step 2: Build projects
build-all.bat              # Windows
./build-all.sh             # Linux/Mac

# Step 3: Tạo Docker images
build-docker-all.bat       # Windows  
./build-docker-all.sh      # Linux/Mac

# Step 4: Chạy containers
docker-compose -f docker-compose.separate.yml up -d

# Step 5: Truy cập
# Shell:         http://localhost:8080
# Remote-Home:   http://localhost:8081
# Remote-About:  http://localhost:8082
# Remote-Profile: http://localhost:8083

- [x] Dockerfile tối ưu với Alpine
- [x] Dockerfile.ubuntu backup
- [x] DNS configuration
- [x] Memory optimization
- [x] Multi-stage build
- [x] Health check
- [x] Build scripts
- [x] .dockerignore

## 🎯 Bắt Đầu Ngay

```bash
# Step 1: Clone/Open project
cd MFE-A-V1

# Step 2: Build (chọn 1 trong 3)

## Option A: Auto script (khuyến nghị)
.\build-docker.bat

## Option B: Manual với Alpine
docker compose build --no-cache
docker compose up

## Option C: Ubuntu nếu Alpine lỗi
# Sửa docker-compose.yml: dockerfile: Dockerfile.ubuntu
docker compose build --no-cache
docker compose up

# Step 3: Access
# http://localhost:8080/shell
# http://localhost:8080/remote-home
# http://localhost:8080/remote-about
# http://localhost:8080/remote-profile
```

## 🔍 Debug

```bash
# Xem logs
docker compose logs -f

# Check container
docker compose ps

# Vào container
docker compose exec mfe-app sh

# Clean và rebuild
docker compose down -v
docker system prune -af
docker compose build --no-cache
```

## 📚 Tài Liệu Đầy Đủ

Xem file [DOCKER_BUILD_GUIDE.md](DOCKER_BUILD_GUIDE.md) để biết chi tiết hơn.

---

**Ready? Let's build! 🚀**

```bash
.\build-docker.bat
```
