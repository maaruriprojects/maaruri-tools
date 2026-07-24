import { createToolCategoryRoutes } from './create-tool-category-routes';
import type { ToolCategoryMeta } from './tool-categories';

describe('createToolCategoryRoutes', () => {
  const meta: ToolCategoryMeta = {
    title: 'Health & Fitness Tools',
    breadcrumbLabel: 'Health & Fitness',
    metaDescription: 'BMI, calorie, and other health and fitness calculators.',
  };

  it('gives the category index route the full title/breadcrumbLabel/metaDescription', () => {
    const routes = createToolCategoryRoutes(meta);
    const indexRoute = routes.find((route) => route.path === '');

    expect(indexRoute?.data).toEqual({
      title: meta.title,
      breadcrumbLabel: meta.breadcrumbLabel,
      metaDescription: meta.metaDescription,
    });
  });

  it('omits breadcrumbLabel on the :toolSlug child, so BreadcrumbService falls back to the slug', () => {
    const routes = createToolCategoryRoutes(meta);
    const toolRoute = routes.find((route) => route.path === ':toolSlug');

    expect(toolRoute?.data).toEqual({
      title: meta.title,
      metaDescription: meta.metaDescription,
    });
    expect(toolRoute?.data?.['breadcrumbLabel']).toBeUndefined();
  });
});
