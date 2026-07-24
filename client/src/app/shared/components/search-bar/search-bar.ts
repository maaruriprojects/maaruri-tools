import { Component, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, fromEvent } from 'rxjs';
import { AppBadge } from '../badge/badge';
import type { SearchIndexEntry } from '../../models/search-index-entry';

const DEBOUNCE_MS = 150;
const MAX_SUGGESTIONS = 8; // keeps the dropdown scannable once ~200 tools exist

let nextInstanceId = 0;

// Reference shared component — see COMPONENT_GUIDELINES.md. Pure
// @Input-driven: it never injects SearchIndexService itself (a shared
// component never injects app-specific services) — whoever places this
// bar (a future header, or /dev/ui-kit's demo today) injects
// SearchIndexService and passes `entries` down, then reacts to `toolSelected`
// however it needs to (e.g. navigate) — this component has no idea what a
// "route" is. No HTTP here at all; filtering is pure in-memory work
// against whatever `entries` currently holds.
//
// Visual/interaction spec: docs/design/06-component-visual-design.md §3
// (search bar, suggestions dropdown — the one place in this system a
// shadow appears at rest, and a second sanctioned use of --color-accent
// for the keyboard-highlighted row). The dropdown shows title + category
// badge per row, not a per-tool icon — the lean search index (deliberately
// slug/title/category only, see SearchIndexEntry) has no icon field to
// show.
@Component({
  selector: 'app-search-bar',
  imports: [AppBadge],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class AppSearchBar {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly instanceId = nextInstanceId++;

  readonly entries = input<readonly SearchIndexEntry[]>([]);
  readonly placeholder = input('Search tools...');
  readonly toolSelected = output<SearchIndexEntry>();

  protected readonly listboxId = `app-search-bar-listbox-${this.instanceId}`;

  // Raw query updates instantly (the input field itself must never feel
  // laggy); the dropdown opens off this too, per "show suggestions as soon
  // as the first character is typed." Only the filtering below is
  // debounced.
  protected readonly query = signal('');
  protected readonly isOpen = computed(() => this.query().trim().length > 0);

  protected readonly debouncedQuery = toSignal(
    toObservable(this.query).pipe(debounceTime(DEBOUNCE_MS)),
    { initialValue: '' },
  );

  protected readonly highlightedIndex = signal(-1);

  // A computed() is Angular's memoization primitive: this only re-runs
  // when debouncedQuery or entries actually change, and caches the result
  // otherwise — exactly "memoize the filtered result" against up to ~200
  // entries without re-filtering on every render.
  //
  // Matching: primarily match-from-start-of-string on the title, per spec.
  // Deliberate addition beyond that spec: falls back to a "contains" match
  // when start-of-string finds nothing, since a user who mistypes the very
  // first letter shouldn't see zero results for an otherwise-findable tool.
  protected readonly results = computed(() => {
    const q = this.debouncedQuery().trim().toLowerCase();
    if (!q) {
      return [];
    }

    const startsWith = this.entries().filter((entry) => entry.title.toLowerCase().startsWith(q));
    const matches =
      startsWith.length > 0
        ? startsWith
        : this.entries().filter((entry) => entry.title.toLowerCase().includes(q));

    return matches.slice(0, MAX_SUGGESTIONS);
  });

  constructor() {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        if (!this.elementRef.nativeElement.contains(event.target as Node)) {
          this.close();
        }
      });
  }

  protected optionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  protected onInput(value: string): void {
    this.query.set(value);
    this.highlightedIndex.set(-1);
  }

  protected onArrowDown(event: Event): void {
    const count = this.results().length;
    if (count === 0) {
      return;
    }
    event.preventDefault();
    this.highlightedIndex.update((index) => (index + 1) % count);
  }

  protected onArrowUp(event: Event): void {
    const count = this.results().length;
    if (count === 0) {
      return;
    }
    event.preventDefault();
    this.highlightedIndex.update((index) => (index - 1 + count) % count);
  }

  protected onEnter(event: Event): void {
    const highlighted = this.results()[this.highlightedIndex()];
    if (highlighted) {
      event.preventDefault();
      this.selectEntry(highlighted);
    }
  }

  protected onEscape(): void {
    this.close();
  }

  protected setHighlighted(index: number): void {
    this.highlightedIndex.set(index);
  }

  protected selectEntry(entry: SearchIndexEntry): void {
    this.toolSelected.emit(entry);
    this.close();
  }

  private close(): void {
    this.query.set('');
    this.highlightedIndex.set(-1);
  }
}
