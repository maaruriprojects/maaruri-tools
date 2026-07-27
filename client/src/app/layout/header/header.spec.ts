import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { TOOL_CATEGORY_SEGMENT_LIST } from '../../core/config/route-paths';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import { AppHeader } from './header';

describe('AppHeader', () => {
  const sampleSearchEntries: SearchIndexEntry[] = [
    { slug: 'bmi-calculator', title: 'BMI Calculator', category: 'health-fitness' },
  ];

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [AppHeader],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  function createHeader(): ComponentFixture<AppHeader> {
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleSearchEntries);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the site logo linking home', () => {
    const fixture = createHeader();
    const logo = (fixture.nativeElement as HTMLElement).querySelector('.app-header__logo');
    expect(logo?.textContent?.trim()).toBe('Maaruri Tools');
    expect(logo?.getAttribute('href')).toBe('/en-us');
  });

  it('lists all 11 tool categories, each linking to its route', () => {
    const fixture = createHeader();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.app-header__categories-link',
    );
    expect(links).toHaveLength(TOOL_CATEGORY_SEGMENT_LIST.length);
    expect((links[0] as HTMLAnchorElement).getAttribute('href')).toBe(
      `/en-us/${TOOL_CATEGORY_SEGMENT_LIST[0]}`,
    );
  });

  it('toggles the theme via ThemeService', () => {
    const fixture = createHeader();
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();

    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '.app-header__theme-toggle',
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  // Same fake-timer pattern as home.spec.ts's identical AppSearchBar wiring
  // test: the debounceTime pipeline needs fake timers active from
  // construction, and advanceTimersByTimeAsync (not the sync variant) drains
  // microtasks at each tick, which httpResource's promise-based state update
  // needs after flush().
  it('navigates to the selected tool from the search bar', async () => {
    vi.useFakeTimers();
    try {
      const fixture = TestBed.createComponent(AppHeader);
      fixture.detectChanges();
      httpMock.expectOne((req) => req.url.endsWith('search-index.json')).flush(sampleSearchEntries);
      await vi.advanceTimersByTimeAsync(0);
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      const input = el.querySelector('.app-search-bar__input') as HTMLInputElement;
      input.value = 'BMI';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      await vi.advanceTimersByTimeAsync(150);
      fixture.detectChanges();

      const option = el.querySelector('.app-search-bar__option') as HTMLButtonElement;
      expect(option?.textContent).toContain('BMI Calculator');

      const router = TestBed.inject(Router);
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      option.click();

      expect(navigateSpy).toHaveBeenCalledWith(['/', 'en-us', 'health-fitness', 'bmi-calculator']);
    } finally {
      vi.useRealTimers();
    }
  });
});
