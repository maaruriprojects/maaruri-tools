import { TestBed } from '@angular/core/testing';
import { AppLoadingSpinner } from './loading-spinner';

describe('AppLoadingSpinner', () => {
  it('defaults to the small size', async () => {
    await TestBed.configureTestingModule({ imports: [AppLoadingSpinner] }).compileComponents();
    const fixture = TestBed.createComponent(AppLoadingSpinner);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.classList).toContain('app-loading-spinner--sm');
  });

  it('reflects the size input', async () => {
    await TestBed.configureTestingModule({ imports: [AppLoadingSpinner] }).compileComponents();
    const fixture = TestBed.createComponent(AppLoadingSpinner);
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.classList).toContain('app-loading-spinner--lg');
  });
});
