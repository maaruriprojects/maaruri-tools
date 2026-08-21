import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppTextareaControl } from './textarea-control';

describe('AppTextareaControl', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppTextareaControl],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppTextareaControl);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders a label associated with the textarea', async () => {
    const fixture = await setup({ label: 'Notes' });
    const el = fixture.nativeElement as HTMLElement;
    const label = el.querySelector('label');
    const textarea = el.querySelector('textarea');
    expect(label?.textContent).toContain('Notes');
    expect(label?.getAttribute('for')).toBe(textarea?.getAttribute('id'));
  });

  it('sets rows attribute', async () => {
    const fixture = await setup({ label: 'Notes', rows: 6 });
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.rows).toBe(6);
  });

  it('sets maxlength when provided', async () => {
    const fixture = await setup({ label: 'Notes', maxLength: 500 });
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.getAttribute('maxlength')).toBe('500');
  });

  it('shows error and sets aria-invalid', async () => {
    const fixture = await setup({ label: 'Notes', error: 'Too long' });
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const error = fixture.nativeElement.querySelector('.app-textarea-control__error');
    expect(error?.textContent).toContain('Too long');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the textarea when disabled is true', async () => {
    const fixture = await setup({ label: 'Notes', disabled: true });
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.disabled).toBe(true);
  });
});
