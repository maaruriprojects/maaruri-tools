import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/error-handling/global-error-handler';
import { httpErrorInterceptor } from './core/error-handling/http-error.interceptor';
import { RouteDataTitleStrategy } from './core/seo/route-data-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    // withFetch: avoids the Node XHR shim during SSR/prerendering.
    provideHttpClient(withFetch(), withInterceptors([httpErrorInterceptor])),
    { provide: TitleStrategy, useClass: RouteDataTitleStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
