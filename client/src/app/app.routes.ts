import { Routes } from '@angular/router';
import { LOCALE_PARAM, ROUTE_SEGMENTS, TOOL_CATEGORY_SEGMENTS } from './core/config/route-paths';
import { devRouteGuard } from './core/guards/dev-route.guard';
import { DEFAULT_LOCALE } from './core/i18n/locale';

// Every route lives under this segment (e.g. /en-us/...). Only one locale
// exists today (see core/i18n/locales.json); adding a second is a data
// change there, not a routing rewrite, since the segment is already here.
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `/${DEFAULT_LOCALE.code}`,
  },
  // Not locale-prefixed — an internal QA tool, not a content page. Gated
  // by devRouteGuard behind the `devUiKit` feature flag (see
  // src/environments/environment*.ts); off in production.
  {
    path: 'dev/ui-kit',
    canActivate: [devRouteGuard],
    loadComponent: () => import('./dev/ui-kit/ui-kit').then((m) => m.UiKit),
    data: {
      title: 'UI Kit',
      breadcrumbLabel: 'UI Kit',
      metaDescription: 'Internal visual QA page for shared components.',
    },
  },
  {
    path: `:${LOCALE_PARAM}`,
    children: [
      {
        path: ROUTE_SEGMENTS.home,
        pathMatch: 'full',
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        data: {
          title: 'Free Online Tools',
          breadcrumbLabel: 'Home',
          metaDescription: 'Free, fast online tools for everyday tasks — no sign-up required.',
        },
      },
      {
        path: ROUTE_SEGMENTS.about,
        loadComponent: () => import('./features/about/about').then((m) => m.About),
        data: {
          title: 'About',
          breadcrumbLabel: 'About',
          metaDescription: 'What this site is and who builds it.',
        },
      },
      {
        path: ROUTE_SEGMENTS.contact,
        loadComponent: () => import('./features/contact/contact').then((m) => m.Contact),
        data: {
          title: 'Contact',
          breadcrumbLabel: 'Contact',
          metaDescription: 'Get in touch with questions, feedback, or bug reports.',
        },
      },
      {
        path: ROUTE_SEGMENTS.opportunities,
        loadComponent: () =>
          import('./features/opportunities/opportunities').then((m) => m.Opportunities),
        data: {
          title: 'Opportunities',
          breadcrumbLabel: 'Opportunities',
          metaDescription: 'Ways to contribute, partner, or work with this project.',
        },
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.timeDateTools,
        loadChildren: () =>
          import('./features/tools/time-date-tools/time-date-tools.routes').then(
            (m) => m.TIME_DATE_TOOLS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.healthFitness,
        loadChildren: () =>
          import('./features/tools/health-fitness/health-fitness.routes').then(
            (m) => m.HEALTH_FITNESS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.financeMoneyTools,
        loadChildren: () =>
          import('./features/tools/finance-money-tools/finance-money-tools.routes').then(
            (m) => m.FINANCE_MONEY_TOOLS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.workProductivity,
        loadChildren: () =>
          import('./features/tools/work-productivity/work-productivity.routes').then(
            (m) => m.WORK_PRODUCTIVITY_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.convertersCalculators,
        loadChildren: () =>
          import('./features/tools/converters-calculators/converters-calculators.routes').then(
            (m) => m.CONVERTERS_CALCULATORS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.everydayPracticalTools,
        loadChildren: () =>
          import('./features/tools/everyday-practical-tools/everyday-practical-tools.routes').then(
            (m) => m.EVERYDAY_PRACTICAL_TOOLS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.creativeDesignTools,
        loadChildren: () =>
          import('./features/tools/creative-design-tools/creative-design-tools.routes').then(
            (m) => m.CREATIVE_DESIGN_TOOLS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.developmentWebTools,
        loadChildren: () =>
          import('./features/tools/development-web-tools/development-web-tools.routes').then(
            (m) => m.DEVELOPMENT_WEB_TOOLS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.travelTransportation,
        loadChildren: () =>
          import('./features/tools/travel-transportation/travel-transportation.routes').then(
            (m) => m.TRAVEL_TRANSPORTATION_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.documentLanguageTools,
        loadChildren: () =>
          import('./features/tools/document-language-tools/document-language-tools.routes').then(
            (m) => m.DOCUMENT_LANGUAGE_TOOLS_ROUTES,
          ),
      },
      {
        path: TOOL_CATEGORY_SEGMENTS.personalSocialTools,
        loadChildren: () =>
          import('./features/tools/personal-social-tools/personal-social-tools.routes').then(
            (m) => m.PERSONAL_SOCIAL_TOOLS_ROUTES,
          ),
      },
      {
        path: '**',
        loadComponent: () => import('./features/error-page/error-page').then((m) => m.ErrorPage),
        data: {
          title: 'Page Not Found',
          breadcrumbLabel: 'Not Found',
          metaDescription: 'The page you requested could not be found.',
        },
      },
    ],
  },
];
