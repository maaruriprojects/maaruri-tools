import type { AppConfig } from '../app/core/config/app-config';

// Development. Selected via the `development` fileReplacement in angular.json.
export const environment: AppConfig = {
  // Local static JSON under src/assets/data, copied to this path at build
  // time (see the assets entry in angular.json).
  apiBaseUrl: '/assets/data',
  // Once a real API exists: apiBaseUrl: 'http://localhost:3000/api',
  useMockData: true,
  environment: 'development',
  featureFlags: {},
};
