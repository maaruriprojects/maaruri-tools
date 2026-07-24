// The contract, defined before anything that produces or consumes it (see
// SERVICE_GUIDELINES.md). What http-error.interceptor.ts re-throws instead
// of a raw HttpErrorResponse — components/services can catch this and react
// (the interceptor itself already calls ToastService.error() with
// `message`, per Day 13; a specific caller can additionally react inline)
// without ever touching a stack trace or a technical error message.
export interface AppError {
  /** User-safe message. Always safe to render directly in UI. */
  readonly message: string;
  /** HTTP status code, when this originated from a failed request. */
  readonly status?: number;
  /** Where the error originated, so a future handler can react differently per source. */
  readonly source: 'http' | 'runtime';
}
