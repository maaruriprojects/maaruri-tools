import { TestBed } from '@angular/core/testing';
import type { Toast } from '../../../core/toast/toast';
import { AppToast } from './toast';

describe('AppToast', () => {
  const sampleToasts: Toast[] = [
    { id: 1, severity: 'success', message: 'Copied 22.4 to clipboard.' },
    { id: 2, severity: 'error', message: 'Live rates failed to load.' },
  ];

  it('has an aria-live container so new toasts are announced without moving focus', async () => {
    await TestBed.configureTestingModule({ imports: [AppToast] }).compileComponents();
    const fixture = TestBed.createComponent(AppToast);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.app-toast-container') as HTMLElement;
    expect(container.getAttribute('aria-live')).toBe('polite');
  });

  it('renders every toast in the queue, stacked, with the right severity class', async () => {
    await TestBed.configureTestingModule({ imports: [AppToast] }).compileComponents();
    const fixture = TestBed.createComponent(AppToast);
    fixture.componentRef.setInput('toasts', sampleToasts);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const toastEls = el.querySelectorAll('.app-toast');
    expect(toastEls).toHaveLength(2);
    expect(toastEls[0].classList).toContain('app-toast--success');
    expect(toastEls[0].textContent).toContain('Copied 22.4 to clipboard.');
    expect(toastEls[1].classList).toContain('app-toast--error');
    expect(toastEls[1].textContent).toContain('Live rates failed to load.');
  });

  it('emits dismiss with the toast id when its dismiss button is clicked', async () => {
    await TestBed.configureTestingModule({ imports: [AppToast] }).compileComponents();
    const fixture = TestBed.createComponent(AppToast);
    fixture.componentRef.setInput('toasts', sampleToasts);
    fixture.detectChanges();

    const dismissed: number[] = [];
    fixture.componentInstance.dismiss.subscribe((id: number) => dismissed.push(id));

    const buttons = fixture.nativeElement.querySelectorAll('.app-toast__dismiss');
    (buttons[1] as HTMLButtonElement).click();

    expect(dismissed).toEqual([2]);
  });
});
