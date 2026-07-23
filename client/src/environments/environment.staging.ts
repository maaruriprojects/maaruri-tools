import type { AppConfig } from '../app/core/config/app-config';

// Staging. Not wired into any consumer yet — selected via the `staging`
// fileReplacement in angular.json once a staging deployment target exists.
export const environment: AppConfig = {
  apiBaseUrl: 'https://staging-api.example.com',
  useMockData: false,
  environment: 'staging',
  featureFlags: {},
};
