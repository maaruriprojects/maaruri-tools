import type { AppConfig } from '../app/core/config/app-config';

// Production. Selected by default (no fileReplacement) for `ng build`.
export const environment: AppConfig = {
  apiBaseUrl: 'https://api.example.com',
  useMockData: false,
  environment: 'production',
  featureFlags: {},
};
