import { createToolCategoryRoutes } from './create-tool-category-routes';
import type { ToolCategoryMeta } from './tool-categories';

describe('createToolCategoryRoutes', () => {
  const meta: ToolCategoryMeta = {
    title: 'Health & Fitness Tools',
    breadcrumbLabel: 'Health & Fitness',
    metaDescription: 'BMI, calorie, and other health and fitness calculators.',
  };
  const segment = 'health-fitness';

  it('gives the category index route the full title/breadcrumbLabel/metaDescription and categorySegment', () => {
    const routes = createToolCategoryRoutes(meta, segment);
    const indexRoute = routes.find((route) => route.path === '');

    expect(indexRoute?.data).toEqual({
      title: meta.title,
      breadcrumbLabel: meta.breadcrumbLabel,
      metaDescription: meta.metaDescription,
      categorySegment: segment,
    });
  });

  it('gives the :toolSlug child route the title, metaDescription, categorySegment, and breadcrumbLabel', () => {
    const routes = createToolCategoryRoutes(meta, segment);
    const toolRoute = routes.find((route) => route.path === ':toolSlug');

    expect(toolRoute?.data).toEqual({
      title: meta.title,
      metaDescription: meta.metaDescription,
      categorySegment: segment,
      breadcrumbLabel: meta.breadcrumbLabel,
    });
  });
});
