import { TestBed } from '@angular/core/testing';
import { LoadingService } from '../../core/loading/loading.service';
import { UiKit } from './ui-kit';

describe('UiKit', () => {
  it('renders every button variant and badge color', async () => {
    await TestBed.configureTestingModule({ imports: [UiKit] }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    // 3 variants + 1 disabled + throw-error + slow + fast
    expect(el.querySelectorAll('app-button')).toHaveLength(7);
    expect(el.querySelectorAll('app-badge')).toHaveLength(5);
    expect(el.querySelectorAll('app-loading-spinner')).toHaveLength(2); // sm + lg preview
    expect(el.querySelector('.app-button--primary[disabled]')).toBeTruthy();
  });

  it('renders the "Throw test error" trigger', async () => {
    await TestBed.configureTestingModule({ imports: [UiKit] }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button.app-button'),
    );
    const throwButton = buttons.find((button) => button.textContent?.includes('Throw test error'));

    expect(throwButton).toBeTruthy();
  });

  it('throwTestError() throws, so GlobalErrorHandler can catch it (see global-error-handler.spec.ts)', async () => {
    await TestBed.configureTestingModule({ imports: [UiKit] }).compileComponents();
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
      TestBed.configureTestingModule({ imports: [UiKit] });
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
      TestBed.configureTestingModule({ imports: [UiKit] });
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
});
