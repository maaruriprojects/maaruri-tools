import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

function createMatchMedia(matches: boolean): MediaQueryList {
  return {
    matches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  } as MediaQueryList;
}

describe('ThemeService', () => {
  let matchMediaFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});

    matchMediaFn = vi.fn(() => createMatchMedia(false));
    vi.stubGlobal('matchMedia', matchMediaFn);
  });

  afterEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.unstubAllGlobals();
  });

  it('defaults to light with no data-theme attribute when nothing is stored and OS prefers light', () => {
    matchMediaFn.mockReturnValue(createMatchMedia(false));

    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('defaults to dark on first visit when OS prefers dark and nothing is stored', () => {
    matchMediaFn.mockReturnValue(createMatchMedia(true));

    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reads a previously stored preference on construction, ignoring OS preference', () => {
    sessionStorage.setItem('theme', 'light');
    matchMediaFn.mockReturnValue(createMatchMedia(true));

    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('reads a previously stored dark preference on construction', () => {
    sessionStorage.setItem('theme', 'dark');

    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggle() flips the theme, the attribute, and the persisted value', () => {
    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    service.toggle();
    TestBed.tick();

    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(sessionStorage.getItem('theme')).toBe('dark');

    service.toggle();
    TestBed.tick();

    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    expect(sessionStorage.getItem('theme')).toBe('light');
  });

  it('setTheme() sets an explicit theme', () => {
    const service = TestBed.inject(ThemeService);
    TestBed.tick();

    service.setTheme('dark');
    TestBed.tick();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('explicit toggle overrides prefers-color-scheme on subsequent visits', () => {
    // First visit: OS prefers dark, nothing stored → dark.
    matchMediaFn.mockReturnValue(createMatchMedia(true));

    let service = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(service.theme()).toBe('dark');

    // User explicitly switches to light.
    service.toggle();
    TestBed.tick();
    expect(sessionStorage.getItem('theme')).toBe('light');

    // Simulate a new visit: OS still prefers dark, but stored preference wins.
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    matchMediaFn = vi.fn(() => createMatchMedia(true));
    vi.stubGlobal('matchMedia', matchMediaFn);

    service = TestBed.inject(ThemeService);
    TestBed.tick();
    expect(service.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });
});
