import type { AppConfig } from '../app/core/config/app-config';

// Staging. Not wired into any consumer yet — selected via the `staging`
// fileReplacement in angular.json once a staging deployment target exists.
export const environment: AppConfig = {
  apiBaseUrl: 'https://staging-api.example.com',
  useMockData: false,
  environment: 'staging',
  // /dev/ui-kit stays on in staging — an internal QA environment is exactly
  // where visual QA tooling is useful (see core/guards/dev-route.guard.ts).
  featureFlags: { devUiKit: true },
};
