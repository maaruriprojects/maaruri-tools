import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Routes, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BreadcrumbService } from './breadcrumb.service';

@Component({ selector: 'app-test-page', template: '' })
class TestPage {}

describe('BreadcrumbService', () => {
  // Mirrors the real shape: a `:locale` wrapper (breadcrumbLabel: 'Home'),
  // a category route carrying its own breadcrumbLabel, and a `:toolSlug`
  // leaf that deliberately has none — see app.routes.ts /
  // create-tool-category-routes.ts for the real version this stands in for.
  const routes: Routes = [
    {
      path: 'en-us',
      component: TestPage,
      data: { breadcrumbLabel: 'Home' },
      children: [
        { path: '', pathMatch: 'full', component: TestPage, data: { breadcrumbLabel: 'Home' } },
        { path: 'about', component: TestPage, data: { breadcrumbLabel: 'About' } },
        {
          path: 'health-fitness',
          component: TestPage,
          data: { breadcrumbLabel: 'Health & Fitness' },
          children: [
            {
              path: '',
              pathMatch: 'full',
              component: TestPage,
              data: { breadcrumbLabel: 'Health & Fitness' },
            },
            { path: ':toolSlug', component: TestPage, data: {} },
          ],
        },
        // No data at all — a plain pass-through level with nothing to
        // contribute, distinct from a level that has data but no
        // breadcrumbLabel specifically.
        {
          path: 'untagged',
          children: [{ path: 'leaf', component: TestPage, data: { breadcrumbLabel: 'Leaf' } }],
        },
      ],
    },
  ];

  beforeEach(() => {
    document.getElementById('breadcrumb-jsonld')?.remove();
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  afterEach(() => {
    document.getElementById('breadcrumb-jsonld')?.remove();
  });

  it('builds a single deduped "Home" crumb for the home page', async () => {
    await RouterTestingHarness.create('/en-us');
    const service = TestBed.inject(BreadcrumbService);

    expect(service.trail()).toEqual([{ label: 'Home', url: '/en-us' }]);
  });

  it('does not push JSON-LD for a trivial single-item trail', async () => {
    await RouterTestingHarness.create('/en-us');
    TestBed.inject(BreadcrumbService);
    TestBed.tick();

    expect(document.getElementById('breadcrumb-jsonld')).toBeNull();
  });

  it('pushes a matching JSON-LD BreadcrumbList once the trail has more than one item', async () => {
    await RouterTestingHarness.create('/en-us/health-fitness/bmi-calculator');
    TestBed.inject(BreadcrumbService);
    TestBed.tick();

    const script = document.getElementById('breadcrumb-jsonld');
    const payload = JSON.parse(script?.textContent ?? '{}');
    expect(payload.itemListElement).toHaveLength(3);
    expect(payload.itemListElement[2]).toEqual({
      '@type': 'ListItem',
      position: 3,
      name: 'Bmi Calculator',
      item: '/en-us/health-fitness/bmi-calculator',
    });
  });

  it('builds a two-level trail for a direct child page', async () => {
    await RouterTestingHarness.create('/en-us/about');
    const service = TestBed.inject(BreadcrumbService);

    expect(service.trail()).toEqual([
      { label: 'Home', url: '/en-us' },
      { label: 'About', url: '/en-us/about' },
    ]);
  });

  it('builds a three-level trail for the category index page', async () => {
    await RouterTestingHarness.create('/en-us/health-fitness');
    const service = TestBed.inject(BreadcrumbService);

    // The index child repeats the parent's own label — deduped to one crumb.
    expect(service.trail()).toEqual([
      { label: 'Home', url: '/en-us' },
      { label: 'Health & Fitness', url: '/en-us/health-fitness' },
    ]);
  });

  it('falls back to humanizing the :toolSlug param for a page with no breadcrumbLabel', async () => {
    await RouterTestingHarness.create('/en-us/health-fitness/bmi-calculator');
    const service = TestBed.inject(BreadcrumbService);

    expect(service.trail()).toEqual([
      { label: 'Home', url: '/en-us' },
      { label: 'Health & Fitness', url: '/en-us/health-fitness' },
      { label: 'Bmi Calculator', url: '/en-us/health-fitness/bmi-calculator' },
    ]);
  });

  it('skips a pass-through level that has no data at all', async () => {
    await RouterTestingHarness.create('/en-us/untagged/leaf');
    const service = TestBed.inject(BreadcrumbService);

    expect(service.trail()).toEqual([
      { label: 'Home', url: '/en-us' },
      { label: 'Leaf', url: '/en-us/untagged/leaf' },
    ]);
  });

  it('updates the trail on subsequent navigation', async () => {
    const harness = await RouterTestingHarness.create('/en-us/about');
    const service = TestBed.inject(BreadcrumbService);
    expect(service.trail().at(-1)).toEqual({ label: 'About', url: '/en-us/about' });

    await harness.navigateByUrl('/en-us/health-fitness/bmi-calculator');

    expect(service.trail().at(-1)).toEqual({
      label: 'Bmi Calculator',
      url: '/en-us/health-fitness/bmi-calculator',
    });
  });
});
