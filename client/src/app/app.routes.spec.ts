import { Routes } from '@angular/router';
import { routes } from './app.routes';
import { TOOL_CATEGORY_SEGMENT_LIST } from './core/config/route-paths';
import { DEFAULT_LOCALE } from './core/i18n/locale';

describe('routes', () => {
  it('redirects the empty path to the default locale', () => {
    const redirect = routes.find((route) => route.path === '');

    expect(redirect?.redirectTo).toBe(`/${DEFAULT_LOCALE.code}`);
  });

  it('nests every content route under a single :locale segment', () => {
    // dev/ui-kit is the one deliberate exception — an internal QA tool, not
    // a locale-specific content page (see app.routes.ts's comment on it).
    const contentRoutes = routes.filter(
      (route) => route.path !== '' && route.path !== 'dev/ui-kit',
    );

    expect(contentRoutes).toHaveLength(1);
    expect(contentRoutes[0].path).toBe(':locale');
  });

  it('gates /dev/ui-kit behind devRouteGuard', () => {
    const devRoute = routes.find((route) => route.path === 'dev/ui-kit');

    expect(devRoute?.canActivate).toBeDefined();
    expect(devRoute?.canActivate).toHaveLength(1);
  });

  it('registers a lazy route for every tool category, each with a :toolSlug child', async () => {
    const localeRoute = routes.find((route) => route.path === ':locale');
    const children = localeRoute?.children ?? [];

    for (const categorySegment of TOOL_CATEGORY_SEGMENT_LIST) {
      const categoryRoute = children.find((route) => route.path === categorySegment);
      expect(categoryRoute).toBeDefined();

      const resolvedRoutes = (await categoryRoute?.loadChildren?.()) as Routes;

      expect(resolvedRoutes.some((route) => route.path === '')).toBe(true);
      expect(resolvedRoutes.some((route) => route.path === ':toolSlug')).toBe(true);
    }
  });

  it('registers a wildcard 404 route under :locale', () => {
    const localeRoute = routes.find((route) => route.path === ':locale');
    const wildcard = localeRoute?.children?.find((route) => route.path === '**');

    expect(wildcard).toBeDefined();
    expect(wildcard?.data?.['title']).toBeTruthy();
  });

  it('attaches title/breadcrumbLabel/metaDescription data to every top-level page route', () => {
    const localeRoute = routes.find((route) => route.path === ':locale');
    const pageRoutes = (localeRoute?.children ?? []).filter(
      (route) => !TOOL_CATEGORY_SEGMENT_LIST.includes(route.path as never),
    );

    for (const route of pageRoutes) {
      expect(route.data?.['title']).toBeTruthy();
      expect(route.data?.['breadcrumbLabel']).toBeTruthy();
      expect(route.data?.['metaDescription']).toBeTruthy();
    }
  });
});
