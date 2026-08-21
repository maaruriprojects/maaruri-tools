import {
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { ThemeService } from '../../core/theme/theme.service';
import { SearchIndexService } from '../../features/tools/search-index.service';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import {
  TOOL_CATEGORY_SEGMENT_LIST,
  ToolCategorySegment,
} from '../../core/config/route-paths';
import { TOOL_CATEGORY_META } from '../../features/tools/tool-categories';
import { AppSearchBar } from '../../shared/components/search-bar/search-bar';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AppSearchBar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class AppHeader {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);
  private readonly searchIndexService = inject(SearchIndexService);

  readonly locale = DEFAULT_LOCALE.code;
  readonly categories = TOOL_CATEGORY_SEGMENT_LIST;
  readonly categoryMeta = TOOL_CATEGORY_META;
  readonly entries = this.searchIndexService.entries;

  readonly mobileMenuOpen = signal(false);
  readonly mobileSearchOpen = signal(false);

  toggleTheme(): void {
    this.themeService.toggle();
  }

  isDark(): boolean {
    return this.themeService.theme() === 'dark';
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
    if (this.mobileMenuOpen()) {
      this.mobileSearchOpen.set(false);
    }
  }

  toggleMobileSearch(): void {
    this.mobileSearchOpen.update((v) => !v);
    if (this.mobileSearchOpen()) {
      this.mobileMenuOpen.set(false);
    }
  }

  onSearchSelected(entry: SearchIndexEntry): void {
    this.mobileSearchOpen.set(false);
    void this.router.navigate(['/', this.locale, entry.category, entry.slug]);
  }

  categoryRoute(segment: ToolCategorySegment): (string | number)[] {
    return ['/', this.locale, segment];
  }

  constructor() {
    afterNextRender(() => {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          if (event.key === 'Escape') {
            this.mobileMenuOpen.set(false);
            this.mobileSearchOpen.set(false);
          }
        });
    });
  }
}
