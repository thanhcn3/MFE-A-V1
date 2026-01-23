import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';
import { LoginPage } from './pages/login-page/login-page';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from 'core';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadChildren: () => loadRemoteModule('remote-home', './Routes').then((m) => m.routes),
      },
      {
        path: 'about',
        loadChildren: () => loadRemoteModule('remote-about', './Routes').then((m) => m.routes),
      },
      {
        path: 'profile',
        loadChildren: () => loadRemoteModule('remote-profile', './Routes').then((m) => m.routes),
      },
    ]
  },
  {
    path: 'login',
    component: LoginPage
  },
];

