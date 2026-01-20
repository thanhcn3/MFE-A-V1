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
        loadComponent: () => loadRemoteModule('remoteHome', './Component').then((m) => m.App),
      },
      {
        path: 'about',
        loadComponent: () => loadRemoteModule('remoteAbout', './Component').then((m) => m.App),
      },
      {
        path: 'profile',
        loadComponent: () => loadRemoteModule('remoteProfile', './Component').then((m) => m.App),
      },
    ]
  },
  {
    path: 'login',
    component: LoginPage
  },
];

