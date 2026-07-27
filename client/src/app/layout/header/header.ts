import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SITE_NAME } from '../../core/config/site';
import { TOOL_CATEGORY_SEGMENT_LIST, ToolCategorySegment } from '../../core/config/route-paths';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { ThemeService } from '../../core/theme/theme.service';
import { AppSearchBar } from '../../shared/components/search-bar/search-bar';
import { SearchIndexService } from '../../features/tools/search-index.service';
import { TOOL_CATEGORY_META } from '../../features/tools/tool-categories';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';

interface CategoryNavItem {
  readonly segment: ToolCategorySegment;
  readonly title: string;
}

// The control strip (doc01/doc04): logo, category menu, jump-search, theme
// toggle. Lives in layout/, not shared/components/, so — per
// ARCHITECTURE.md — it's allowed to inject core/feature services directly,
// unlike a shared component (see COMPONENT_GUIDELINES.md's "never inject
// app-specific services" rule, which applies to shared/ only).
//
// Replaces the temporary theme-toggle button that used to live directly in
// app.html (see app.ts/app.html) — same ThemeService, same behavior, now
// part of real site chrome instead of a Day-8 test fixture.
@Component({
  selector: 'app-header',
  imports: [RouterLink, AppSearchBar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class AppHeader {
  protected readonly themeService = inject(ThemeService);
  protected readonly searchIndexService = inject(SearchIndexService);
  private readonly router = inject(Router);

  protected readonly siteName = SITE_NAME;
  protected readonly homeLink = ['/', DEFAULT_LOCALE.code];

  // Static data — set once, never reassigned (see CODING_STANDARDS.md's
  // "signal vs. plain property"), so a plain readonly array, not a signal.
  protected readonly categories: readonly CategoryNavItem[] = TOOL_CATEGORY_SEGMENT_LIST.map(
    (segment) => ({ segment, title: TOOL_CATEGORY_META[segment].title }),
  );

  protected categoryLink(segment: ToolCategorySegment): readonly (string | number)[] {
    return ['/', DEFAULT_LOCALE.code, segment];
  }

  protected onToolSelected(entry: SearchIndexEntry): void {
    this.router.navigate(['/', DEFAULT_LOCALE.code, entry.category, entry.slug]);
  }
}
