# Build & Deploy with Nginx

Hướng dẫn build các miniapp và deploy lên Nginx (cùng domain, khác path). Mặc định shell ở `/shell`, các remote ở `/remote-home`, `/remote-about`, `/remote-profile`, v.v.

## 1) Prerequisites
- Node.js 18+ và npm
- Nginx (hoặc dùng container nginx)

## 2) Cài dependencies
```bash
npm install
```

## 3) Build từng miniapp
```bash
npm run build -- --project shell
npm run build -- --project remote-home
npm run build -- --project remote-about
npm run build -- --project remote-profile
```
Kết quả build:
- `dist/shell/browser`
- `dist/remote-home/browser`
- `dist/remote-about/browser`
- `dist/remote-profile/browser`

## 4) Chuẩn bị thư mục deploy (ví dụ máy chủ)
```bash
sudo mkdir -p /var/www/mfe/{shell,remote-home,remote-about,remote-profile}
sudo cp -r dist/shell/browser/* /var/www/mfe/shell/
sudo cp -r dist/remote-home/browser/* /var/www/mfe/remote-home/
sudo cp -r dist/remote-about/browser/* /var/www/mfe/remote-about/
sudo cp -r dist/remote-profile/browser/* /var/www/mfe/remote-profile/
```

## 5) Cấu hình Nginx (sample)
File ví dụ: `/etc/nginx/conf.d/mfe.conf`
```nginx
server {
    listen 80;
    server_name _;

    # Shell host
    location /shell/ {
        alias /var/www/mfe/shell/;
        try_files $uri $uri/ /shell/index.html;
    }

    # Remotes
    location /remote-home/ {
        alias /var/www/mfe/remote-home/;
        try_files $uri $uri/ /remote-home/index.html;
    }

    location /remote-about/ {
        alias /var/www/mfe/remote-about/;
        try_files $uri $uri/ /remote-about/index.html;
    }

    location /remote-profile/ {
        alias /var/www/mfe/remote-profile/;
        try_files $uri $uri/ /remote-profile/index.html;
    }

    # Cho phép remoteEntry.json và js được fetch (CORS đơn giản)
    location ~* \.(js|json)$ {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
    }
}
```
- Nếu cần SPA fallback cho từng remote, đã dùng `try_files ... index.html` theo path tương ứng.
- Nếu muốn tất cả phục vụ dưới root `/`, chỉnh lại path và alias tương ứng.

## 6) Cập nhật URL remote trong shell khi deploy
`shell/src/main.ts` dùng `baseUrl` để trỏ tới `/remote-home/remoteEntry.json`, `/remote-about/remoteEntry.json`, `/remote-profile/remoteEntry.json`. Nếu deploy đúng path như cấu hình trên, không cần sửa thêm.

## 7) Reload Nginx
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 8) Kiểm tra
- Shell: `http://<host>/shell`
- Home: `http://<host>/remote-home/remoteEntry.json`
- About: `http://<host>/remote-about/remoteEntry.json`
- Profile: `http://<host>/remote-profile/remoteEntry.json`
- Điều hướng trong shell tới `/home`, `/about`, `/profile`, v.v.

## 9) Deploy bằng Docker (tuỳ chọn)
- Tham khảo `docker/nginx/default.conf` và `docker/nginx/Dockerfile` trong repo.
- Build nhanh:
  ```bash
  docker build -f docker/nginx/Dockerfile -t mfe-nginx .
  docker run -p 8080:80 mfe-nginx
  ```
- Hoặc dùng docker-compose nếu đã cấu hình.

## 10) Ghi chú
- Nếu đổi path public (ví dụ muốn shell ở `/`), cần đồng bộ lại `remoteUrls` trong `shell/src/main.ts` và rule Nginx.
- Bật gzip/caching trong Nginx nếu muốn tối ưu.
