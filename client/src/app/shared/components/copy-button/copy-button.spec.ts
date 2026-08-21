import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppCopyButton } from './copy-button';
import { ToastService } from '../../../core/toast/toast.service';

describe('AppCopyButton', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppCopyButton],
      providers: [provideZonelessChangeDetection(), ToastService],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppCopyButton);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders a button with the label', async () => {
    const fixture = await setup({ value: '22.4', label: 'Copy result' });
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Copy result');
  });

  it('renders the copy icon by default', async () => {
    const fixture = await setup({ value: '22.4' });
    const svg = fixture.nativeElement.querySelector('svg.app-icon');
    expect(svg).toBeTruthy();
  });

  it('renders the default label when none provided', async () => {
    const fixture = await setup({ value: '42' });
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent).toContain('Copy');
  });

  it('has an aria-label', async () => {
    const fixture = await setup({ value: '42', label: 'Copy answer' });
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.getAttribute('aria-label')).toBe('Copy answer');
  });
});
