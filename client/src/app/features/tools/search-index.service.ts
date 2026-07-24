import { Service, inject } from '@angular/core';
import { BaseApiService } from '../../core/api/base-api.service';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';

// Matches ToolRegistryService's pattern exactly (Day 6/9) — same
// BaseApiService entry point, same shape. Deliberately a separate service
// reading a separate, leaner JSON file rather than deriving this from
// ToolRegistryService.tools(): AppSearchBarComponent needs to filter this
// on every keystroke, and doing that against the full ToolMeta records
// (descriptions, SEO text, ...) once there are ~200 of them would mean
// filtering data the search bar never even displays. This index carries
// only what a suggestion row needs.
@Service()
export class SearchIndexService {
  private readonly api = inject(BaseApiService);

  private readonly resource = this.api.getResource<SearchIndexEntry[]>(() => '/search-index.json', {
    defaultValue: [],
  });

  readonly entries = this.resource.value.asReadonly();
  readonly isLoading = this.resource.isLoading;
  readonly error = this.resource.error;
}
