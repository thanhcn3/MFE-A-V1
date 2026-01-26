# Huong dan tao miniapp moi

Tai lieu nay mo ta quy trinh them mot miniapp (remote) moi vao monorepo, gom cac lenh mau, cac file can sua, va cach dang ky vao angular.json va shell.
##
## 0) Dat ten va port
- Ten goi mau: `remote-<name>` (vi du: `remote-new`).
- Chon port dev chua dung: shell 4200, home 4201, about 4202, profile 4203 -> miniapp moi bat dau 4204 tro len.

## 1) Nhan ban tu remote co san
### PowerShell (Windows)
```powershell
Set-Location d:/FPT_FIS/CaiNhatThanh/MFE/repo/MFE-A-V1
Copy-Item -Recurse -Force projects/remote-home projects/remote-<name>
```
### Bash (Linux/Mac/WSL)
```bash
cd /d/FPT_FIS/CaiNhatThanh/MFE/repo/MFE-A-V1
cp -r projects/remote-home projects/remote-<name>
```

## 2) Doi ten ben trong miniapp moi
Chay cac lenh thay chuoi (PowerShell):
```powershell
(Get-Content projects/remote-<name>/package.json) -replace 'remote-home','remote-<name>' | Set-Content projects/remote-<name>/package.json
(Get-Content projects/remote-<name>/federation.config.js) -replace 'remote-home','remote-<name>' | Set-Content projects/remote-<name>/federation.config.js
```
Neu ton tai port cu 4201 trong file script thi doi thanh port moi (vi du 4204).

## 3) Dam bao routing trong miniapp
- projects/remote-<name>/src/app/app.html: su dung `<router-outlet></router-outlet>`.
- projects/remote-<name>/src/app/app.ts: import `RouterModule` trong `imports`.
- projects/remote-<name>/src/app/app.routes.ts: xuat `routes` (Routes) va su dung cho cac page cua miniapp.

## 4) Expose qua Module Federation
Mo projects/remote-<name>/federation.config.js va dam bao phan `exposes` giong mau:
```js
exposes: {
  './Component': './projects/remote-<name>/src/app/app.ts',
  './Routes': './projects/remote-<name>/src/app/app.routes.ts',
},
```

## 5) Dang ky vao angular.json
Them mot block moi giong remote-home va doi tat ca `remote-home` -> `remote-<name>`, root/sourceRoot va port. Mau toi thieu:
```json
"remote-<name>": {
  "projectType": "application",
  "root": "projects/remote-<name>",
  "sourceRoot": "projects/remote-<name>/src",
  "architect": {
    "build": {
      "builder": "@angular-architects/native-federation:build",
      "options": { "prerender": false },
      "configurations": {
        "production": { "target": "remote-<name>:esbuild:production" },
        "development": { "target": "remote-<name>:esbuild:development", "dev": true }
      },
      "defaultConfiguration": "production"
    },
    "serve": {
      "builder": "@angular-architects/native-federation:build",
      "options": { "target": "remote-<name>:serve-original:development", "dev": true, "rebuildDelay": 500, "port": 0 }
    },
    "esbuild": {
      "builder": "@angular/build:application",
      "options": {
        "browser": "projects/remote-<name>/src/main.ts",
        "tsConfig": "projects/remote-<name>/tsconfig.app.json",
        "assets": [
          { "glob": "**/*", "input": "projects/remote-<name>/public" },
          { "glob": "**/*", "input": "projects/remote-<name>/src/assets", "output": "assets" },
          { "glob": "**/*", "input": "projects/core/src/lib/assets", "output": "assets" }
        ],
        "styles": [
          "projects/remote-<name>/src/styles.scss",
          "node_modules/font-awesome/css/font-awesome.min.css",
          "node_modules/bootstrap/dist/css/bootstrap.min.css"
        ],
        "scripts": ["node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"],
        "polyfills": ["es-module-shims"],
        "stylePreprocessorOptions": { "includePaths": ["projects/core/src/lib/styles"] }
      },
      "configurations": {
        "production": { "outputHashing": "all" },
        "development": { "optimization": false, "sourceMap": true }
      },
      "defaultConfiguration": "production"
    },
    "serve-original": {
      "builder": "@angular/build:dev-server",
      "options": { "port": 4204, "proxyConfig": "proxy.conf.json" },
      "configurations": {
        "production": { "buildTarget": "remote-<name>:esbuild:production" },
        "development": { "buildTarget": "remote-<name>:esbuild:development" }
      },
      "defaultConfiguration": "development"
    }
  }
}
```
Thay `4204` bang port ban chon. Copy block remote-home de giu dung cac tuy chon assets/styles/scripts.

## 6) Them script chay dev
Mo package.json va bo sung:
```json
"run:remote-<name>": "ng serve remote-<name>",
```
Neu muon chay dong thoi tat ca, sua `run:all` de them `run:remote-<name>` vao danh sach song song.

## 7) Dang ky voi shell
- projects/shell/src/main.ts: them URL remote moi trong `remoteUrls` (ca local va deploy), vi du:
```ts
'remote-<name>': 'http://localhost:4204/remoteEntry.json',
```
- projects/shell/src/app/app.routes.ts: them route lazy load:
```ts
{
  path: '<name>',
  loadChildren: () => loadRemoteModule('remote-<name>', './Routes').then((m) => m.routes),
},
```
- Neu can, them menu/sidebar link den duong dan moi.

## 8) Chay thu
```bash
# cua so 1: miniapp moi
npm run start -- --project remote-<name> --port 4204
# cua so 2: shell
npm run start -- --project shell
# hoac
npm run run:all
```
Truy cap http://localhost:4200/<name> de kiem tra router tai shell goi miniapp moi.

## 9) Checklist nhanh
- [ ] Da doi ten tat ca file va chuoi `remote-home` -> `remote-<name>`.
- [ ] angular.json co block `remote-<name>` dung port moi.
- [ ] package.json co script `run:remote-<name>` va (neu muon) `run:all` cap nhat.
- [ ] Shell da them URL remote moi va route lazy load.
- [ ] Chay dev thanh cong va duong dan shell hoat dong.
