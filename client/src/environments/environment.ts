import type { AppConfig } from '../app/core/config/app-config';

// Production. Selected by default (no fileReplacement) for `ng build`.
export const environment: AppConfig = {
  apiBaseUrl: 'https://api.example.com',
  useMockData: false,
  environment: 'production',
  // /dev/ui-kit is a visual-QA tool, not a product page — kept off outside
  // development (see core/guards/dev-route.guard.ts).
  featureFlags: { devUiKit: false },
};
