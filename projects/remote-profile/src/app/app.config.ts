import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'core';

import { routes } from './app.routes';

export function HttpLoaderFactory(http: HttpClient) {
  // Use import.meta.url to get the location of this file in the remote bundle
  // We need to point to assets relatively to the remote's domain
  const baseUrl = new URL('assets/i18n/', import.meta.url).href;
  return createTranslateLoader(http, baseUrl);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        isolate: true // Important: Isolates this instance so it doesn't conflict/merge weirdly with shell's if loaded
      })
    )
  ]
};
