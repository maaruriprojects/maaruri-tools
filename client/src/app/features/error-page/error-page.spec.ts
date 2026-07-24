import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { ErrorPage } from './error-page';

describe('ErrorPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders a friendly message by default — no technical detail', () => {
    const fixture = TestBed.createComponent(ErrorPage);
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Something Went Wrong');
    expect(text).toContain("We hit a snag. Let's get you back on track.");
    expect(text).not.toMatch(/at\s+\S+\s+\(.*:\d+:\d+\)/); // no stack-trace-shaped text
  });

  it('renders route-data-driven title/message when provided', () => {
    const fixture = TestBed.createComponent(ErrorPage);
    fixture.componentRef.setInput('title', 'Page Not Found');
    fixture.componentRef.setInput('metaDescription', 'The page you requested could not be found.');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Page Not Found');
  });

  it('links back home', () => {
    const fixture = TestBed.createComponent(ErrorPage);
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toBe(`/${DEFAULT_LOCALE.code}`);
    expect(link?.textContent?.trim()).toBe('Go back home');
  });
});
