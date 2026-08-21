import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import type { ToolMeta } from '../../shared/models/tool-meta';
import { Home } from './home';

describe('Home', () => {
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
      icon: 'scale',
    },
  ];

  const sampleEntries: SearchIndexEntry[] = [
    { slug: 'digital-clock', title: 'Digital Clock', category: 'time-date-tools' },
    { slug: 'bmi-calculator', title: 'BMI Calculator', category: 'health-fitness' },
  ];

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  function flushSearchIndex(): void {
    httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleEntries);
  }

  it('shows a loading state before the registry resolves', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Loading tools');

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    flushSearchIndex();
  });

  it('renders the tool titles once the registry resolves', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    flushSearchIndex();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Digital Clock');
    expect(text).toContain('BMI Calculator');
  });

  it('renders metadata, trending tools, and all category tiles', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    flushSearchIndex();
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('2 tools · 11 categories · zero sign-up');
    expect(el.querySelectorAll('app-category-tile')).toHaveLength(11);
    expect(el.querySelectorAll('app-tool-tile')).toHaveLength(2);
  });

  it('renders recently used tools only when history exists', async () => {
    localStorage.setItem(
      'maaruri-recent-tools',
      JSON.stringify([{ slug: 'bmi-calculator', category: 'health-fitness', timestamp: 1 }]),
    );
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    flushSearchIndex();
    await fixture.whenStable();
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Recently Used');
  });

  it('shows an error message when the registry request fails', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url.endsWith('tool-registry.json'))
      .flush('server error', { status: 500, statusText: 'Internal Server Error' });
    flushSearchIndex();
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("Couldn't load tools");
  });
});
