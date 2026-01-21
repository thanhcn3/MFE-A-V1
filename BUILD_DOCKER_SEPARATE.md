# Hướng dẫn Build và Deploy Docker cho từng Micro-Frontend

## Tổng quan

Project được chia thành 4 micro-frontends độc lập, mỗi app có Docker image riêng:
- **Shell** (Host Application) - Port 8080
- **Remote-Home** - Port 8081
- **Remote-About** - Port 8082
- **Remote-Profile** - Port 8083

## Cách 1: Build và Deploy TẤT CẢ (Khuyến nghị)

### Build tất cả projects
```bash
# Windows
build-all.bat

# Linux/Mac (Git Bash)
chmod +x build-all.sh
./build-all.sh
```

### Tạo tất cả Docker images
```bash
# Windows
build-docker-all.bat

# Hoặc dùng docker-compose
docker-compose -f docker-compose.separate.yml build
```

### Chạy tất cả containers
```bash
docker-compose -f docker-compose.separate.yml up -d
```

### Truy cập ứng dụng
- Shell: http://localhost:8080
- Remote-Home: http://localhost:8081
- Remote-About: http://localhost:8082
- Remote-Profile: http://localhost:8083

## Cách 2: Build và Deploy TỪNG APP RIÊNG LẺ

### Shell Application
```bash
# Build
npm run build shell

# Tạo Docker image
docker build -f Dockerfile.shell -t mfe-shell:latest .

# Chạy container
docker run -d -p 8080:80 --name shell mfe-shell:latest
```

### Remote-Home Application
```bash
# Build
npm run build remote-home

# Tạo Docker image
docker build -f Dockerfile.remote-home -t mfe-remote-home:latest .

# Chạy container
docker run -d -p 8081:80 --name remote-home mfe-remote-home:latest
```

### Remote-About Application
```bash
# Build
npm run build remote-about

# Tạo Docker image
docker build -f Dockerfile.remote-about -t mfe-remote-about:latest .

# Chạy container
docker run -d -p 8082:80 --name remote-about mfe-remote-about:latest
```

### Remote-Profile Application
```bash
# Build
npm run build remote-profile

# Tạo Docker image
docker build -f Dockerfile.remote-profile -t mfe-remote-profile:latest .

# Chạy container
docker run -d -p 8083:80 --name remote-profile mfe-remote-profile:latest
```

## Quản lý Containers

### Xem trạng thái
```bash
docker ps
```

### Xem logs
```bash
# Xem logs từng container
docker logs shell
docker logs remote-home
docker logs remote-about
docker logs remote-profile

# Hoặc dùng docker-compose
docker-compose -f docker-compose.separate.yml logs -f
```

### Dừng containers
```bash
# Dừng từng container
docker stop shell remote-home remote-about remote-profile

# Hoặc dùng docker-compose
docker-compose -f docker-compose.separate.yml down
```

### Khởi động lại
```bash
# Khởi động lại từng container
docker restart shell remote-home remote-about remote-profile

# Hoặc dùng docker-compose
docker-compose -f docker-compose.separate.yml restart
```

## Cấu trúc Files

```
├── Dockerfile                        # Dockerfile tất cả trong một (legacy)
├── Dockerfile.shell                  # Dockerfile cho Shell
├── Dockerfile.remote-home            # Dockerfile cho Remote-Home
├── Dockerfile.remote-about           # Dockerfile cho Remote-About
├── Dockerfile.remote-profile         # Dockerfile cho Remote-Profile
├── nginx-shell.conf                  # Nginx config cho Shell
├── nginx-remote.conf                 # Nginx config cho Remote apps (có CORS)
├── docker-compose.yml                # Docker compose tất cả trong một (legacy)
├── docker-compose.separate.yml       # Docker compose cho từng app riêng
├── build-all.bat                     # Build tất cả projects
├── build-docker-shell.bat            # Build + Docker cho Shell
├── build-docker-remote-home.bat      # Build + Docker cho Remote-Home
├── build-docker-remote-about.bat     # Build + Docker cho Remote-About
├── build-docker-remote-profile.bat   # Build + Docker cho Remote-Profile
└── build-docker-all.bat              # Build + Docker cho tất cả
```

## Quản lý Docker Images

### Xem danh sách images
```bash
docker images | grep mfe-
```

### Xóa images
```bash
# Xóa từng image
docker rmi mfe-shell:latest
docker rmi mfe-remote-home:latest
docker rmi mfe-remote-about:latest
docker rmi mfe-remote-profile:latest

# Xóa tất cả images không dùng
docker image prune -a
```

### Tag và Push lên Registry
```bash
# Tag images
docker tag mfe-shell:latest your-registry/mfe-shell:latest
docker tag mfe-remote-home:latest your-registry/mfe-remote-home:latest
docker tag mfe-remote-about:latest your-registry/mfe-remote-about:latest
docker tag mfe-remote-profile:latest your-registry/mfe-remote-profile:latest

# Push lên registry
docker push your-registry/mfe-shell:latest
docker push your-registry/mfe-remote-home:latest
docker push your-registry/mfe-remote-about:latest
docker push your-registry/mfe-remote-profile:latest
```

## Ưu điểm của Deploy Riêng Lẻ

1. **Độc lập**: Mỗi micro-frontend có thể deploy/update riêng
2. **Scale linh hoạt**: Scale từng service theo nhu cầu
3. **Isolation**: Lỗi ở một app không ảnh hưởng app khác
4. **CI/CD**: Dễ dàng tích hợp pipeline riêng cho từng app
5. **Versioning**: Quản lý version độc lập

## Lưu ý

1. **CORS**: Remote apps có cấu hình CORS để Shell có thể load
2. **Network**: Dùng docker-compose để tạo network chung giữa các containers
3. **Ports**: Đảm bảo các port không bị trùng
4. **Build Order**: Không bắt buộc thứ tự build, có thể build song song
5. **Health Check**: Mỗi app có endpoint `/health` để kiểm tra

## Troubleshooting

### Port bị chiếm
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :8083
```

### Container không start
```bash
# Kiểm tra logs
docker logs <container-name>

# Kiểm tra lỗi build
docker build -f Dockerfile.<app> --no-cache -t mfe-<app>:latest .
```

### Remote app không load được
- Kiểm tra CORS headers trong nginx-remote.conf
- Kiểm tra network giữa các containers
- Kiểm tra federation.config.js của từng remote app
