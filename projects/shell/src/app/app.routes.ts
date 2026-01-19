import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
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
];
