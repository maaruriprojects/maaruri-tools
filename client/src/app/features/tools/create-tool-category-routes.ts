import { Routes } from '@angular/router';
import { TOOL_SLUG_PARAM } from '../../core/config/route-paths';
import { ToolCategoryMeta } from './tool-categories';

// Shared shape for every category's routes file: an index route (category
// landing) and a `:toolSlug` child, both wired to the same placeholder
// component today. Keeps the 11 per-category route files to a single
// declarative call each instead of duplicating this structure 11 times.
export function createToolCategoryRoutes(meta: ToolCategoryMeta): Routes {
  const data = {
    title: meta.title,
    breadcrumbLabel: meta.breadcrumbLabel,
    metaDescription: meta.metaDescription,
  };

  return [
    {
      path: '',
      loadComponent: () => import('./tool-shell/tool-coming-soon').then((m) => m.ToolComingSoon),
      data,
    },
    {
      path: `:${TOOL_SLUG_PARAM}`,
      loadComponent: () => import('./tool-shell/tool-coming-soon').then((m) => m.ToolComingSoon),
      data,
    },
  ];
}
