// The contract, defined before anything that produces or consumes it (see
// SERVICE_GUIDELINES.md). What http-error.interceptor.ts re-throws instead
// of a raw HttpErrorResponse — components/services can catch this and react
// (e.g. show a toast once Day 13 builds one) without ever touching a stack
// trace or a technical error message.
export interface AppError {
  /** User-safe message. Always safe to render directly in UI. */
  readonly message: string;
  /** HTTP status code, when this originated from a failed request. */
  readonly status?: number;
  /** Where the error originated, so a future handler can react differently per source. */
  readonly source: 'http' | 'runtime';
}
