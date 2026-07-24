import { DOCUMENT } from '@angular/common';
import { Service, inject } from '@angular/core';
import type { BreadcrumbItem } from '../../shared/models/breadcrumb-item';

const BREADCRUMB_SCRIPT_ID = 'breadcrumb-jsonld';

// Injects DOCUMENT rather than gating on isPlatformBrowser (contrast
// ThemeService, which is browser-only since it reads sessionStorage): the
// JSON-LD tag must be present in the prerendered HTML itself, not just
// patched in client-side after hydration, so this has to run during SSR
// too. Angular's server platform provides its own DOCUMENT implementation
// that gets serialized into the response — the same technique this project
// could reuse for other <head> injection later (canonical links, og:tags),
// though nothing else needs that yet.
@Service()
export class SeoService {
  private readonly document = inject(DOCUMENT);

  // schema.org BreadcrumbList — https://schema.org/BreadcrumbList. Replaces
  // any previously-set breadcrumb JSON-LD (one tag per page, not one per
  // navigation) and removes the tag entirely when there's no trail to show.
  setBreadcrumbJsonLd(items: readonly BreadcrumbItem[]): void {
    this.document.getElementById(BREADCRUMB_SCRIPT_ID)?.remove();

    if (items.length === 0) {
      return;
    }

    const payload = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.url,
      })),
    };

    const script = this.document.createElement('script');
    script.id = BREADCRUMB_SCRIPT_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(payload);
    this.document.head.appendChild(script);
  }
}
