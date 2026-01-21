# 🔧 Fix Lỗi Alpine musl với @napi-rs/magic-string

## ❌ Lỗi Gặp Phải

```
Cannot find module '@napi-rs/magic-string-linux-x64-musl'
```

## 🔍 Nguyên Nhân

- **Alpine Linux** sử dụng **musl libc**
- **Ubuntu/Debian** sử dụng **glibc**
- Package `@napi-rs/magic-string` có native bindings cần binary đúng với libc type
- Binary cho musl không có sẵn hoặc không được cài đúng

## ✅ GIẢI PHÁP 1: Dùng Debian Slim (KHUYẾN NGHỊ)

### Tại sao?
- ✅ Dùng glibc như Ubuntu
- ✅ Nhẹ hơn Ubuntu (~200MB vs ~300MB)
- ✅ Native modules hoạt động ngay
- ✅ Không cần config đặc biệt

### Cách dùng

```bash
# docker-compose.yml đã được update thành:
dockerfile: Dockerfile.debian

# Build ngay
docker compose build --no-cache
docker compose up
```

**File**: [Dockerfile.debian](Dockerfile.debian)

---

## ✅ GIẢI PHÁP 2: Dùng Ubuntu 22.04

```bash
# Sửa docker-compose.yml
dockerfile: Dockerfile.ubuntu

# Build
docker compose build --no-cache
docker compose up
```

**File**: [Dockerfile.ubuntu](Dockerfile.ubuntu)

---

## ✅ GIẢI PHÁP 3: Fix Alpine (Nếu bắt buộc dùng Alpine)

### Option A: Cài musl binary manually

```dockerfile
# Trong Dockerfile
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Cài dependencies
RUN npm ci --legacy-peer-deps

# Cài explicit musl package
RUN npm install --no-save @napi-rs/magic-string-linux-x64-musl

# Rebuild cho musl
RUN npm rebuild @napi-rs/magic-string
```

### Option B: Force WASM mode

```dockerfile
# Set trước khi npm install
ENV NAPI_RS_FORCE_WASM=1
ENV MAGIC_STRING_FORCE_WASM=1

RUN npm ci --legacy-peer-deps --ignore-scripts
```

⚠️ **Lưu ý**: Cách này không đảm bảo 100% hoạt động

---

## 📊 So Sánh Các Image

| Image | Size | Native Module | Build Speed | Reliability |
|-------|------|---------------|-------------|-------------|
| **Debian Slim** | ~200MB | ✅ glibc | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ubuntu 22.04** | ~300MB | ✅ glibc | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Alpine** | ~150MB | ❌ musl | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## 🎯 KHUYẾN NGHỊ

### Cho Ubuntu Server (Production)
```yaml
# docker-compose.yml
dockerfile: Dockerfile.debian  # ← MẶC ĐỊNH MỚI
```

✅ **Lý do**:
- Tương thích 100% với Ubuntu server
- Native modules hoạt động ngay
- Kích thước hợp lý (~200MB)
- Build nhanh, ổn định

### Cho Development
```bash
# Build local
.\build-local.bat

# Hoặc dùng Debian
dockerfile: Dockerfile.debian
```

---

## 🚀 Quick Fix Commands

### 1. Dùng Debian (Khuyến nghị)
```bash
# docker-compose.yml đã update sẵn
docker compose build --no-cache
docker compose up
```

### 2. Dùng Ubuntu
```bash
# Sửa docker-compose.yml: dockerfile: Dockerfile.ubuntu
docker compose build --no-cache
docker compose up
```

### 3. Local Build
```bash
.\build-local.bat     # Windows
./build-local.sh      # Linux
```

---

## 🔍 Debug Commands

```bash
# Check libc type in container
docker run --rm node:22-alpine sh -c "ldd --version"
# Output: musl libc

docker run --rm node:22-slim sh -c "ldd --version"
# Output: glibc

# Check available packages
npm view @napi-rs/magic-string
```

---

## 📝 Summary

**Vấn đề**: Alpine dùng musl, native module cần glibc  
**Giải pháp**: Dùng Debian Slim hoặc Ubuntu  
**File mới**: `Dockerfile.debian` (đã set làm mặc định)  
**Cách dùng**: `docker compose build && docker compose up`

---

## ✅ Updated Default

```yaml
# docker-compose.yml (MỚI)
dockerfile: Dockerfile.debian  # ← Thay đổi từ Dockerfile (Alpine)
```

**Lý do**: Tương thích tốt nhất với Ubuntu server, tránh musl issues.

---

*Updated: 2026-01-21*  
*Issue: @napi-rs/magic-string musl compatibility*  
*Solution: Use glibc-based images (Debian/Ubuntu)*
