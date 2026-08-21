import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppTextInput } from './text-input';

describe('AppTextInput', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppTextInput],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppTextInput);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders a label associated with the input', async () => {
    const fixture = await setup({ label: 'Height' });
    const el = fixture.nativeElement as HTMLElement;
    const label = el.querySelector('label');
    const input = el.querySelector('input');
    expect(label?.textContent).toContain('Height');
    expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'));
  });

  it('updates value model on input', async () => {
    const fixture = await setup({ label: 'Name' });
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.value()).toBe('hello');
  });

  it('shows hint text with aria-describedby', async () => {
    const fixture = await setup({ label: 'Weight', hint: 'In kilograms' });
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const hint = fixture.nativeElement.querySelector('.app-text-input__hint');
    expect(hint?.textContent).toContain('In kilograms');
    expect(input.getAttribute('aria-describedby')).toContain('hint');
  });

  it('shows error and sets aria-invalid', async () => {
    const fixture = await setup({ label: 'Age', error: 'Required' });
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const error = fixture.nativeElement.querySelector('.app-text-input__error');
    expect(error?.textContent).toContain('Required');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the input when disabled is true', async () => {
    const fixture = await setup({ label: 'Name', disabled: true });
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
