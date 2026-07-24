import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from './loading.service';

// Functional interceptor (see SERVICE_GUIDELINES.md — no class-based
// interceptors), registered via `provideHttpClient(withInterceptors([...]))`
// in app.config.ts, before httpErrorInterceptor so the request is counted
// as in-flight for its whole lifecycle, including error-interceptor
// processing. Every request through BaseApiService (the one entry point
// for HTTP, per Day 9) passes through this.
//
// `finalize()` runs on completion, error, *and* unsubscription/cancellation
// — decrement always fires exactly once per increment, regardless of how
// the request ends.
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.increment();
  return next(req).pipe(finalize(() => loadingService.decrement()));
};
