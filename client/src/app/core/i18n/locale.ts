import locales from './locales.json';

export interface Locale {
  readonly code: string;
  readonly displayName: string;
}

// Only one locale exists today. Adding another is a data change to
// locales.json, not a routing rewrite — every route is already nested
// under a `:locale` segment.
export const LOCALES: readonly Locale[] = locales;

export const DEFAULT_LOCALE: Locale = LOCALES[0];

export const LOCALE_CODES: readonly string[] = LOCALES.map((locale) => locale.code);
