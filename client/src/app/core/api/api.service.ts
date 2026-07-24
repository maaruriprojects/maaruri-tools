import type { HttpResourceOptions, HttpResourceRef } from '@angular/common/http';

// The contract, defined before the class (see SERVICE_GUIDELINES.md). Any
// future alternative implementation (a mock for tests, a differently-cached
// variant) only has to satisfy this shape.
export interface ApiService {
  /** Resolves a relative resource path against ConfigService.apiBaseUrl. */
  resourceUrl(path: string): string;

  /**
   * The one entry point for GET-style data fetching. `pathFn` is a reactive
   * function (like httpResource's own request function) returning a path
   * relative to `apiBaseUrl`, or `undefined` to skip the request. Building
   * on this instead of calling `httpResource()`/`HttpClient` directly is
   * what keeps every request going through the same base URL and, once
   * Days 10–12 add interceptors (logging, error handling, loading), the
   * same interceptor chain — nothing bypasses it via an ad-hoc call.
   */
  getResource<T>(
    pathFn: () => string | undefined,
    options: HttpResourceOptions<T, unknown> & { defaultValue: NoInfer<T> },
  ): HttpResourceRef<T>;
  getResource<T>(
    pathFn: () => string | undefined,
    options?: HttpResourceOptions<T, unknown>,
  ): HttpResourceRef<T | undefined>;
}
