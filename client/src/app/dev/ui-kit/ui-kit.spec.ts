import { TestBed } from '@angular/core/testing';
import { UiKit } from './ui-kit';

describe('UiKit', () => {
  it('renders every button variant and badge color', async () => {
    await TestBed.configureTestingModule({ imports: [UiKit] }).compileComponents();
    const fixture = TestBed.createComponent(UiKit);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('app-button')).toHaveLength(5); // 3 variants + 1 disabled + throw-error
    expect(el.querySelectorAll('app-badge')).toHaveLength(5);
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
});
