import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppModal } from './modal';

describe('AppModal', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppModal],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppModal);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders nothing when open is false', async () => {
    const fixture = await setup({ open: false, title: 'Test' });
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).toBeNull();
  });

  it('renders dialog with aria attributes when open', async () => {
    const fixture = await setup({ open: true, title: 'Confirm' });
    const dialog = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-labelledby')).toBeTruthy();
  });

  it('renders the title', async () => {
    const fixture = await setup({ open: true, title: 'Delete Item' });
    const title = fixture.nativeElement.querySelector('.app-modal__title');
    expect(title?.textContent).toContain('Delete Item');
  });

  it('emits closed when close button is clicked', async () => {
    const fixture = await setup({ open: true, title: 'Test' });
    let closed = false;
    fixture.componentInstance.closed.subscribe(() => (closed = true));
    const btn = fixture.nativeElement.querySelector('.app-modal__close');
    btn.click();
    expect(closed).toBe(true);
  });

  it('emits closed on backdrop click when closeOnBackdrop is true', async () => {
    const fixture = await setup({ open: true, title: 'Test', closeOnBackdrop: true });
    let closed = false;
    fixture.componentInstance.closed.subscribe(() => (closed = true));
    const backdrop = fixture.nativeElement.querySelector('.app-modal__backdrop');
    backdrop.click();
    expect(closed).toBe(true);
  });

  it('does not emit closed on backdrop click when closeOnBackdrop is false', async () => {
    const fixture = await setup({ open: true, title: 'Test', closeOnBackdrop: false });
    let closed = false;
    fixture.componentInstance.closed.subscribe(() => (closed = true));
    const backdrop = fixture.nativeElement.querySelector('.app-modal__backdrop');
    backdrop.click();
    expect(closed).toBe(false);
  });
});
