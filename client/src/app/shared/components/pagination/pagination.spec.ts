import { TestBed } from '@angular/core/testing';
import { AppPagination } from './pagination';

describe('AppPagination', () => {
  async function createFixture(totalItems: number, pageSize = 10, currentPage = 1) {
    await TestBed.configureTestingModule({ imports: [AppPagination] }).compileComponents();
    const fixture = TestBed.createComponent(AppPagination);
    fixture.componentRef.setInput('totalItems', totalItems);
    fixture.componentRef.setInput('pageSize', pageSize);
    fixture.componentRef.setInput('currentPage', currentPage);
    fixture.detectChanges();
    return fixture;
  }

  function pageButtons(fixture: { nativeElement: HTMLElement }): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.app-pagination__page'));
  }

  function pageLabels(fixture: { nativeElement: HTMLElement }): string[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.app-pagination > *')).map(
      (el) => el.textContent?.trim() ?? '',
    );
  }

  it('renders every page with no ellipsis when the total page count is small', async () => {
    const fixture = await createFixture(45, 10); // 5 pages
    const buttons = pageButtons(fixture);

    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['1', '2', '3', '4', '5']);
    expect(fixture.nativeElement.querySelector('.app-pagination__ellipsis')).toBeNull();
  });

  it('marks the current page with aria-current and the highlighted class', async () => {
    const fixture = await createFixture(45, 10, 3);
    const current = fixture.nativeElement.querySelector(
      '.app-pagination__page--current',
    ) as HTMLButtonElement;

    expect(current.textContent?.trim()).toBe('3');
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('truncates with ellipses for a large page count, per "1 ... 4 5 [6] 7 8 ... 20"', async () => {
    const fixture = await createFixture(200, 10, 6); // 20 pages, current 6
    const labels = pageLabels(fixture);

    // Prev, 1, …, 4, 5, 6, 7, 8, …, 20, Next
    expect(labels).toEqual(['Prev', '1', '…', '4', '5', '6', '7', '8', '…', '20', 'Next']);
  });

  it('shows only a trailing ellipsis when the current page is near the start', async () => {
    const fixture = await createFixture(200, 10, 1); // 20 pages, current 1
    const labels = pageLabels(fixture);

    expect(labels).toEqual(['Prev', '1', '2', '3', '…', '20', 'Next']);
  });

  it('shows only a leading ellipsis when the current page is near the end', async () => {
    const fixture = await createFixture(200, 10, 20); // 20 pages, current 20 (last)
    const labels = pageLabels(fixture);

    expect(labels).toEqual(['Prev', '1', '…', '18', '19', '20', 'Next']);
  });

  it('emits pageChange with the clicked page number', async () => {
    const fixture = await createFixture(45, 10, 1);
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page: number) => emitted.push(page));

    const buttons = pageButtons(fixture);
    const pageThree = buttons.find((b) => b.textContent?.trim() === '3') as HTMLButtonElement;
    pageThree.click();

    expect(emitted).toEqual([3]);
  });

  it('does not emit when clicking the already-current page', async () => {
    const fixture = await createFixture(45, 10, 2);
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page: number) => emitted.push(page));

    const buttons = pageButtons(fixture);
    const current = buttons.find((b) => b.textContent?.trim() === '2') as HTMLButtonElement;
    current.click();

    expect(emitted).toEqual([]);
  });

  it('Previous/Next emit currentPage -/+ 1, and are disabled at the boundaries', async () => {
    const fixture = await createFixture(45, 10, 1); // 5 pages
    const emitted: number[] = [];
    fixture.componentInstance.pageChange.subscribe((page: number) => emitted.push(page));

    const prev = fixture.nativeElement.querySelector(
      '[aria-label="Previous page"]',
    ) as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector(
      '[aria-label="Next page"]',
    ) as HTMLButtonElement;

    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(false);

    next.click();
    expect(emitted).toEqual([2]);
  });

  it('disables Next on the last page', async () => {
    const fixture = await createFixture(45, 10, 5); // 5 pages, last one
    const next = fixture.nativeElement.querySelector(
      '[aria-label="Next page"]',
    ) as HTMLButtonElement;

    expect(next.disabled).toBe(true);
  });

  it('clamps an out-of-range currentPage into a valid page rather than rendering nothing', async () => {
    const fixture = await createFixture(45, 10, 99); // only 5 pages exist
    const current = fixture.nativeElement.querySelector('.app-pagination__page--current');

    expect(current?.textContent?.trim()).toBe('5');
  });

  it('renders a single page and disables both nav buttons when totalItems is 0', async () => {
    const fixture = await createFixture(0, 10, 1);
    const buttons = pageButtons(fixture);
    const prev = fixture.nativeElement.querySelector(
      '[aria-label="Previous page"]',
    ) as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector(
      '[aria-label="Next page"]',
    ) as HTMLButtonElement;

    expect(buttons.map((b) => b.textContent?.trim())).toEqual(['1']);
    expect(prev.disabled).toBe(true);
    expect(next.disabled).toBe(true);
  });

  it('page buttons are real <button> elements — native tab focus and Enter/Space activation, no custom keydown handling needed', async () => {
    const fixture = await createFixture(45, 10, 1);
    const buttons = pageButtons(fixture);

    for (const button of buttons) {
      expect(button.tagName).toBe('BUTTON');
      expect(button.getAttribute('type')).toBe('button');
      expect(button.tabIndex).toBe(0);
    }
  });
});
