// console.* is allowed in this file only — see the eslint.config.js override.
import { Service, inject } from '@angular/core';
import type { AppEnvironment } from '../config/app-config';
import { ConfigService } from '../config/config.service';
import type { Logger, LogLevel } from './logger';

const LOG_LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error'];

// Minimum level that actually gets written, per environment — read from
// ConfigService, not hardcoded per call site. Verbose (debug and up) in
// development; warn-and-above only in production. Staging sits between the
// two: quieter than development, but more informative than production's
// warn-only bar, matching its role as an internal QA environment.
const MIN_LOG_LEVEL_BY_ENVIRONMENT: Record<AppEnvironment, LogLevel> = {
  development: 'debug',
  staging: 'info',
  production: 'warn',
};

// Every log call in the app goes through here — never `console.*` directly
// (enforced by the `no-console` ESLint rule outside this file). All output
// currently goes to the console via `write()` below; to add a remote sink
// (Sentry, an internal logs API, etc.) later, that's the only place that
// needs to change — call the remote provider there too, alongside or
// instead of the console call, and every debug/info/warn/error call site in
// the app stays exactly as-is.
@Service()
export class LoggingService implements Logger {
  private readonly configService = inject(ConfigService);
  private readonly minLevel = MIN_LOG_LEVEL_BY_ENVIRONMENT[this.configService.config.environment];

  debug(message: string, context?: string, metadata?: unknown): void {
    this.write('debug', message, context, metadata);
  }

  info(message: string, context?: string, metadata?: unknown): void {
    this.write('info', message, context, metadata);
  }

  warn(message: string, context?: string, metadata?: unknown): void {
    this.write('warn', message, context, metadata);
  }

  error(message: string, context?: string, metadata?: unknown): void {
    this.write('error', message, context, metadata);
  }

  private write(level: LogLevel, message: string, context?: string, metadata?: unknown): void {
    if (!this.isEnabled(level)) {
      return;
    }

    const formatted = context ? `${context} ${message}` : message;

    if (metadata === undefined) {
      console[level](formatted);
    } else {
      console[level](formatted, metadata);
    }
  }

  private isEnabled(level: LogLevel): boolean {
    return LOG_LEVELS.indexOf(level) >= LOG_LEVELS.indexOf(this.minLevel);
  }
}
