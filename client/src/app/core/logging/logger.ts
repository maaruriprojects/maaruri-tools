// The contract, defined before the class (see SERVICE_GUIDELINES.md).
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  /** Verbose diagnostic detail — development only by default. */
  debug(message: string, context?: string, metadata?: unknown): void;
  /** Normal operational events. */
  info(message: string, context?: string, metadata?: unknown): void;
  /** Recoverable problems worth noticing. */
  warn(message: string, context?: string, metadata?: unknown): void;
  /** Failures. */
  error(message: string, context?: string, metadata?: unknown): void;
}
