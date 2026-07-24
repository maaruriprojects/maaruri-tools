import { Service, inject } from '@angular/core';
import { httpResource, type HttpResourceOptions, type HttpResourceRef } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import type { ApiService } from './api.service';

// The thin wrapper every service that talks to the tool registry (or any
// future HTTP-backed resource) goes through — see SERVICE_GUIDELINES.md and
// the ApiService contract this implements. Nothing beyond URL-building and
// the httpResource() call itself lives here today; response
// transformation, retry policy, etc. stay in each consumer until more than
// one consumer actually needs the same behavior.
@Service()
export class BaseApiService implements ApiService {
  private readonly configService = inject(ConfigService);

  resourceUrl(path: string): string {
    return `${this.configService.config.apiBaseUrl}${path}`;
  }

  getResource<T>(
    pathFn: () => string | undefined,
    options: HttpResourceOptions<T, unknown> & { defaultValue: NoInfer<T> },
  ): HttpResourceRef<T>;
  getResource<T>(
    pathFn: () => string | undefined,
    options?: HttpResourceOptions<T, unknown>,
  ): HttpResourceRef<T | undefined>;
  getResource<T>(
    pathFn: () => string | undefined,
    options?: HttpResourceOptions<T, unknown>,
  ): HttpResourceRef<T | undefined> {
    return httpResource<T>(() => {
      const path = pathFn();
      return path === undefined ? undefined : this.resourceUrl(path);
    }, options);
  }
}
