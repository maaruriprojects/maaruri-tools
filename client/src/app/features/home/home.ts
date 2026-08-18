import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AppCard, CardLink } from '../../shared/components/card/card';
import { AppSearchBar } from '../../shared/components/search-bar/search-bar';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { SearchIndexService } from '../tools/search-index.service';
import { ToolRegistryService } from '../tools/tool-registry.service';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import type { ToolMeta } from '../../shared/models/tool-meta';

// First real render of the home page (Day 18) — applies the Day 7 tokens,
// AppCard (Day 14), and AppSearchBar (Day 15) to the ToolRegistryService
// data this page previously rendered as a bare `<ul>`. Per
// docs/design/05-dashboard-home-design.md §5, the homepage reuses Template
// B's (Browse/Category Grid) DNA; the hero-stack extras that template
// describes (category chips, Trending/Recently Used rows, ad placement) all
// depend on pieces that don't exist yet (doc03's category-color-ring data,
// local usage history, the ad system) and are out of scope here. No header/
// footer/nav either — app.html doesn't have them yet, so this component is
// the content zone only.
@Component({
  selector: 'app-home',
  imports: [AppCard, AppSearchBar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly title = input('');
  readonly metaDescription = input('');

  private readonly router = inject(Router);
  protected readonly toolRegistry = inject(ToolRegistryService);
  protected readonly searchIndexService = inject(SearchIndexService);

  protected toolLink(tool: ToolMeta): CardLink {
    return ['/', DEFAULT_LOCALE.code, tool.category, tool.slug];
  }

  // AppSearchBar has no idea what a route is (see search-bar.ts) — this is
  // the "whoever places this bar navigates" consumer the component's own
  // comment describes.
  protected onToolSelected(entry: SearchIndexEntry): void {
    this.router.navigate(['/', DEFAULT_LOCALE.code, entry.category, entry.slug]);
  }
}
