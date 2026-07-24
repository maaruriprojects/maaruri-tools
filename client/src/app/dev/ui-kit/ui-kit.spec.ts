import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { httpErrorInterceptor } from '../../core/error-handling/http-error.interceptor';
import { LoadingService } from '../../core/loading/loading.service';
import { ToastService } from '../../core/toast/toast.service';
import { UiKit } from './ui-kit';

describe('UiKit', () => {
  it('renders every button variant and badge color', async () => {
    await TestBed.configureTestingModule({
      imports: [UiKit],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    // 3 variants + 1 disabled + throw-error + slow + fast + 4 severities + 1 failed-request
    expect(el.querySelectorAll('app-button')).toHaveLength(12);
    // 5 severities + 1 "New" badge inside the standalone card's projected content
    expect(el.querySelectorAll('app-badge')).toHaveLength(6);
    expect(el.querySelectorAll('app-loading-spinner')).toHaveLength(2); // sm + lg preview
    expect(el.querySelector('.app-button--primary[disabled]')).toBeTruthy();
  });

  it('renders a 3-card grid and a standalone card with projected content', async () => {
    await TestBed.configureTestingModule({
      imports: [UiKit],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.card-grid app-card')).toHaveLength(3);
    expect(el.querySelectorAll('.card-grid app-card img[loading="lazy"]')).toHaveLength(3);
    expect(el.querySelectorAll('.card-standalone app-card')).toHaveLength(1);
    expect(el.querySelector('.card-standalone app-badge')).toBeTruthy();
  });

  it('renders the "Throw test error" trigger', async () => {
    await TestBed.configureTestingModule({
      imports: [UiKit],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button.app-button'),
    );
    const throwButton = buttons.find((button) => button.textContent?.includes('Throw test error'));

    expect(throwButton).toBeTruthy();
  });

  it('throwTestError() throws, so GlobalErrorHandler can catch it (see global-error-handler.spec.ts)', async () => {
    await TestBed.configureTestingModule({
      imports: [UiKit],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

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
      TestBed.configureTestingModule({ imports: [UiKit], providers: [provideRouter([])] });
      const fixture = TestBed.createComponent(UiKit);
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
      TestBed.configureTestingModule({ imports: [UiKit], providers: [provideRouter([])] });
      const fixture = TestBed.createComponent(UiKit);
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

  it('each toast trigger adds a toast of the matching severity', async () => {
    await TestBed.configureTestingModule({
      imports: [UiKit],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();
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
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    const fixture = TestBed.createComponent(UiKit);
    const toastService = TestBed.inject(ToastService);
    const httpMock = TestBed.inject(HttpTestingController);

    const component = fixture.componentInstance as unknown as { triggerFailedRequest(): void };
    component.triggerFailedRequest();
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url.endsWith('does-not-exist.json'))
      .flush('not found', { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(toastService.toasts()).toHaveLength(1);
    expect(toastService.toasts()[0].severity).toBe('error');
    httpMock.verify();
  });
});
