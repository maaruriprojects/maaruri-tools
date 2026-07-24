import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BreadcrumbItem } from '../../models/breadcrumb-item';

// Reference shared component — see COMPONENT_GUIDELINES.md. Pure
// @Input-driven: it renders whatever trail it's given and has no idea
// routes, route data, or JSON-LD even exist. The actual route-walking (and
// pushing the same trail to SeoService as JSON-LD) lives in
// BreadcrumbService (core/seo/breadcrumb.service.ts) — Router/ActivatedRoute
// are framework services a shared component could inject directly, but
// SeoService is app-specific, and a shared component never reaches for
// those itself. App (src/app/app.ts) is the one place that injects
// BreadcrumbService and passes its `trail` signal down as `items`, the same
// split already used for ToastService/AppToast.
//
// RouterLink is a framework directive, not app state — same allowance
// AppCard already relies on for its own links.
@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class AppBreadcrumb {
  readonly items = input<readonly BreadcrumbItem[]>([]);
}
