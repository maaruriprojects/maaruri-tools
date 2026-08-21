import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppSelectControl } from './select-control';

describe('AppSelectControl', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppSelectControl],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppSelectControl);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders a label associated with the select', async () => {
    const fixture = await setup({
      label: 'Unit',
      options: [{ value: 'kg', label: 'Kilograms' }],
    });
    const el = fixture.nativeElement as HTMLElement;
    const label = el.querySelector('label');
    const select = el.querySelector('select');
    expect(label?.textContent).toContain('Unit');
    expect(label?.getAttribute('for')).toBe(select?.getAttribute('id'));
  });

  it('renders options', async () => {
    const fixture = await setup({
      label: 'Unit',
      options: [
        { value: 'kg', label: 'Kilograms' },
        { value: 'lb', label: 'Pounds' },
      ],
    });
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(2);
    expect(options[0].textContent).toContain('Kilograms');
    expect(options[1].textContent).toContain('Pounds');
  });

  it('shows error and sets aria-invalid', async () => {
    const fixture = await setup({ label: 'Unit', error: 'Select one' });
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const error = fixture.nativeElement.querySelector('.app-select-control__error');
    expect(error?.textContent).toContain('Select one');
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the select when disabled is true', async () => {
    const fixture = await setup({ label: 'Unit', disabled: true });
    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });
});
