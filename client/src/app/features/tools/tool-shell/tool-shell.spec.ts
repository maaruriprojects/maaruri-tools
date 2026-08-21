import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { ToolShell } from './tool-shell';
import type { ToolMeta } from '../../../shared/models/tool-meta';

const sampleTools: ToolMeta[] = [
  {
    slug: 'test-tool',
    title: 'Test Tool',
    category: 'time-date-tools',
    shortDescription: 'A test tool.',
    componentKey: 'TestTool',
    seoDescription: 'A test tool for verifying the tool shell.',
    icon: 'clock',
  },
  {
    slug: 'stopwatch',
    title: 'Stopwatch',
    category: 'time-date-tools',
    shortDescription: 'A stopwatch.',
    componentKey: 'Stopwatch',
    seoDescription: 'Free online stopwatch.',
    icon: 'clock',
  },
  {
    slug: 'digital-clock',
    title: 'Digital Clock',
    category: 'time-date-tools',
    shortDescription: 'A digital clock.',
    componentKey: 'DigitalClock',
    seoDescription: 'Free online digital clock.',
    icon: 'clock',
  },
];

describe('ToolShell', () => {
  let httpMock: HttpTestingController;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolShell],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        Title,
        Meta,
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
  });

  afterEach(() => {
    const reqs = httpMock.match((r) => r.url.endsWith('tool-registry.json'));
    reqs.forEach((r) => r.flush([]));
    httpMock.verify();
  });

  it('renders ToolNotFound for an invalid slug', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('toolSlug', 'nonexistent-tool');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain("This tool doesn't exist");
  });

  it('sets the page title to "Tool Not Found" for invalid slugs', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('toolSlug', 'nonexistent-tool');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(titleService.getTitle()).toBe('Tool Not Found');
  });

  it('renders the readout and explanation for a valid tool', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('toolSlug', 'test-tool');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    // The tool component is loaded via a dynamic import inside an effect,
    // which resolves as a microtask. Wait for multiple stable cycles.
    for (let i = 0; i < 5; i++) {
      await fixture.whenStable();
      fixture.detectChanges();
    }

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('42');
    expect(el.textContent).toContain('How it works');
  });

  it('sets the page title and meta description from the tool metadata', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('toolSlug', 'test-tool');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(titleService.getTitle()).toBe('Test Tool');
    const descTag = metaService.getTag('name="description"');
    expect(descTag?.getAttribute('content')).toBe('A test tool for verifying the tool shell.');
  });

  it('renders related tools from the same category, excluding the current tool', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('toolSlug', 'test-tool');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Related tools');
    expect(el.textContent).toContain('Stopwatch');
    expect(el.textContent).toContain('Digital Clock');
    expect(el.textContent).not.toContain('Test Tool');
  });

  it('renders a sidebar ad on desktop layout', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('categorySegment', 'time-date-tools');
    fixture.componentRef.setInput('toolSlug', 'test-tool');
    fixture.detectChanges();
    httpMock.expectOne((r) => r.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const ads = (fixture.nativeElement as HTMLElement).querySelectorAll('app-ad-rectangle');
    expect(ads.length).toBe(1);
  });
});
