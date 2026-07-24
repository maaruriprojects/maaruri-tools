import { Component, computed, input, output } from '@angular/core';

type PaginationItem = number | 'ellipsis';

// Window of page numbers shown around the current page, and how many pages
// are always pinned at each boundary (1 ... 4 5 [6] 7 8 ... 20 — boundary 1,
// sibling 2 either side of the current page).
const SIBLING_COUNT = 2;
const BOUNDARY_COUNT = 1;

function range(start: number, end: number): number[] {
  if (end < start) {
    return [];
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// Reference shared component — see COMPONENT_GUIDELINES.md. Pure
// @Input-driven, no knowledge of tools/categories/or any specific data: it
// takes currentPage/totalItems/pageSize and emits pageChange, the same
// controlled-component shape as a native form input — the caller owns
// "which page is current" and decides what a page change means (re-slicing
// a list, refetching, updating the URL, ...).
//
// No docs/design spec exists for pagination yet (unlike AppButton/AppBadge,
// which cite doc06) — this reuses the established token/focus-ring
// language instead of inventing a new, undocumented visual treatment:
// --radius-sm and the ghost-button hover/active pattern from button.scss,
// the primary-button fill for the current page, and the global
// focus-visible ring (no custom focus styling here).
//
// Deliberate addition beyond the stated requirements: Previous/Next
// buttons flanking the page numbers, disabled at the first/last page — a
// standard pagination affordance, not called out in the spec but cheap to
// add and consistent with "fully keyboard-accessible."
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class AppPagination {
  readonly currentPage = input(1);
  readonly totalItems = input.required<number>();
  readonly pageSize = input(10);
  readonly pageChange = output<number>();

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalItems() / this.pageSize())),
  );

  // Defensive clamp: if the caller's currentPage ever falls outside the
  // valid range (e.g. totalItems shrank after a filter, or the caller
  // simply passed something out of bounds), every computation below still
  // lands on a real page instead of rendering nothing or going negative.
  protected readonly clampedCurrentPage = computed(() =>
    Math.min(Math.max(this.currentPage(), 1), this.totalPages()),
  );

  // "Not all pages rendered at once" for large counts, via start/end
  // boundary pages plus a sibling window around the current page, with
  // an ellipsis filling any gap. Small page counts are cheap enough to
  // just render in full.
  protected readonly items = computed<PaginationItem[]>(() => {
    const total = this.totalPages();
    const current = this.clampedCurrentPage();

    if (total <= SIBLING_COUNT * 2 + BOUNDARY_COUNT * 2 + 3) {
      return range(1, total);
    }

    const leftSibling = Math.max(current - SIBLING_COUNT, BOUNDARY_COUNT + 2);
    const rightSibling = Math.min(current + SIBLING_COUNT, total - BOUNDARY_COUNT - 1);

    const showLeftEllipsis = leftSibling > BOUNDARY_COUNT + 2;
    const showRightEllipsis = rightSibling < total - BOUNDARY_COUNT - 1;

    const result: PaginationItem[] = [...range(1, BOUNDARY_COUNT)];

    if (showLeftEllipsis) {
      result.push('ellipsis');
    } else {
      result.push(...range(BOUNDARY_COUNT + 1, leftSibling - 1));
    }

    result.push(...range(leftSibling, rightSibling));

    if (showRightEllipsis) {
      result.push('ellipsis');
    } else {
      result.push(...range(rightSibling + 1, total - BOUNDARY_COUNT));
    }

    result.push(...range(total - BOUNDARY_COUNT + 1, total));

    return result;
  });

  protected goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.clampedCurrentPage()) {
      return;
    }
    this.pageChange.emit(page);
  }

  protected previous(): void {
    this.goTo(this.clampedCurrentPage() - 1);
  }

  protected next(): void {
    this.goTo(this.clampedCurrentPage() + 1);
  }
}
