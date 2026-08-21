import { Service, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToolCategorySegment } from '../../core/config/route-paths';

export interface RecentTool {
  readonly slug: string;
  readonly category: ToolCategorySegment;
  readonly timestamp: number;
}

const STORAGE_KEY = 'maaruri-recent-tools';
const MAX_ENTRIES = 6;

// localStorage-backed personal tool history. Stores up to 6 tool slugs +
// timestamps, most-recent-first. All storage access is guarded with
// isPlatformBrowser so SSR never touches localStorage. Stale slugs are
// filtered by the homepage after the registry has loaded.
@Service()
export class RecentlyUsedService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _recentTools = signal<readonly RecentTool[]>([]);
  readonly recentTools = this._recentTools.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();
    }
  }

  add(slug: string, category: ToolCategorySegment): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const entry: RecentTool = { slug, category, timestamp: Date.now() };
    const current = this._recentTools().filter((tool) => tool.slug !== slug);
    const updated = [entry, ...current].slice(0, MAX_ENTRIES);
    this._recentTools.set(updated);
    this.saveToStorage(updated);
  }

  clear(): void {
    this._recentTools.set([]);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Storage unavailable — in-memory state already cleared
      }
    }
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentTool[];
        if (Array.isArray(parsed)) {
          this._recentTools.set(parsed.slice(0, MAX_ENTRIES));
        }
      }
    } catch {
      // Corrupted or unavailable — start empty
    }
  }

  private saveToStorage(tools: readonly RecentTool[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
    } catch {
      // Storage unavailable — in-memory state is the source of truth
    }
  }
}
