import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
  afterNextRender,
  DestroyRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { AppSearchBar } from '../../shared/components/search-bar/search-bar';
import { AppToolTile } from '../../shared/components/tool-tile/tool-tile';
import { AppCategoryTile } from '../../shared/components/category-tile/category-tile';
import { AppAdBanner } from '../../shared/ad-components/ad-banner/ad-banner';
import { AppEmptyState } from '../../shared/components/empty-state/empty-state';
import { AppIcon } from '../../shared/components/icon/icon';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { TOOL_CATEGORY_META } from '../tools/tool-categories';
import { TOOL_CATEGORY_SEGMENT_LIST, ToolCategorySegment } from '../../core/config/route-paths';
import { SearchIndexService } from '../tools/search-index.service';
import { ToolRegistryService } from '../tools/tool-registry.service';
import { TrendingService } from '../tools/trending.service';
import { RecentlyUsedService } from '../tools/recently-used.service';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import type { ToolMeta } from '../../shared/models/tool-meta';

// Category icon mapping — Tabler Outline icon names per category segment.
const CATEGORY_ICONS: Readonly<Record<ToolCategorySegment, string>> = {
  'time-date-tools': 'clock',
  'health-fitness': 'heart-rate-monitor',
  'finance-money-tools': 'coin',
  'work-productivity': 'briefcase',
  'converters-calculators': 'calculator',
  'everyday-practical-tools': 'backpack',
  'creative-design-tools': 'palette',
  'development-web-tools': 'code',
  'travel-transportation': 'plane',
  'document-language-tools': 'file-text',
  'personal-social-tools': 'users',
};

const PLACEHOLDER_ROTATION_MS = 3000;
const MOBILE_PLACEHOLDER = 'Search tools...';

interface CategoryDisplay {
  readonly segment: ToolCategorySegment;
  readonly title: string;
  readonly icon: string;
  readonly toolCount: number;
}

// Full homepage per docs/design/05-dashboard-home-design.md and
// docs/design/07-responsive-strategy.md §3 (mobile). Replaces the minimal
// title + flat card grid with: enlarged hero search with rotating placeholder,
// category chip strip, metadata line, trending row, recently-used row (when
// history exists), category tile grid, and one ad unit.
@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    AppSearchBar,
    AppToolTile,
    AppCategoryTile,
    AppAdBanner,
    AppEmptyState,
    AppIcon,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly title = input('');
  readonly metaDescription = input('');

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly toolRegistry = inject(ToolRegistryService);
  protected readonly searchIndexService = inject(SearchIndexService);
  protected readonly trendingService = inject(TrendingService);
  protected readonly recentlyUsedService = inject(RecentlyUsedService);

  protected readonly locale = DEFAULT_LOCALE.code;

  protected readonly placeholderIndex = signal(0);
  protected readonly isMobile = signal(false);

  // Rotating placeholder tool names — sourced from the search index entries
  // so they reflect real tools. On mobile, a static placeholder is used
  // instead (doc 07 §2).
  protected readonly placeholderText = computed(() => {
    if (this.isMobile()) return MOBILE_PLACEHOLDER;
    const entries = this.searchIndexService.entries();
    if (entries.length === 0) return MOBILE_PLACEHOLDER;
    const entry = entries[this.placeholderIndex() % entries.length];
    return `Try: ${entry.title}…`;
  });

  // Category display data — alphabetical, with tool counts from the registry.
  protected readonly registryTools = computed(() =>
    this.toolRegistry.error() ? [] : this.toolRegistry.tools(),
  );

  protected readonly categories = computed<CategoryDisplay[]>(() => {
    const tools = this.registryTools();
    const counts = new Map<string, number>();
    for (const tool of tools) {
      counts.set(tool.category, (counts.get(tool.category) ?? 0) + 1);
    }
    return TOOL_CATEGORY_SEGMENT_LIST.map((segment) => {
      const meta = TOOL_CATEGORY_META[segment];
      return {
        segment,
        title: meta.breadcrumbLabel,
        icon: CATEGORY_ICONS[segment],
        toolCount: counts.get(segment) ?? 0,
      };
    }).sort((a, b) => a.title.localeCompare(b.title));
  });

  // Mobile chip subset — first 4 chips plus "View all categories" link.
  protected readonly mobileChips = computed(() => this.categories().slice(0, 4));

  // Trending tools — compact layout tool tiles.
  protected readonly trendingTools = this.trendingService.trendingTools;

  // Recently used tools — filtered against the registry, compact layout.
  protected readonly recentTools = computed(() => {
    const tools = this.registryTools();
    const slugToTool = new Map(tools.map((t) => [t.slug, t]));
    return this.recentlyUsedService
      .recentTools()
      .map((r) => slugToTool.get(r.slug))
      .filter((t): t is ToolMeta => t !== undefined);
  });

  protected readonly totalTools = computed(() => this.registryTools().length);
  protected readonly registryErrorMessage = "Couldn't load tools";

  protected toolLink(tool: ToolMeta): string[] {
    return ['/', this.locale, tool.category, tool.slug];
  }

  protected onToolSelected(entry: SearchIndexEntry): void {
    this.recentlyUsedService.add(entry.slug, entry.category);
    this.router.navigate(['/', this.locale, entry.category, entry.slug]);
  }

  protected recordRecent(tool: ToolMeta): void {
    this.recentlyUsedService.add(tool.slug, tool.category);
  }

  protected clearRecent(): void {
    this.recentlyUsedService.clear();
  }

  protected retryRegistry(): void {
    this.toolRegistry.reload();
  }

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (typeof window.matchMedia !== 'function') return;
      this.checkMobile();
      this.setupRotation();
    });
  }

  private checkMobile(): void {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
    mq.addEventListener('change', (e) => this.isMobile.set(e.matches));
  }

  private setupRotation(): void {
    interval(PLACEHOLDER_ROTATION_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.placeholderIndex.update((i) => i + 1));
  }
}
