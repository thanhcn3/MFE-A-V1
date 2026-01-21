# MFE Demo Project

This is a Micro Frontend (MFE) architecture demo using **Angular** and **Native Federation**.
It consists of a Shell application and 3 Remote applications (Home, About, Profile), sharing a common Core library.

## 🏗 Project Structure

- **projects/shell**: The main entry point (Host).
- **projects/remote-home**: Home page application.
- **projects/remote-about**: About Us application.
- **projects/remote-profile**: User Profile application.
- **projects/core**: Shared library containing State, Services, Guards, and Helpers.

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

Build and run all MFEs with Docker Compose:

```bash
docker compose build
docker compose up -d
```

Services:

- Shell: http://localhost:4200
- Home: http://localhost:4201
- About: http://localhost:4202
- Profile: http://localhost:4203

Notes:

- Shell import map points to `http://localhost:4201/4202/4203` per `projects/shell/src/main.ts`. The compose ports match this.
- Nginx is configured to avoid caching `remoteEntry.json/js` and to serve SPA with fallback.

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
