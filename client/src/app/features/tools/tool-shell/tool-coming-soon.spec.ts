import { TestBed } from '@angular/core/testing';
import { ToolComingSoon } from './tool-coming-soon';

describe('ToolComingSoon', () => {
  it('shows a category-level message when there is no toolSlug', async () => {
    await TestBed.configureTestingModule({ imports: [ToolComingSoon] }).compileComponents();
    const fixture = TestBed.createComponent(ToolComingSoon);
    fixture.componentRef.setInput('title', 'Time & Date Tools');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Time & Date Tools');
    expect(text).toContain('Tools in this category are coming soon.');
  });

  it('shows the tool slug when one is bound', async () => {
    await TestBed.configureTestingModule({ imports: [ToolComingSoon] }).compileComponents();
    const fixture = TestBed.createComponent(ToolComingSoon);
    fixture.componentRef.setInput('toolSlug', 'countdown-timer');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('The "countdown-timer" tool is coming soon.');
  });
});
