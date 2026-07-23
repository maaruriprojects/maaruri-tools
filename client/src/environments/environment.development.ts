import type { AppConfig } from '../app/core/config/app-config';

// Development. Selected via the `development` fileReplacement in angular.json.
export const environment: AppConfig = {
  // Local static JSON, served from `public/assets/data` at this path.
  apiBaseUrl: '/assets/data',
  // Once a real API exists: apiBaseUrl: 'http://localhost:3000/api',
  useMockData: true,
  environment: 'development',
  featureFlags: {},
};
