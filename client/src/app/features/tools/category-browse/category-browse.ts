import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
  input,
  signal,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppToolTile } from '../../../shared/components/tool-tile/tool-tile';
import { AppEmptyState } from '../../../shared/components/empty-state/empty-state';
import { AppAdInArticle } from '../../../shared/ad-components/ad-in-article/ad-in-article';
import { AppSelectControl, SelectOption } from '../../../shared/components/select-control/select-control';
import { AppModal } from '../../../shared/components/modal/modal';
import { DEFAULT_LOCALE } from '../../../core/i18n/locale';
import { ToolRegistryService } from '../tool-registry.service';
import type { ToolMeta } from '../../../shared/models/tool-meta';

type SortMode = 'az' | 'za';

const SORT_OPTIONS: readonly SelectOption[] = [
  { value: 'az', label: 'Name (A–Z)' },
  { value: 'za', label: 'Name (Z–A)' },
];

// Category browse page per docs/design/04-page-layout-system.md (Template B)
// and docs/design/07-responsive-strategy.md §3/§4. Renders a category legend,
// a tool grid with embedded ad placeholders at a breakpoint-dependent
// interval, sort control (inline dropdown on desktop, bottom-sheet modal on
// mobile), and empty/loading/error states.
@Component({
  selector: 'app-category-browse',
  imports: [RouterLink, AppToolTile, AppEmptyState, AppAdInArticle, AppSelectControl, AppModal],
  templateUrl: './category-browse.html',
  styleUrl: './category-browse.scss',
})
export class CategoryBrowse {
  readonly title = input('');
  readonly metaDescription = input('');
  readonly breadcrumbLabel = input('');
  readonly categorySegment = input.required<string>();

  private readonly platformId = inject(PLATFORM_ID);
  readonly toolRegistry = inject(ToolRegistryService);

  protected readonly locale = DEFAULT_LOCALE.code;
  protected readonly sortMode = signal<SortMode>('az');
  protected readonly sortModalOpen = signal(false);
  protected readonly isMobile = signal(false);

  protected readonly errorMessage = "Couldn't load tools";

  protected readonly sortOptions = SORT_OPTIONS;

  protected readonly registryTools = computed<readonly ToolMeta[]>(() =>
    this.toolRegistry.error() ? [] : this.toolRegistry.tools(),
  );

  protected readonly categoryTools = computed<readonly ToolMeta[]>(() => {
    const segment = this.categorySegment();
    return this.registryTools().filter((tool) => tool.category === segment);
  });

  protected readonly sortedTools = computed<readonly ToolMeta[]>(() => {
    const tools = [...this.categoryTools()];
    const dir = this.sortMode() === 'az' ? 1 : -1;
    return tools.sort((a, b) => dir * a.title.localeCompare(b.title));
  });

  protected readonly toolCount = computed(() => this.categoryTools().length);

  // Ad interval: 12 on desktop/tablet, 18 on mobile (doc 07 §3).
  protected readonly adInterval = computed(() => (this.isMobile() ? 18 : 12));

  protected toolLink(tool: ToolMeta): string[] {
    return ['/', this.locale, tool.category, tool.slug];
  }

  onSortChange(value: string): void {
    this.sortMode.set(value as SortMode);
  }

  protected openSortModal(): void {
    this.sortModalOpen.set(true);
  }

  protected closeSortModal(): void {
    this.sortModalOpen.set(false);
  }

  protected retryRegistry(): void {
    this.toolRegistry.reload();
  }

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      if (typeof window.matchMedia !== 'function') return;
      this.checkMobile();
    });
  }

  private checkMobile(): void {
    const mq = window.matchMedia('(max-width: 767px)');
    this.isMobile.set(mq.matches);
    mq.addEventListener('change', (e) => this.isMobile.set(e.matches));
  }
}
