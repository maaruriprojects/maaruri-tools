import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TOOL_CATEGORY_SEGMENT_LIST } from '../../core/config/route-paths';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { Sitemap } from './sitemap';

describe('Sitemap', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('links to every static site page', () => {
    const fixture = TestBed.createComponent(Sitemap);
    fixture.detectChanges();

    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a'),
    ).map((a) => a.getAttribute('href'));

    expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}`);
    expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}/about`);
    expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}/contact`);
    expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}/opportunities`);
    expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}/privacy`);
    expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}/terms`);
  });

  it('links to all 11 tool categories', () => {
    const fixture = TestBed.createComponent(Sitemap);
    fixture.detectChanges();

    const hrefs = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('a'),
    ).map((a) => a.getAttribute('href'));

    expect(TOOL_CATEGORY_SEGMENT_LIST).toHaveLength(11);
    for (const segment of TOOL_CATEGORY_SEGMENT_LIST) {
      expect(hrefs).toContain(`/${DEFAULT_LOCALE.code}/${segment}`);
    }
  });
});
