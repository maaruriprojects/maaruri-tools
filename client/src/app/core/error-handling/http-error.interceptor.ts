import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import type { AppError } from './app-error';
import { LoggingService } from '../logging/logging.service';
import { ToastService } from '../toast/toast.service';

const CONTEXT = '[httpErrorInterceptor]';

// Functional interceptor (see SERVICE_GUIDELINES.md — no class-based
// guards/interceptors in this project), registered via
// `provideHttpClient(withInterceptors([httpErrorInterceptor]))` in
// app.config.ts. Every request made through BaseApiService (core/api) — the
// one entry point for HTTP, per Day 9 — passes through this.
//
// Logs full technical detail (status, URL, response body) via
// LoggingService, then re-throws an `AppError`: a normalized, user-safe
// object with no stack trace or raw server message. Also calls
// ToastService.error() directly — closing the loop from Day 11, so a
// failed request always visibly notifies the user, not just whoever
// happens to be watching the request's own error state — while still
// re-throwing so a specific caller (e.g. httpResource's `.error()` signal)
// can additionally react inline if it wants to.
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const loggingService = inject(LoggingService);
  const toastService = inject(ToastService);

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

      toastService.error(appError.message);

      return throwError(() => appError);
    }),
  );
};

// Voice per docs/design/09-ux-flow-interaction.md §3: active voice, no
// apology, two-part "what happened" + "what to do", no exclamation points.
function userSafeMessageFor(httpError: HttpErrorResponse | undefined): string {
  if (!httpError || httpError.status === 0) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  if (httpError.status === 404) {
    return "The requested resource couldn't be found. Try again or refresh the page.";
  }
  if (httpError.status >= 500) {
    return 'The server had a problem on its end. Please try again shortly.';
  }
  return "That request didn't go through. Try again in a moment.";
}
