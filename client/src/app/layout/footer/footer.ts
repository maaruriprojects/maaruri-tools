import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ROUTE_SEGMENTS,
  TOOL_CATEGORY_SEGMENT_LIST,
  ToolCategorySegment,
} from '../../core/config/route-paths';
import { SITE_NAME } from '../../core/config/site';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { TOOL_CATEGORY_META } from '../../features/tools/tool-categories';

interface FooterLink {
  readonly label: string;
  readonly path: readonly (string | number)[];
}

interface CategoryFooterLink extends FooterLink {
  readonly segment: ToolCategorySegment;
}

// ARCHITECTURE.md's "category index, legal, sitemap": a category-index
// column, a site column, and a bottom legal bar (copyright, Privacy, Terms,
// Sitemap). Pure static data — no services needed beyond the module-scope
// route/category metadata already imported everywhere else in the app.
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class AppFooter {
  protected readonly siteName = SITE_NAME;
  protected readonly currentYear = new Date().getFullYear();

  protected readonly categoryLinks: readonly CategoryFooterLink[] = TOOL_CATEGORY_SEGMENT_LIST.map(
    (segment) => ({
      segment,
      label: TOOL_CATEGORY_META[segment].title,
      path: ['/', DEFAULT_LOCALE.code, segment],
    }),
  );

  protected readonly siteLinks: readonly FooterLink[] = [
    { label: 'Home', path: ['/', DEFAULT_LOCALE.code] },
    { label: 'About', path: ['/', DEFAULT_LOCALE.code, ROUTE_SEGMENTS.about] },
    { label: 'Contact', path: ['/', DEFAULT_LOCALE.code, ROUTE_SEGMENTS.contact] },
    { label: 'Opportunities', path: ['/', DEFAULT_LOCALE.code, ROUTE_SEGMENTS.opportunities] },
  ];

  protected readonly legalLinks: readonly FooterLink[] = [
    { label: 'Privacy Policy', path: ['/', DEFAULT_LOCALE.code, ROUTE_SEGMENTS.privacy] },
    { label: 'Terms of Service', path: ['/', DEFAULT_LOCALE.code, ROUTE_SEGMENTS.terms] },
    { label: 'Sitemap', path: ['/', DEFAULT_LOCALE.code, ROUTE_SEGMENTS.sitemap] },
  ];
}
