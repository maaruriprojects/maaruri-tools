import { TestBed } from '@angular/core/testing';
import type { BreadcrumbItem } from '../../shared/models/breadcrumb-item';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  const sampleTrail: BreadcrumbItem[] = [
    { label: 'Home', url: '/en-us' },
    { label: 'Health & Fitness', url: '/en-us/health-fitness' },
    { label: 'Bmi Calculator', url: '/en-us/health-fitness/bmi-calculator' },
  ];

  beforeEach(() => {
    document.getElementById('breadcrumb-jsonld')?.remove();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    document.getElementById('breadcrumb-jsonld')?.remove();
  });

  it('adds a JSON-LD BreadcrumbList script tag to <head>', () => {
    const service = TestBed.inject(SeoService);

    service.setBreadcrumbJsonLd(sampleTrail);

    const script = document.getElementById('breadcrumb-jsonld') as HTMLScriptElement;
    expect(script).toBeTruthy();
    expect(script.tagName).toBe('SCRIPT');
    expect(script.type).toBe('application/ld+json');
    expect(script.parentElement).toBe(document.head);

    const payload = JSON.parse(script.textContent ?? '{}');
    expect(payload['@context']).toBe('https://schema.org');
    expect(payload['@type']).toBe('BreadcrumbList');
    expect(payload.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/en-us' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Health & Fitness',
        item: '/en-us/health-fitness',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Bmi Calculator',
        item: '/en-us/health-fitness/bmi-calculator',
      },
    ]);
  });

  it('replaces a previous tag rather than accumulating duplicates', () => {
    const service = TestBed.inject(SeoService);

    service.setBreadcrumbJsonLd(sampleTrail);
    service.setBreadcrumbJsonLd([{ label: 'Home', url: '/en-us' }]);

    expect(document.head.querySelectorAll('#breadcrumb-jsonld')).toHaveLength(1);
    const payload = JSON.parse(document.getElementById('breadcrumb-jsonld')?.textContent ?? '{}');
    expect(payload.itemListElement).toHaveLength(1);
  });

  it('removes the tag entirely when given an empty trail', () => {
    const service = TestBed.inject(SeoService);
    service.setBreadcrumbJsonLd(sampleTrail);

    service.setBreadcrumbJsonLd([]);

    expect(document.getElementById('breadcrumb-jsonld')).toBeNull();
  });
});
