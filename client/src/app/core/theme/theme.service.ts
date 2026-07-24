import { PLATFORM_ID, Service, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

const THEME_ATTRIBUTE = 'data-theme';
const THEME_STORAGE_KEY = 'theme';

// Toggles `data-theme="dark"` on <html> and persists the choice for the
// session (sessionStorage). Every themeable value is a CSS custom property
// (see styles/theme.scss), so this is the only place theme state lives —
// components never branch on it, they just read the tokens.
@Service()
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly themeSignal = signal<Theme>(this.readInitialTheme());

  readonly theme = this.themeSignal.asReadonly();

  constructor() {
    effect(() => {
      this.applyTheme(this.themeSignal());
    });
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  private readInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    return sessionStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (theme === 'dark') {
      document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
    } else {
      document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    }
    sessionStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}
