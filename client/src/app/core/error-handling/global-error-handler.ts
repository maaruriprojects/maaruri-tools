import { ErrorHandler, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTE_SEGMENTS } from '../config/route-paths';
import { DEFAULT_LOCALE } from '../i18n/locale';
import { LoggingService } from '../logging/logging.service';

const CONTEXT = '[GlobalErrorHandler]';

// Provided via `{ provide: ErrorHandler, useClass: GlobalErrorHandler }` in
// app.config.ts, not `@Service()` — it must be registered under Angular's
// own ErrorHandler token, the same pattern as RouteDataTitleStrategy (see
// core/seo/route-data-title-strategy.ts).
//
// Catches every uncaught exception application-wide: template errors,
// synchronous throws, unhandled promise rejections Angular surfaces through
// this handler. Logs full technical detail (message, stack, cause) via
// LoggingService, then — in the browser only, never during SSR/prerendering
// — redirects to the friendly ErrorPage. The redirect carries no part of
// the actual error; ErrorPage's text comes entirely from static route
// data, so a raw stack trace or technical message can never reach the UI.
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly loggingService = inject(LoggingService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  handleError(error: unknown): void {
    const normalized = error instanceof Error ? error : new Error(String(error));

    this.loggingService.error(normalized.message, CONTEXT, {
      name: normalized.name,
      stack: normalized.stack,
      cause: normalized.cause,
    });

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const errorPageUrl = `/${DEFAULT_LOCALE.code}/${ROUTE_SEGMENTS.error}`;
    if (this.router.url !== errorPageUrl) {
      void this.router.navigate([DEFAULT_LOCALE.code, ROUTE_SEGMENTS.error]);
    }
  }
}
