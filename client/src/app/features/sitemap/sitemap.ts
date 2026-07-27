import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_SEGMENTS, TOOL_CATEGORY_SEGMENT_LIST } from '../../core/config/route-paths';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { TOOL_CATEGORY_META } from '../tools/tool-categories';

interface SitemapLink {
  readonly label: string;
  readonly path: readonly (string | number)[];
}

// A real link index (unlike Privacy/Terms' placeholder copy) — Home, the
// static pages, and all 11 category routes. `title`/`metaDescription` bind
// from route `data` via withComponentInputBinding() in app.config.ts.
@Component({
  selector: 'app-sitemap',
  imports: [RouterLink],
  templateUrl: './sitemap.html',
  styleUrl: './sitemap.scss',
})
export class Sitemap {
  readonly title = input('');
  readonly metaDescription = input('');

  protected readonly localeCode = DEFAULT_LOCALE.code;

  protected readonly siteLinks: readonly SitemapLink[] = [
    { label: 'Home', path: ['/', this.localeCode] },
    { label: 'About', path: ['/', this.localeCode, ROUTE_SEGMENTS.about] },
    { label: 'Contact', path: ['/', this.localeCode, ROUTE_SEGMENTS.contact] },
    { label: 'Opportunities', path: ['/', this.localeCode, ROUTE_SEGMENTS.opportunities] },
    { label: 'Privacy Policy', path: ['/', this.localeCode, ROUTE_SEGMENTS.privacy] },
    { label: 'Terms of Service', path: ['/', this.localeCode, ROUTE_SEGMENTS.terms] },
  ];

  protected readonly categoryLinks: readonly SitemapLink[] = TOOL_CATEGORY_SEGMENT_LIST.map(
    (segment) => ({
      label: TOOL_CATEGORY_META[segment].title,
      path: ['/', this.localeCode, segment],
    }),
  );
}
