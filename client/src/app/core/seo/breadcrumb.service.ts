import { Service, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { ActivatedRouteSnapshot } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import type { BreadcrumbItem } from '../../shared/models/breadcrumb-item';
import { SeoService } from './seo.service';

function humanize(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

// A level contributes a crumb from `data.breadcrumbLabel` when the route
// declares one (see app.routes.ts / create-tool-category-routes.ts). A
// dynamic segment (route config path starting with ':') that has no static
// breadcrumbLabel — e.g. the tool-shell's `:toolSlug` placeholder, which
// has no per-tool title until Day 6's real registry-resolved page replaces
// it — falls back to humanizing the matched param value instead
// ("bmi-calculator" -> "Bmi Calculator"), so a page is never silently
// dropped from the trail just because it's a param route.
//
// Reads `snapshot.routeConfig.data`, not `snapshot.data`: Angular's router
// merges `data` down the whole ancestor chain onto every descendant
// snapshot, so `snapshot.data` on the `:toolSlug` child would already
// contain its parent's breadcrumbLabel even though `:toolSlug` never
// declared one itself — routeConfig.data is the route's own, unmerged
// configuration, the only way to tell "declared here" from "inherited".
function labelFor(snapshot: ActivatedRouteSnapshot): string | undefined {
  const declared = snapshot.routeConfig?.data?.['breadcrumbLabel'];
  if (typeof declared === 'string' && declared.length > 0) {
    return declared;
  }

  const isDynamicSegment = snapshot.routeConfig?.path?.startsWith(':') ?? false;
  const matchedValue = snapshot.url[0]?.path;
  return isDynamicSegment && matchedValue ? humanize(matchedValue) : undefined;
}

// Reference for the pattern this mirrors: RouteDataTitleStrategy (this same
// folder) already walks the route tree reading the same `data` bag for
// title/metaDescription — this does the equivalent walk for breadcrumbs.
//
// Deliberately NOT part of AppBreadcrumbComponent itself: per
// COMPONENT_GUIDELINES.md, a shared component only ever reads @Inputs and
// never injects an app-specific service. Router/ActivatedRoute are
// framework services (fine anywhere), but the resulting trail still needs
// to reach SeoService (core/seo — an app-specific service), so that
// wiring — and the route-walking that feeds it — lives here instead, with
// App (src/app/app.ts) as the one place that injects this service and
// passes the trail down as AppBreadcrumb's `items` input, the same split
// already used for ToastService/AppToast and LoadingService/AppLoadingOverlay.
@Service()
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  // NavigationEnd fires for the initial navigation too, not just subsequent
  // ones, so `initialValue` below only covers the brief window before that
  // first event lands — it doesn't need its own separate route walk.
  readonly trail = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.buildTrail()),
    ),
    { initialValue: this.buildTrail() },
  );

  constructor() {
    effect(() => {
      const trail = this.trail();
      // Same threshold AppBreadcrumb uses to decide whether to render at
      // all (a single-item trail is just "you are on the home page," not a
      // real breadcrumb) — the structured data shouldn't claim a trail
      // exists when the visible one doesn't either.
      this.seoService.setBreadcrumbJsonLd(trail.length > 1 ? trail : []);
    });
  }

  private buildTrail(): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [];
    let path = '';
    let snapshot: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;

    while (snapshot) {
      for (const segment of snapshot.url) {
        path += `/${segment.path}`;
      }

      const label = labelFor(snapshot);
      if (label && label !== items.at(-1)?.label) {
        items.push({ label, url: path || '/' });
      }

      snapshot = snapshot.firstChild;
    }

    return items;
  }
}
