import { Service, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ConfigService } from '../../core/config/config.service';
import type { ToolMeta } from '../../shared/models/tool-meta';

// Not to be confused with ./tool-registry.ts, a build-time-only placeholder
// listing sample slugs for SSR prerender params (see app.routes.server.ts).
// This service is the actual runtime-loaded tool metadata.
//
// What changes when the real API exists: only `apiBaseUrl` in the active
// src/environments/environment.*.ts file, from '/assets/data' to the API
// origin. This service, and every consumer of it, stays exactly as-is —
// nothing here references "JSON" or "API"; it just asks ConfigService for
// the base URL and appends the resource path.
@Service()
export class ToolRegistryService {
  private readonly configService = inject(ConfigService);

  private readonly resource = httpResource<ToolMeta[]>(
    () => `${this.configService.config.apiBaseUrl}/tool-registry.json`,
    { defaultValue: [] },
  );

  readonly tools = this.resource.value.asReadonly();
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;
}
