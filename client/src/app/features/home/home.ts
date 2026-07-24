import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TOOL_CATEGORY_SEGMENT_LIST } from '../../core/config/route-paths';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { AppCard, CardLink } from '../../shared/components/card/card';
import { AppLoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { AppSearchBar } from '../../shared/components/search-bar/search-bar';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import type { ToolMeta } from '../../shared/models/tool-meta';
import { SearchIndexService } from '../tools/search-index.service';
import { ToolRegistryService } from '../tools/tool-registry.service';

// The real homepage (Day 18) — replaces the Day 6 placeholder (a bare
// heading and a bullet list). Applies
// docs/design/05-dashboard-home-design.md's hero-search-over-tool-grid
// pattern at the scope actually buildable from what exists so far: the
// real search index (Day 15) over the real tool grid (Day 14 cards, Day 6
// registry data), inside Template B's content zone (legend + fluid grid,
// doc04 §2/§3) — no header/footer/control-strip, per this task's
// constraints; those are a later phase.
//
// Deliberately NOT built here, since the components/data don't exist yet:
// the category chip strip, the Trending/Recently Used tool-tile rows (site
// usage tracking and local history aren't implemented), the separate
// category-tile grid (a distinct component from AppCard, per doc05 §2),
// and the ad slot (doc05 §4). This page renders every tool as one grid
// instead of a category-tile browse grid — the closest honest match to
// "apply everything already built" without inventing new components today.
@Component({
  selector: 'app-home',
  imports: [AppSearchBar, AppCard, AppLoadingSpinner],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly title = input('');
  readonly metaDescription = input('');

  protected readonly toolRegistry = inject(ToolRegistryService);
  protected readonly searchIndexService = inject(SearchIndexService);
  private readonly router = inject(Router);

  protected readonly categoryCount = TOOL_CATEGORY_SEGMENT_LIST.length;

  protected toolLink(tool: ToolMeta): CardLink {
    return ['/', DEFAULT_LOCALE.code, tool.category, tool.slug];
  }

  protected onToolSelected(entry: SearchIndexEntry): void {
    this.router.navigate(['/', DEFAULT_LOCALE.code, entry.category, entry.slug]);
  }
}
