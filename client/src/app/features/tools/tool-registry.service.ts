import { Service, inject } from '@angular/core';
import { BaseApiService } from '../../core/api/base-api.service';
import type { ToolMeta } from '../../shared/models/tool-meta';

// Not to be confused with ./tool-registry.ts, a build-time-only placeholder
// listing sample slugs for SSR prerender params (see app.routes.server.ts).
// This service is the actual runtime-loaded tool metadata.
//
// What changes when the real API exists: only `apiBaseUrl` in the active
// src/environments/environment.*.ts file, from '/assets/data' to the API
// origin. This service, and every consumer of it, stays exactly as-is — it
// goes through BaseApiService (see SERVICE_GUIDELINES.md) rather than
// building its own URL or calling httpResource()/HttpClient directly, so
// nothing here references "JSON" or "API".
@Service()
export class ToolRegistryService {
  private readonly api = inject(BaseApiService);

  private readonly resource = this.api.getResource<ToolMeta[]>(() => '/tool-registry.json', {
    defaultValue: [],
  });

  readonly tools = this.resource.value.asReadonly();
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;
}
