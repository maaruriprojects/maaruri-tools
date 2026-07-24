import { ApplicationRef } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { httpErrorInterceptor } from '../../core/error-handling/http-error.interceptor';
import { LoadingService } from '../../core/loading/loading.service';
import { ToastService } from '../../core/toast/toast.service';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import { UiKit } from './ui-kit';

describe('UiKit', () => {
  const sampleSearchEntries: SearchIndexEntry[] = [
    { slug: 'digital-clock', title: 'Digital Clock', category: 'time-date-tools' },
  ];

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiKit],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Creating a UiKit instance now also constructs SearchIndexService (a
  // field on UiKit, injected for the AppSearchBar demo below), which fires
  // its own httpResource request immediately — every test that creates a
  // fixture must flush it, or the afterEach's httpMock.verify() fails on an
  // outstanding request.
  function createUiKit(): ComponentFixture<UiKit> {
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleSearchEntries);
    fixture.detectChanges();
    return fixture;
  }

  it('renders every button variant and badge color', () => {
    const fixture = createUiKit();

    const el = fixture.nativeElement as HTMLElement;
    // 3 variants + 1 disabled + throw-error + slow + fast + 4 severities + 1 failed-request
    expect(el.querySelectorAll('app-button')).toHaveLength(12);
    // 5 severities + 1 "New" badge inside the standalone card's projected content
    expect(el.querySelectorAll('app-badge')).toHaveLength(6);
    expect(el.querySelectorAll('app-loading-spinner')).toHaveLength(2); // sm + lg preview
    expect(el.querySelector('.app-button--primary[disabled]')).toBeTruthy();
  });

  it('renders a 3-card grid and a standalone card with projected content', () => {
    const fixture = createUiKit();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.card-grid app-card')).toHaveLength(3);
    expect(el.querySelectorAll('.card-grid app-card img[loading="lazy"]')).toHaveLength(3);
    expect(el.querySelectorAll('.card-standalone app-card')).toHaveLength(1);
    expect(el.querySelector('.card-standalone app-badge')).toBeTruthy();
  });

  it('renders the "Throw test error" trigger', () => {
    const fixture = createUiKit();

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button.app-button'),
    );
    const throwButton = buttons.find((button) => button.textContent?.includes('Throw test error'));

    expect(throwButton).toBeTruthy();
  });

  it('throwTestError() throws, so GlobalErrorHandler can catch it (see global-error-handler.spec.ts)', () => {
    const fixture = createUiKit();

    // DOM event-listener exceptions don't propagate synchronously to the
    // caller of .click() (the browser reports them globally instead — the
    // exact mechanism provideBrowserGlobalErrorListeners()/ErrorHandler
    // exist to catch), so this calls the handler directly.
    const component = fixture.componentInstance as unknown as { throwTestError(): void };
    expect(() => component.throwTestError()).toThrow(/Deliberate test error/);
  });

  it('simulateSlowRequest() increments then decrements LoadingService after 2s', () => {
    vi.useFakeTimers();
    try {
      const fixture = createUiKit();
      const loadingService = TestBed.inject(LoadingService);

      const component = fixture.componentInstance as unknown as { simulateSlowRequest(): void };
      component.simulateSlowRequest();
      expect(loadingService.isLoading()).toBe(true);

      vi.advanceTimersByTime(2000);
      expect(loadingService.isLoading()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('simulateFastRequest() increments then decrements LoadingService after 50ms', () => {
    vi.useFakeTimers();
    try {
      const fixture = createUiKit();
      const loadingService = TestBed.inject(LoadingService);

      const component = fixture.componentInstance as unknown as { simulateFastRequest(): void };
      component.simulateFastRequest();
      expect(loadingService.isLoading()).toBe(true);

      vi.advanceTimersByTime(50);
      expect(loadingService.isLoading()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('each toast trigger adds a toast of the matching severity', () => {
    const fixture = createUiKit();
    const toastService = TestBed.inject(ToastService);

    const component = fixture.componentInstance as unknown as {
      showSuccessToast(): void;
      showErrorToast(): void;
      showWarningToast(): void;
      showInfoToast(): void;
    };
    component.showSuccessToast();
    component.showErrorToast();
    component.showWarningToast();
    component.showInfoToast();

    expect(toastService.toasts().map((toast) => toast.severity)).toEqual([
      'success',
      'error',
      'warning',
      'info',
    ]);
  });

  it('triggerFailedRequest() makes a real request through the interceptor chain and produces a toast', async () => {
    const fixture = createUiKit();
    const toastService = TestBed.inject(ToastService);

    const component = fixture.componentInstance as unknown as { triggerFailedRequest(): void };
    component.triggerFailedRequest();
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url.endsWith('does-not-exist.json'))
      .flush('not found', { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(toastService.toasts()).toHaveLength(1);
    expect(toastService.toasts()[0].severity).toBe('error');
  });

  it('renders the AppSearchBar demo, wired to SearchIndexService, and shows the last selection', () => {
    const fixture = createUiKit();

    const searchBarEl = fixture.nativeElement.querySelector('app-search-bar');
    expect(searchBarEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Last selected:');
    expect(fixture.nativeElement.textContent).toContain('none yet');

    const component = fixture.componentInstance as unknown as {
      onSearchSelect(entry: SearchIndexEntry): void;
    };
    component.onSearchSelect(sampleSearchEntries[0]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Digital Clock (time-date-tools)');
  });

  it('paginates the mock 45-item list 10 per page, driven entirely by AppPagination', () => {
    const fixture = createUiKit();

    const items = () => fixture.nativeElement.querySelectorAll('.mock-list li');
    expect(items()).toHaveLength(10);
    expect(items()[0].textContent).toBe('Item 1');
    expect(items()[9].textContent).toBe('Item 10');

    const nextButton = fixture.nativeElement.querySelector(
      '[aria-label="Next page"]',
    ) as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();

    expect(items()[0].textContent).toBe('Item 11');
    expect(items()[9].textContent).toBe('Item 20');

    // Last page (45 items, 10/page) only has 5 items.
    const pageButtons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '.app-pagination__page',
    );
    const lastPageButton = Array.from(pageButtons).find(
      (button) => button.textContent?.trim() === '5',
    ) as HTMLButtonElement;
    lastPageButton.click();
    fixture.detectChanges();

    expect(items()).toHaveLength(5);
    expect(items()[4].textContent).toBe('Item 45');
  });
});
