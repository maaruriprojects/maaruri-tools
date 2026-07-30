import { Routes } from '@angular/router';
import { TOOL_SLUG_PARAM } from '../../core/config/route-paths';
import { ToolCategoryMeta } from './tool-categories';

// Shared shape for every category's routes file: an index route (category
// landing, still the placeholder — no category-listing page exists yet)
// and a `:toolSlug` child, now wired to ToolShell — the shared scaffolding
// (ARCHITECTURE.md) that resolves the real tool by slug and renders it, or
// falls back to ToolComingSoon for the ~199 tools without a real component
// yet. Keeps the 11 per-category route files to a single declarative call
// each instead of duplicating this structure 11 times.
export function createToolCategoryRoutes(meta: ToolCategoryMeta): Routes {
  // The category's own breadcrumbLabel lives on its parent route (see
  // app.routes.ts's categoryBreadcrumbData) rather than here, so it isn't
  // repeated on both children below. The index route still reuses it
  // directly (visiting the category landing page really is just that
  // category again). The `:toolSlug` child deliberately omits it: there's
  // no per-tool title in static route data (ToolShell sets the real one
  // dynamically once it resolves the tool — see tool-shell.ts), so
  // BreadcrumbService instead humanizes the toolSlug param itself for that
  // page's crumb.
  return [
    {
      path: '',
      loadComponent: () => import('./tool-shell/tool-coming-soon').then((m) => m.ToolComingSoon),
      data: {
        title: meta.title,
        breadcrumbLabel: meta.breadcrumbLabel,
        metaDescription: meta.metaDescription,
      },
    },
    {
      path: `:${TOOL_SLUG_PARAM}`,
      loadComponent: () => import('./tool-shell/tool-shell').then((m) => m.ToolShell),
      data: {
        title: meta.title,
        metaDescription: meta.metaDescription,
      },
    },
  ];
}
