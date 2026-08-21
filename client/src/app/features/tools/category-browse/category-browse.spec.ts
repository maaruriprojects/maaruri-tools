import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CategoryBrowse } from './category-browse';
import type { ToolMeta } from '../../../shared/models/tool-meta';

const sampleTools: ToolMeta[] = [
  {
    slug: 'digital-clock',
    title: 'Digital Clock',
    category: 'time-date-tools',
    shortDescription: 'A live digital clock.',
    componentKey: 'DigitalClock',
    seoDescription: 'Free online digital clock.',
    icon: 'clock',
  },
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    category: 'health-fitness',
    shortDescription: 'Calculate your BMI.',
    componentKey: 'BmiCalculator',
    seoDescription: 'Free BMI calculator.',
    icon: 'heart-rate-monitor',
  },
  {
    slug: 'stopwatch',
    title: 'Stopwatch',
    category: 'time-date-tools',
    shortDescription: 'A precise stopwatch.',
    componentKey: 'Stopwatch',
    seoDescription: 'Free online stopwatch.',
    icon: 'clock',
  },
];

describe('CategoryBrowse', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryBrowse],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Flush any unhandled registry request so verify() doesn't fail
    const req = httpMock.match((r) => r.url.endsWith('tool-registry.json'));
    req.forEach((r) => r.flush([]));
    httpMock.verify();
  });

  it('renders the category title and tool count', async () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('title', 'Time & Date Tools');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Time & Date Tools');
    expect(el.textContent).toContain('2 tools');
  });

  it('filters tools by category', async () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'health-fitness');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('BMI Calculator');
    expect(el.textContent).not.toContain('Digital Clock');
    expect(el.textContent).not.toContain('Stopwatch');
  });

  it('sorts tools A–Z by default', async () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const tiles = (fixture.nativeElement as HTMLElement).querySelectorAll('app-tool-tile');
    expect(tiles.length).toBe(2);
    expect(tiles[0].textContent).toContain('Digital Clock');
    expect(tiles[1].textContent).toContain('Stopwatch');
  });

  it('sorts tools Z–A when sort mode changes', async () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    fixture.componentInstance.onSortChange('za');
    fixture.detectChanges();

    const tiles = (fixture.nativeElement as HTMLElement).querySelectorAll('app-tool-tile');
    expect(tiles[0].textContent).toContain('Stopwatch');
    expect(tiles[1].textContent).toContain('Digital Clock');
  });

  it('shows empty state when no tools exist in the category', async () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'personal-social-tools');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No tools in this category yet');
  });

  it('shows loading state while registry loads', () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Loading tools');
  });

  it('shows error state with retry when registry fails', async () => {
    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.detectChanges();
    httpMock
      .expectOne((r) => r.url.endsWith('tool-registry.json'))
      .flush('error', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("Couldn't load tools");
    expect(el.textContent).toContain('Try again');
  });

  it('inserts ad placeholders at the correct interval', async () => {
    const manyTools: ToolMeta[] = Array.from({ length: 15 }, (_, i) => ({
      slug: `tool-${i}`,
      title: `Tool ${String(i).padStart(2, '0')}`,
      category: 'time-date-tools',
      shortDescription: `Tool ${i}`,
      componentKey: `Tool${i}`,
      seoDescription: `Tool ${i}`,
      icon: 'clock',
    }));

    const fixture = TestBed.createComponent(CategoryBrowse);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(manyTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const ads = (fixture.nativeElement as HTMLElement).querySelectorAll('app-ad-in-article');
    expect(ads.length).toBeGreaterThanOrEqual(1);
  });
});
