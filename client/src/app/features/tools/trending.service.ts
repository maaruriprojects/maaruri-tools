import { Service, computed, inject } from '@angular/core';
import { ToolRegistryService } from './tool-registry.service';
import type { ToolMeta } from '../../shared/models/tool-meta';

const MAX_TRENDING = 6;

// Placeholder trending-tools service. Returns 6 tools from the registry
// sorted alphabetically by slug — a deterministic, stable selection that
// exercises the trending row's rendering without pretending local data is
// site-wide usage.
//
// This is a placeholder. Real trending requires a server-controlled write
// path (e.g. a daily-aggregated view or API endpoint) that this client
// cannot fabricate. Do not pretend local data is site-wide usage.
@Service()
export class TrendingService {
  private readonly toolRegistry = inject(ToolRegistryService);

  readonly trendingTools = computed<readonly ToolMeta[]>(() => {
    if (this.toolRegistry.error()) return [];
    const tools = this.toolRegistry.tools();
    if (tools.length === 0) return [];
    return [...tools]
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .slice(0, MAX_TRENDING);
  });
}
