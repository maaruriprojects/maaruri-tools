import { InjectionToken, Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { AppConfig } from './app-config';

/**
 * Active AppConfig, defaulting to the build-time `environment` (swapped per
 * target via the fileReplacements in angular.json). This is the only place
 * that imports an `environments/*` file directly — everywhere else injects
 * {@link ConfigService}. Overridden in tests to exercise other environments.
 */
export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG', {
  providedIn: 'root',
  factory: () => environment,
});

@Service()
export class ConfigService {
  readonly config: AppConfig = inject(APP_CONFIG);
}
