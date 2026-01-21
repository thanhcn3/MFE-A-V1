# MFE Demo Project - Micro Frontend Architecture với Angular

Dự án này là một ví dụ minh họa về kiến trúc **Micro Frontend (MFE)** sử dụng **Angular** và **Native Federation**. Hệ thống bao gồm một ứng dụng chính (Shell) và các ứng dụng vệ tinh (Remote Applications) chia sẻ tài nguyên thông qua một thư viện Core chung.

## 🌟 Tính Năng Nổi Bật

- **Micro Frontend Architecture**: Chia nhỏ ứng dụng lớn thành các ứng dụng nhỏ độc lập.
- **Native Federation**: Sử dụng cơ chế Federation nhẹ nhàng, không phụ thuộc vào Webpack Module Federation.
- **Shared Core Library**: Thư viện dùng chung chứa State Management, Service, Guard và Helper.
- **State Management**: Quản lý trạng thái tập trung với **Angular Signals**.
- **Docker Support**: Sẵn sàng triển khai với Docker và Docker Compose.

## 🏗 Cấu Trúc Dự Án

Dự án được tổ chức theo cấu trúc Monorepo trong thư mục `projects/`:

- **projects/shell** (Port `4200`): Ứng dụng Host, đóng vai trò khung chứa (container) tải các remote apps.
- **projects/remote-home** (Port `4201`): Ứng dụng trang chủ.
- **projects/remote-about** (Port `4202`): Ứng dụng giới thiệu.
- **projects/remote-profile** (Port `4203`): Ứng dụng trang cá nhân người dùng.
- **projects/core**: Thư viện dùng chung (không chạy độc lập, được import bởi các app khác).

## 📋 Yêu Cầu Hệ Thống

- **Node.js**: Phiên bản 18 trở lên (Khuyên dùng v20.x).
- **NPM**: Đi kèm với Node.js.
- **Docker & Docker Compose** (Tùy chọn): Để chạy môi trường container.

## 🚀 Hướng Dẫn Cài Đặt và Chạy (Local)

### 1. Cài đặt Dependencies

Trước tiên, hãy cài đặt các gói thư viện cần thiết:

```bash
npm install
```

### 2. Chạy Ứng Dụng

Bạn có thể chạy toàn bộ hệ sinh thái hoặc từng ứng dụng riêng lẻ.

**Cách 1: Chạy tất cả cùng lúc (Khuyên dùng)**

Lệnh này sẽ khởi động Shell và cả 3 Remote Apps song song:

```bash
npm run run:all
```

**Cách 2: Chạy từng ứng dụng riêng lẻ**

```bash
# Chạy Shell (Host)
npm run run:shell

# Chạy Remote Home
npm run run:remote-home

# Chạy Remote About
npm run run:remote-about

# Chạy Remote Profile
npm run run:remote-profile
```

### 3. Truy Cập Ứng Dụng

Sau khi khởi động, bạn có thể truy cập các ứng dụng tại các địa chỉ sau:

| Ứng Dụng | URL | Mô Tả |
|----------|-----|-------|
| **Shell** | [http://localhost:4200](http://localhost:4200) | Ứng dụng chính tích hợp tất cả các module |
| **Home** | [http://localhost:4201](http://localhost:4201) | Ứng dụng Home chạy độc lập |
| **About** | [http://localhost:4202](http://localhost:4202) | Ứng dụng About chạy độc lập |
| **Profile** | [http://localhost:4203](http://localhost:4203) | Ứng dụng Profile chạy độc lập |

---

## 🐳 Hướng Dẫn Chạy Với Docker

Dự án đã được cấu hình sẵn với `Dockerfile` và `docker-compose.yml` để dễ dàng triển khai.

### 1. Build và Chạy Container

Sử dụng Docker Compose để build images và khởi động containers:

```bash
docker-compose up -d --build
```

### 2. Kiểm tra trạng thái

Kiểm tra các container đang chạy:

```bash
docker-compose ps
```

Sau khi khởi động thành công, bạn có thể truy cập các ứng dụng qua các cổng tương tự như chạy local (`4200`, `4201`...).

### 3. Dừng Container

```bash
docker-compose down
```

---

## 📚 Hướng Dẫn Sử Dụng Core Library

Thư viện `core` chứa các logic dùng chung. Nó đã được map trong `tsconfig.json`, cho phép bạn import trực tiếp từ alias `'core'`.

### Ví dụ: Sử dụng Authentication State (Signals)

Sử dụng `AuthStore` từ thư viện core để quản lý trạng thái đăng nhập:

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule nếu dùng standalone
import { AuthStore } from 'core'; // Import trực tiếp từ alias

@Component({
  selector: 'app-login-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="auth.isLoading()">Loading...</div>
    
    <div *ngIf="auth.user() as user">
      Xin chào, {{ user.name }}
    </div>
    
    <button (click)="login()">Đăng nhập</button>
  `
})
export class LoginExampleComponent {
  // Inject AuthStore (Signal Store)
  readonly auth = inject(AuthStore);

  // Truy cập state dưới dạng tín hiệu (Signals)
  // this.auth.user()
  // this.auth.isAuthenticated()

  login() {
    this.auth.login('username', 'password'); // Gọi action
  }
}
```

---

## 🛠 Script Hữu Ích

Trong file `package.json`, các script sau đây có sẵn:

- `npm start`: Chạy ứng dụng mặc định (thường là mfe-demo/shell).
- `npm run build`: Build ứng dụng cho production.
- `npm run watch`: Build và theo dõi thay đổi.
- `npm test`: Chạy unit test.
