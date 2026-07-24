import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppButton } from './button';

@Component({
  selector: 'app-button-host',
  imports: [AppButton],
  template: `<app-button [variant]="variant" [disabled]="disabled">Click me</app-button>`,
})
class HostComponent {
  variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  disabled = false;
}

describe('AppButton', () => {
  it('defaults to the primary variant and projects its content', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList).toContain('app-button--primary');
    expect(button.textContent?.trim()).toBe('Click me');
    expect(button.disabled).toBe(false);
  });

  it('reflects the variant input in the rendered class', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.variant = 'ghost';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList).toContain('app-button--ghost');
  });

  it('reflects the disabled input on the native button element', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
