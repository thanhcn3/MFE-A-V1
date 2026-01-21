# 🚀 Quick Start - Docker Build Guide

## TL;DR

```bash
# Windows (Khuyến nghị)
.\build-docker.bat

# Hoặc manual
docker compose build --no-cache
docker compose up

# Truy cập
http://localhost:8080/shell
```

## 3 Giải Pháp Có Sẵn

### 1. ⚡ Alpine (MẶC ĐỊNH - Khuyến nghị)
```bash
# File: Dockerfile
# Kích thước: ~150MB
# Tốc độ: Rất nhanh
docker compose build
```

### 2. 🐧 Ubuntu (Phương án 2)
```bash
# File: Dockerfile.ubuntu  
# Kích thước: ~300MB
# Fix DNS issues tự động

# Sửa docker-compose.yml:
dockerfile: Dockerfile.ubuntu

docker compose build
```

### 3. 💻 Local Build (Phương án 3)
```bash
# Build trên máy host
npm ci --legacy-peer-deps
npm run ng build shell -- --configuration=production
npm run ng build remote-home -- --configuration=production
npm run ng build remote-about -- --configuration=production
npm run ng build remote-profile -- --configuration=production

# Tạo Dockerfile.local chỉ copy dist/
docker build -f Dockerfile.local -t mfe-app .
```

## ❌ Lỗi Thường Gặp

### DNS Error
```
Temporary failure resolving 'deb.debian.org'
```
👉 **Giải pháp**: Dùng Dockerfile.ubuntu hoặc Alpine (mặc định)

### Memory Error
```
JavaScript heap out of memory
```
👉 **Giải pháp**: Đã fix sẵn với NODE_OPTIONS trong Dockerfile

### Network Timeout
👉 **Giải pháp**: 
- Check Docker Desktop network settings
- Dùng Dockerfile.ubuntu với DNS config
- Hoặc build local (option 3)

## 📁 Files Quan Trọng

- `Dockerfile` → Alpine build (khuyến nghị)
- `Dockerfile.ubuntu` → Ubuntu 22.04 build
- `docker-compose.yml` → Docker Compose config
- `build-docker.bat` → Auto build script (Windows)
- `build-docker.sh` → Auto build script (Linux/Mac)
- `DOCKER_BUILD_GUIDE.md` → Hướng dẫn đầy đủ

## ✅ Checklist

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
