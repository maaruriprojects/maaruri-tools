import { TestBed } from '@angular/core/testing';
import { AppLoadingOverlay } from './loading-overlay';

describe('AppLoadingOverlay', () => {
  it('defaults to hidden and does not inject any app-specific service', async () => {
    await TestBed.configureTestingModule({ imports: [AppLoadingOverlay] }).compileComponents();
    const fixture = TestBed.createComponent(AppLoadingOverlay);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.app-loading-overlay') as HTMLElement;
    expect(overlay.classList).not.toContain('app-loading-overlay--visible');
    expect(overlay.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows when the visible input is true', async () => {
    await TestBed.configureTestingModule({ imports: [AppLoadingOverlay] }).compileComponents();
    const fixture = TestBed.createComponent(AppLoadingOverlay);
    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.app-loading-overlay') as HTMLElement;
    expect(overlay.classList).toContain('app-loading-overlay--visible');
    expect(overlay.getAttribute('aria-hidden')).toBe('false');
    expect(fixture.nativeElement.querySelector('app-loading-spinner')).toBeTruthy();
  });
});
