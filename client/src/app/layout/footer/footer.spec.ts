import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TOOL_CATEGORY_SEGMENT_LIST } from '../../core/config/route-paths';
import { AppFooter } from './footer';

describe('AppFooter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('lists all 11 tool categories', () => {
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('.app-footer__column a');
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'));

    for (const segment of TOOL_CATEGORY_SEGMENT_LIST) {
      expect(hrefs).toContain(`/en-us/${segment}`);
    }
  });

  it('links to Privacy, Terms, and Sitemap in the legal bar', () => {
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();

    const links = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.app-footer__legal-link',
    );
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'));

    expect(hrefs).toEqual(['/en-us/privacy', '/en-us/terms', '/en-us/sitemap']);
  });

  it('shows the current-year copyright line', () => {
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).querySelector(
      '.app-footer__copyright',
    )?.textContent;
    expect(text).toContain(`${new Date().getFullYear()}`);
    expect(text).toContain('Maaruri Tools');
  });
});
