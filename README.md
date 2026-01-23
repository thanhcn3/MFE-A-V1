# MFE Demo Project

This is a Micro Frontend (MFE) architecture demo using **Angular** and **Native Federation**.
It consists of a Shell application and 3 Remote applications (Home, About, Profile), sharing a common Core library.

## 🏗 Project Structure

- **projects/shell**: The main entry point (Host).
- **projects/remote-home**: Home page application.
- **projects/remote-about**: About Us application.
- **projects/remote-profile**: User Profile application.
- **projects/core**: Shared library containing State, Services, Guards, and Helpers.

## ➕ Create a New Miniapp (Remote)

Mục tiêu: miniapp mới được load qua router (native federation) thay vì share component trực tiếp.

1) Tạo skeleton
- Clone một remote hiện có (ví dụ `projects/remote-home`) thành thư mục mới `projects/remote-<name>`; đổi `name` trong `project.json`, `angular.json`, scripts nếu cần.
- Đặt cổng dev riêng (ví dụ 4204) trong `package.json` script `start` của miniapp mới.

2) Cấu hình route trong miniapp
- `src/app/app.html`: dùng `<router-outlet></router-outlet>`.
- `src/app/app.ts`: import `RouterModule` và dùng trong `imports` của root component.
- `src/app/app.routes.ts`: định nghĩa `export const routes: Routes = [...]`. Nếu cần HTTP/Translate riêng, có thể thêm `providers` tại route gốc (xem mẫu ở remote-profile).

3) Expose router qua Module Federation
- `projects/remote-<name>/federation.config.js`:
  ```js
  exposes: {
    './Component': './projects/remote-<name>/src/app/app.ts', // giữ lại nếu cần
    './Routes': './projects/remote-<name>/src/app/app.routes.ts',
  },
  ```

4) Đăng ký remote vào shell
- `projects/shell/src/main.ts`: thêm URL cho remote mới (local và deploy):
  ```ts
  const remoteUrls = isLocalhost ? {
    ...
    remoteNew: 'http://localhost:4204/remoteEntry.json',
  } : {
    ...
    remoteNew: `${baseUrl}/remote-new/remoteEntry.json`,
  };
  ```
- `projects/shell/src/app/app.routes.ts`: thêm route lazy load router của remote mới:
  ```ts
  {
    path: 'new',
    loadChildren: () => loadRemoteModule('remoteNew', './Routes').then(m => m.routes),
  },
  ```
- (Tuỳ chọn) thêm link menu vào sidebar bằng `routerLink="/new"`.

5) Chạy độc lập và cùng shell
- Chạy miniapp: `npm run start -- --project remote-<name>` (hoặc script tương ứng).
- Chạy shell: `npm start -- --project shell` hoặc `npm run run:all` để chạy tất cả.

6) Kiểm tra
- Mở `http://localhost:4200/<path-remote>` (ví dụ `/new`) để xác nhận shell load router từ miniapp mới.

### 📜 Lệnh mẫu tạo nhanh miniapp mới (remote-new)

> Ví dụ dùng PowerShell trên Windows; với bash, thay `Copy-Item` bằng `cp -r`.

1) Nhân bản một remote làm template
```powershell
Set-Location d:/FPT_FIS/CaiNhatThanh/MFE/repo/MFE-A-V1
Copy-Item -Recurse -Force projects/remote-home projects/remote-new
```

2) Đổi tên dự án (tối thiểu trong package.json và federation.config.js)
```powershell
(Get-Content projects/remote-new/package.json) -replace 'remote-home','remote-new' | Set-Content projects/remote-new/package.json
(Get-Content projects/remote-new/federation.config.js) -replace 'remote-home','remote-new' | Set-Content projects/remote-new/federation.config.js
```

3) Thêm expose router nếu chưa có
```powershell
# Mở projects/remote-new/federation.config.js và chắc chắn có:
# exposes: {
#   './Component': './projects/remote-new/src/app/app.ts',
#   './Routes': './projects/remote-new/src/app/app.routes.ts',
# }
```

4) Đảm bảo app.html và app.ts dùng router
- app.html: `<router-outlet></router-outlet>`
- app.ts: import `RouterModule` và đưa vào `imports` của component.

5) Shell: thêm remote mới
```powershell
# projects/shell/src/main.ts
# thêm vào remoteUrls (local): remoteNew: 'http://localhost:4204/remoteEntry.json'

# projects/shell/src/app/app.routes.ts
# thêm route:
# {
#   path: 'new',
#   loadChildren: () => loadRemoteModule('remoteNew', './Routes').then(m => m.routes),
# },
```

6) Chạy dev
```powershell
# Cửa sổ 1: remote-new
npm run start -- --project remote-new --port 4204

# Cửa sổ 2: shell
npm run start -- --project shell
```

7) Kiểm tra
- Mở http://localhost:4200/new

## 🚀 How to Run

To run the entire ecosystem (Shell + 3 Remotes) in parallel:

```bash
npm run run:all
```

- **Shell**: [http://localhost:4200](http://localhost:4200)
- **Home**: [http://localhost:4201](http://localhost:4201)
- **About**: [http://localhost:4202](http://localhost:4202)
- **Profile**: [http://localhost:4203](http://localhost:4203)

---

## 🐳 Docker

### Quick Start (Recommended)

**Windows:**
```bash
.\build-docker.bat
```

**Linux/Mac:**
```bash
./build-docker.sh
```

### Access Application
```
http://localhost:8080/shell           # Shell app (main)
http://localhost:8080/remote-home     # Home remote
http://localhost:8080/remote-about    # About remote
http://localhost:8080/remote-profile  # Profile remote
```

### Build Solutions

#### 1. ⚡ Alpine Linux (Default - Recommended)
```bash
docker compose build --no-cache
docker compose up
```

#### 2. 🐧 Ubuntu 22.04 (If Alpine fails)
Edit docker-compose.yml: `dockerfile: Dockerfile.ubuntu`, then:
```bash
docker compose build --no-cache
docker compose up
```

#### 3. 💻 Local Build (Network issues)
```bash
.\build-local.bat       # Windows
./build-local.sh        # Linux/Mac
```

### 📖 Documentation
- 📘 [Complete Guide](DOCKER_BUILD_GUIDE.md) - All solutions & troubleshooting
- 🚀 [Quick Start](QUICKSTART.md) - TL;DR version

## 📚 Core Library Usage

The `core` library is mapped in `tsconfig.json` so you can import it directly from `'core'`.

### 1. State Management (AuthStore)
Using Angular Signals.

```typescript
import { inject } from '@angular/core';
import { AuthStore } from 'core';

@Component({ ... })
export class MyComponent {
  private auth = inject(AuthStore);

  // Signals
  user = this.auth.user;       // Read state
  loading = this.auth.isLoading;

  login() {
    this.auth.login('username'); // Action
  }
}
```

### 2. API Services (BaseApiService)
Generic wrapper around HttpClient.

```typescript
import { inject } from '@angular/core';
import { BaseApiService } from 'core';

export class UserService {
  private api = inject(BaseApiService);

  getUsers() {
    return this.api.get<User[]>('/api/users');
  }
}
```

### 3. Guards (AuthGuard)
Protect routes based on AuthStore.

```typescript
import { Routes } from '@angular/router';
import { authGuard } from 'core';

export const routes: Routes = [
  {
    path: 'protected',
    component: ProtectedComponent,
    canActivate: [authGuard]
  }
];
```

### 4. Helpers

```typescript
import { DateHelper, StringHelper } from 'core';

const formatted = DateHelper.formatDate(new Date());
const capitalized = StringHelper.capitalize('hello');
```

## 🛠 Development Notes

- **Bootstrap 5** is integrated into all projects for styling.
- **Navigation** is handled by the Shell's sidebar.
- **Lazy Loading**: Remotes are lazy-loaded via Native Federation.
