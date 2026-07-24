import { RenderMode, ServerRoute } from '@angular/ssr';
import {
  LOCALE_PARAM,
  TOOL_CATEGORY_SEGMENT_LIST,
  TOOL_SLUG_PARAM,
  ToolCategorySegment,
} from './core/config/route-paths';
import { LOCALES } from './core/i18n/locale';
import { TOOL_SLUGS_BY_CATEGORY } from './features/tools/tool-registry';

const LOCALE_PATH = `:${LOCALE_PARAM}`;
const TOOL_SLUG_PATH = `:${TOOL_SLUG_PARAM}`;

async function getLocaleParams(): Promise<Record<string, string>[]> {
  return LOCALES.map((locale) => ({ [LOCALE_PARAM]: locale.code }));
}

function getToolSlugParams(categorySegment: ToolCategorySegment) {
  return async (): Promise<Record<string, string>[]> => {
    const locales = await getLocaleParams();
    const toolSlugs = TOOL_SLUGS_BY_CATEGORY[categorySegment];
    return locales.flatMap((localeParams) =>
      toolSlugs.map((toolSlug) => ({ ...localeParams, [TOOL_SLUG_PARAM]: toolSlug })),
    );
  };
}

// One static page per {locale} x {toolSlug} combination in the registry
// (placeholder today; Day 6's real registry drives this the same way).
// Every route below is prerendered except the catch-all 404 and /dev/ui-kit,
// neither of which has a fixed set of paths worth prerendering — 404 is
// unbounded, and the QA-only ui-kit route is gated off in production anyway
// (core/guards/dev-route.guard.ts), so there's nothing to gain prerendering it.
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'dev/ui-kit',
    renderMode: RenderMode.Client,
  },
  {
    path: LOCALE_PATH,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getLocaleParams,
  },
  {
    path: `${LOCALE_PATH}/about`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getLocaleParams,
  },
  {
    path: `${LOCALE_PATH}/contact`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getLocaleParams,
  },
  {
    path: `${LOCALE_PATH}/opportunities`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getLocaleParams,
  },
  {
    path: `${LOCALE_PATH}/error`,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: getLocaleParams,
  },
  ...TOOL_CATEGORY_SEGMENT_LIST.flatMap((categorySegment): ServerRoute[] => [
    {
      path: `${LOCALE_PATH}/${categorySegment}`,
      renderMode: RenderMode.Prerender,
      getPrerenderParams: getLocaleParams,
    },
    {
      path: `${LOCALE_PATH}/${categorySegment}/${TOOL_SLUG_PATH}`,
      renderMode: RenderMode.Prerender,
      getPrerenderParams: getToolSlugParams(categorySegment),
    },
  ]),
  {
    path: `${LOCALE_PATH}/**`,
    renderMode: RenderMode.Client,
  },
];
