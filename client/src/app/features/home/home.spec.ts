import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
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

  const sampleSearchEntries: SearchIndexEntry[] = sampleTools.map((tool) => ({
    slug: tool.slug,
    title: tool.title,
    category: tool.category,
  }));

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // AppSearchBar (wired near the top of the page) is fed by
  // SearchIndexService, a second real HTTP-backed resource independent of
  // ToolRegistryService — every test that creates a fixture must flush it
  // too, same reason /dev/ui-kit's tests flush it (Day 15/18). Reading the
  // resolved `entries()` back out (not just flushing) needs an actual
  // microtask-queue drain, not just a synchronous detectChanges() right
  // after flush() — httpResource()'s internal state update lands a
  // microtask later. This deliberately doesn't use `fixture.whenStable()`
  // for that wait: ToolRegistryService's own resource is *also* pending at
  // this point in every test (nobody has flushed tool-registry.json yet),
  // and whenStable() blocks on every outstanding resource, not just this
  // one — it would hang until tool-registry.json is flushed too, which
  // happens later and separately in each test below. A real 0ms timer
  // reliably drains the microtask queue first (Node/browsers always empty
  // microtasks before running a macrotask), without waiting on unrelated
  // pending work.
  async function createHome(): Promise<ComponentFixture<Home>> {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleSearchEntries);
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();
    return fixture;
  }

  it('shows a loading state before the registry resolves', async () => {
    const fixture = await createHome();
    TestBed.tick();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Loading tools');

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
  });

  it('renders each tool as an AppCard, not a bullet list', async () => {
    const fixture = await createHome();
    TestBed.tick();

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ul')).toBeNull();
    expect(el.querySelectorAll('app-card')).toHaveLength(2);

    const text = el.textContent ?? '';
    expect(text).toContain('Digital Clock');
    expect(text).toContain('BMI Calculator');

    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('.app-card'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/en-us/time-date-tools/digital-clock',
      '/en-us/health-fitness/bmi-calculator',
    ]);

    expect(el.querySelector('.home__stats')?.textContent).toContain(
      '2 tools · 11 categories · zero sign-up',
    );
  });

  it('shows an error message when the registry request fails', async () => {
    const fixture = await createHome();
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url.endsWith('tool-registry.json'))
      .flush('server error', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("Couldn't load tools");
  });

  it('wires AppSearchBar to the real search index, navigating on selection', async () => {
    // Fake timers for the whole test, not just the debounce step: the
    // component (and its debounceTime pipeline) needs to be constructed
    // while fake timers are already active for vi.advanceTimersByTime to
    // reliably drive RxJS's internal scheduler later. advanceTimersByTimeAsync
    // (not the sync variant) also drains microtasks at each tick, which
    // httpResource's promise-based state update needs after flush().
    vi.useFakeTimers();
    try {
      const fixture = TestBed.createComponent(Home);
      fixture.detectChanges();
      httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleSearchEntries);
      httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('app-search-bar')).toBeTruthy();

      const input = el.querySelector('.app-search-bar__input') as HTMLInputElement;
      input.value = 'Digital';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(150);
      fixture.detectChanges();

      const option = el.querySelector('.app-search-bar__option') as HTMLButtonElement;
      expect(option?.textContent).toContain('Digital Clock');

      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      option.click();

      expect(navigateSpy).toHaveBeenCalledWith(['/', 'en-us', 'time-date-tools', 'digital-clock']);
    } finally {
      vi.useRealTimers();
    }
  });
});
