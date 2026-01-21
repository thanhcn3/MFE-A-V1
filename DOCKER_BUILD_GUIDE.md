# 🐳 Hướng Dẫn Build MFE Angular với Docker Ubuntu

## 📋 Tổng Quan

Dự án này cung cấp **3 giải pháp** để build MFE Angular trong Docker:

1. **Alpine Linux** (Khuyến nghị - Nhẹ nhất)
2. **Ubuntu 22.04** (Phương án dự phòng)
3. **Debug Mode** (Để kiểm tra lỗi)

---

## ✅ Giải Pháp 1: Alpine Linux (KHUYẾN NGHỊ)

### Ưu điểm
- ⚡ **Nhanh nhất**: Image nhỏ (~150MB)
- 🔒 **Bảo mật tốt**: Surface attack nhỏ
- 🚀 **Build nhanh**: Ít dependencies
- ✔️ **Ổn định**: Không phụ thuộc Debian repos

### Cách sử dụng

#### Windows
```bash
# Sử dụng script tự động
.\build-docker.bat

# Hoặc thủ công
docker compose build --no-cache
docker compose up
```

#### Linux/Mac
```bash
# Sử dụng script tự động
chmod +x build-docker.sh
./build-docker.sh

# Hoặc thủ công
docker compose build --no-cache
docker compose up
```

### Truy cập ứng dụng
- Shell: http://localhost:8080/shell
- Remote Home: http://localhost:8080/remote-home
- Remote About: http://localhost:8080/remote-about
- Remote Profile: http://localhost:8080/remote-profile

---

## 🐧 Giải Pháp 2: Ubuntu 22.04

### Khi nào dùng
- Cần compatibility với tools cụ thể
- Có requirements đặc biệt về OS
- Debug issues liên quan đến Debian/Ubuntu

### Cách sử dụng

```bash
# Sửa docker-compose.yml
# Đổi: dockerfile: Dockerfile
# Thành: dockerfile: Dockerfile.ubuntu

# Build
docker compose build --no-cache
docker compose up
```

### Đặc điểm
- ✅ Tự động cấu hình DNS (8.8.8.8, 8.8.4.4)
- ✅ Node.js 22.x từ NodeSource
- ✅ Đầy đủ build tools
- ⚠️ Image lớn hơn (~300MB)

---

## 🔧 Giải Pháp 3: Build Local rồi Copy

### Khi nào dùng
- Network không ổn định
- Cần debug từng bước
- Build trên máy host nhanh hơn

### Cách thực hiện

#### Bước 1: Build local
```bash
# Cài dependencies
npm ci --legacy-peer-deps

# Build tất cả MFE
npm run ng build shell -- --configuration=production
npm run ng build remote-home -- --configuration=production
npm run ng build remote-about -- --configuration=production
npm run ng build remote-profile -- --configuration=production
```

#### Bước 2: Tạo Dockerfile đơn giản
```dockerfile
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output từ host
COPY dist/shell/browser /usr/share/nginx/html/shell
COPY dist/remote-home/browser /usr/share/nginx/html/remote-home
COPY dist/remote-about/browser /usr/share/nginx/html/remote-about
COPY dist/remote-profile/browser /usr/share/nginx/html/remote-profile

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Bước 3: Build Docker
```bash
docker build -t mfe-app:local .
docker run -p 8080:80 mfe-app:local
```

---

## 🚨 Xử Lý Lỗi Thường Gặp

### 1. DNS Resolution Failed
```
Error: Temporary failure resolving 'deb.debian.org'
```

**Giải pháp:**
```yaml
# Thêm vào docker-compose.yml
services:
  mfe-app:
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

### 2. Network Timeout
```
Error: connect ETIMEDOUT
```

**Giải pháp:**
```bash
# Kiểm tra Docker network
docker network ls
docker network inspect bridge

# Restart Docker Desktop
# Hoặc thử build với host network (Linux)
docker build --network=host -t mfe-app .
```

### 3. Memory Issues
```
Error: JavaScript heap out of memory
```

**Giải pháp:**
```dockerfile
# Đã có trong Dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Hoặc tăng thêm
ENV NODE_OPTIONS="--max-old-space-size=8192"
```

### 4. Build Tool Errors
```
Error: Cannot find module '@angular/cli'
```

**Giải pháp:**
```bash
# Xóa cache và rebuild
docker builder prune -f
docker compose build --no-cache
```

---

## 📊 So Sánh Các Giải Pháp

| Tiêu chí | Alpine | Ubuntu | Local Build |
|----------|--------|--------|-------------|
| **Tốc độ** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Kích thước** | ~150MB | ~300MB | ~50MB |
| **Độ tin cậy** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Dễ debug** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Network-free** | ❌ | ❌ | ✅ |

---

## 🎯 Khuyến Nghị

### Môi trường Production
✅ **Sử dụng Alpine** (Dockerfile mặc định)
- Nhẹ, nhanh, bảo mật
- CI/CD pipeline ổn định

### Môi trường Development
✅ **Sử dụng Local Build**
- Debug dễ dàng
- Không phụ thuộc network
- Build lại nhanh

### Khi có vấn đề Network
✅ **Sử dụng Ubuntu** (Dockerfile.ubuntu)
- DNS configuration sẵn
- Compatible với corporate proxies

---

## 🔍 Debug Commands

```bash
# Xem logs chi tiết
docker compose build --progress=plain

# Check container
docker compose ps
docker compose logs -f

# Vào container để debug
docker compose exec mfe-app sh

# Check network
docker network inspect mfe-a-v1_default

# Clean all
docker compose down -v
docker system prune -af
```

---

## 📝 Checklist Trước Khi Build

- [ ] Docker Desktop đang chạy
- [ ] Internet connection ổn định
- [ ] Đủ dung lượng disk (ít nhất 2GB)
- [ ] Không có process nào đang dùng port 8080
- [ ] package.json và package-lock.json đã commit
- [ ] File .dockerignore đã có

---

## 🎉 Kết Luận

**TL;DR - Quick Start:**

```bash
# Clone repo
cd MFE-A-V1

# Option 1: Auto build (Windows)
.\build-docker.bat

# Option 2: Auto build (Linux/Mac)
./build-docker.sh

# Option 3: Manual
docker compose build --no-cache
docker compose up

# Access
open http://localhost:8080/shell
```

**Nếu gặp lỗi:**
1. Thử Dockerfile.ubuntu
2. Hoặc build local + copy
3. Check firewall/antivirus
4. Check Docker Desktop settings

---

## 📞 Support

Nếu vẫn gặp vấn đề:
1. Check logs: `docker compose logs -f`
2. Xem file DOCKER_GUIDE.md này
3. Google error message cụ thể
4. Check Docker Desktop dashboard

**Good luck! 🚀**
