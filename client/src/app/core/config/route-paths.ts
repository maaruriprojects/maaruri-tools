// Single source of truth for route path segments and route param names, so
// the app shell, category route files, and the SSR prerender config
// (app.routes.server.ts) never hand-type a path segment more than once.

export const LOCALE_PARAM = 'locale';
export const TOOL_SLUG_PARAM = 'toolSlug';

export const ROUTE_SEGMENTS = {
  home: '',
  about: 'about',
  contact: 'contact',
  opportunities: 'opportunities',
} as const;

// Path segments match the kebab-case folder names under features/tools/.
export const TOOL_CATEGORY_SEGMENTS = {
  timeDateTools: 'time-date-tools',
  healthFitness: 'health-fitness',
  financeMoneyTools: 'finance-money-tools',
  workProductivity: 'work-productivity',
  convertersCalculators: 'converters-calculators',
  everydayPracticalTools: 'everyday-practical-tools',
  creativeDesignTools: 'creative-design-tools',
  developmentWebTools: 'development-web-tools',
  travelTransportation: 'travel-transportation',
  documentLanguageTools: 'document-language-tools',
  personalSocialTools: 'personal-social-tools',
} as const;

export type ToolCategorySegment =
  (typeof TOOL_CATEGORY_SEGMENTS)[keyof typeof TOOL_CATEGORY_SEGMENTS];

export const TOOL_CATEGORY_SEGMENT_LIST: readonly ToolCategorySegment[] =
  Object.values(TOOL_CATEGORY_SEGMENTS);
