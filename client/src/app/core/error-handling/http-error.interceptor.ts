import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { AppError } from './app-error';
import { LoggingService } from '../logging/logging.service';

const CONTEXT = '[httpErrorInterceptor]';

// Functional interceptor (see SERVICE_GUIDELINES.md — no class-based
// guards/interceptors in this project), registered via
// `provideHttpClient(withInterceptors([httpErrorInterceptor]))` in
// app.config.ts. Every request made through BaseApiService (core/api) — the
// one entry point for HTTP, per Day 9 — passes through this.
//
// Logs full technical detail (status, URL, response body) via
// LoggingService, then re-throws an `AppError`: a normalized, user-safe
// object with no stack trace or raw server message. Whoever made the
// request (a component, a future toast handler once Day 13 exists) reacts
// to `AppError.message` directly — it's always safe to render as-is.
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const loggingService = inject(LoggingService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const httpError = error instanceof HttpErrorResponse ? error : undefined;

      loggingService.error(
        httpError
          ? `${httpError.status} ${httpError.statusText} — ${req.method} ${req.url}`
          : `Unknown HTTP failure — ${req.method} ${req.url}`,
        CONTEXT,
        {
          url: req.url,
          method: req.method,
          status: httpError?.status,
          body: httpError?.error ?? error,
        },
      );

      const appError: AppError = {
        message: userSafeMessageFor(httpError),
        status: httpError?.status,
        source: 'http',
      };

      return throwError(() => appError);
    }),
  );
};

function userSafeMessageFor(httpError: HttpErrorResponse | undefined): string {
  if (!httpError || httpError.status === 0) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  if (httpError.status === 404) {
    return "The requested resource couldn't be found.";
  }
  if (httpError.status >= 500) {
    return 'The server had a problem on its end. Please try again shortly.';
  }
  return 'Something went wrong with that request. Please try again.';
}
