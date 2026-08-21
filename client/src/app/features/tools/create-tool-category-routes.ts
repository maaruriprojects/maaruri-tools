import { Routes } from '@angular/router';
import { TOOL_SLUG_PARAM, ToolCategorySegment } from '../../core/config/route-paths';
import { ToolCategoryMeta } from './tool-categories';

// Shared shape for every category's routes file: an index route (category
// landing) wired to CategoryBrowse, and a `:toolSlug` child wired to ToolShell
// which resolves the slug against the registry and renders the tool detail
// page (or ToolNotFound for invalid slugs). Keeps the 11 per-category route
// files to a single declarative call each.
export function createToolCategoryRoutes(
  meta: ToolCategoryMeta,
  segment: ToolCategorySegment,
): Routes {
  return [
    {
      path: '',
      loadComponent: () =>
        import('./category-browse/category-browse').then((m) => m.CategoryBrowse),
      data: {
        title: meta.title,
        breadcrumbLabel: meta.breadcrumbLabel,
        metaDescription: meta.metaDescription,
        categorySegment: segment,
      },
    },
    {
      path: `:${TOOL_SLUG_PARAM}`,
      loadComponent: () => import('./tool-shell/tool-shell').then((m) => m.ToolShell),
      data: {
        title: meta.title,
        metaDescription: meta.metaDescription,
        categorySegment: segment,
        breadcrumbLabel: meta.breadcrumbLabel,
      },
    },
  ];
}
