import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ToolNotFound } from './tool-not-found';

describe('ToolNotFound', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolNotFound],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the not-found message and links', () => {
    const fixture = TestBed.createComponent(ToolNotFound);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('breadcrumbLabel', 'Time & Date');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("This tool doesn't exist");
    expect(el.querySelector('a')?.getAttribute('href')).toContain('time-date-tools');
    expect(el.textContent).toContain('All tools');
  });
});
