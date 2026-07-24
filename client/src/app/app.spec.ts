import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Routes, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { LoadingService } from './core/loading/loading.service';
import { ToastService } from './core/toast/toast.service';

describe('App', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('toggles the whole page between light and dark via the test button', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button.theme-toggle');
    (button as HTMLButtonElement).click();
    fixture.detectChanges();
    TestBed.tick();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('renders the global loading overlay, driven by LoadingService', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    const overlay = (fixture.nativeElement as HTMLElement).querySelector('app-loading-overlay');
    expect(overlay).toBeTruthy();

    const loadingService = TestBed.inject(LoadingService);
    expect(loadingService.isSpinnerVisible()).toBe(false);
  });

  it('renders the toast container, wired to ToastService', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-toast')).toBeTruthy();

    const toastService = TestBed.inject(ToastService);
    toastService.success('Copied 22.4 to clipboard.');
    fixture.detectChanges();

    const toastEl = (fixture.nativeElement as HTMLElement).querySelector('.app-toast');
    expect(toastEl?.textContent).toContain('Copied 22.4 to clipboard.');
  });

  it('renders the breadcrumb container, wired to BreadcrumbService', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-breadcrumb')).toBeTruthy();
  });
});

@Component({ selector: 'app-test-page', template: '' })
class TestPage {}

describe('App breadcrumb wiring, end to end through real navigation', () => {
  const breadcrumbRoutes: Routes = [
    {
      path: 'en-us',
      component: TestPage,
      data: { breadcrumbLabel: 'Home' },
      children: [
        { path: '', pathMatch: 'full', component: TestPage, data: { breadcrumbLabel: 'Home' } },
        {
          path: 'health-fitness',
          component: TestPage,
          data: { breadcrumbLabel: 'Health & Fitness' },
          children: [{ path: ':toolSlug', component: TestPage, data: {} }],
        },
      ],
    },
  ];

  beforeEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('shows a correct, clickable 3-level trail for a nested tool-shell route', async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(breadcrumbRoutes)],
    }).compileComponents();
    await RouterTestingHarness.create('/en-us/health-fitness/bmi-calculator');

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const labels = Array.from(el.querySelectorAll('.app-breadcrumb__item')).map((li) =>
      li.textContent?.trim(),
    );
    expect(labels).toEqual(['Home', 'Health & Fitness', 'Bmi Calculator']);

    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>('.app-breadcrumb__link'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/en-us', '/en-us/health-fitness']);

    const current = el.querySelector('.app-breadcrumb__current');
    expect(current?.textContent?.trim()).toBe('Bmi Calculator');
    expect(current?.getAttribute('aria-current')).toBe('page');

    // Alongside the visual trail, the same data reaches SeoService as JSON-LD.
    const jsonLd = document.getElementById('breadcrumb-jsonld');
    expect(jsonLd).toBeTruthy();
    const payload = JSON.parse(jsonLd?.textContent ?? '{}');
    expect(payload['@type']).toBe('BreadcrumbList');
    expect(payload.itemListElement).toHaveLength(3);

    document.getElementById('breadcrumb-jsonld')?.remove();
  });
});
