import { TestBed } from '@angular/core/testing';
import { AppBadge } from './badge';

describe('AppBadge', () => {
  it('renders the text input and defaults to the neutral color', async () => {
    await TestBed.configureTestingModule({ imports: [AppBadge] }).compileComponents();
    const fixture = TestBed.createComponent(AppBadge);
    fixture.componentRef.setInput('text', 'New');
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.app-badge') as HTMLElement;
    expect(el.textContent?.trim()).toBe('New');
    expect(el.classList).toContain('app-badge--neutral');
  });

  it('reflects the color input in the rendered class', async () => {
    await TestBed.configureTestingModule({ imports: [AppBadge] }).compileComponents();
    const fixture = TestBed.createComponent(AppBadge);
    fixture.componentRef.setInput('text', 'Beta');
    fixture.componentRef.setInput('color', 'info');
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.app-badge') as HTMLElement;
    expect(el.classList).toContain('app-badge--info');
  });
});
