import { Routes } from '@angular/router';
import { TOOL_SLUG_PARAM, ToolCategorySegment } from '../../core/config/route-paths';
import { ToolCategoryMeta } from './tool-categories';

// Shared shape for every category's routes file: an index route (category
// landing) wired to CategoryBrowse, and a `:toolSlug` child still wired to
// ToolComingSoon (replaced when individual tools are implemented). Keeps the
// 11 per-category route files to a single declarative call each.
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
      loadComponent: () => import('./tool-shell/tool-coming-soon').then((m) => m.ToolComingSoon),
      data: {
        title: meta.title,
        metaDescription: meta.metaDescription,
      },
    },
  ];
}
