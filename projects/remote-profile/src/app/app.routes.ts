
import { importProvidersFrom } from '@angular/core';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from 'core';
import { ProfilePage } from './pages/profile-page/profile-page';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { HistoryComponent } from './pages/history/history.component';

function HttpLoaderFactory(http: HttpClient) {
  return createTranslateLoader(http, new URL('assets/i18n/', import.meta.url).href);
}

export const routes: Routes = [
  {
    path: '',
    providers: [
      provideHttpClient(withFetch()),
      importProvidersFrom(
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          },
          isolate: true
        })
      )
    ],
    children: [
      { path: '', component: ProfilePage },
      { path: 'settings', component: SettingsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'history', component: HistoryComponent }
    ]
  }
];
