export type AppEnvironment = 'development' | 'staging' | 'production';

export interface AppConfig {
  readonly apiBaseUrl: string;
  readonly useMockData: boolean;
  readonly environment: AppEnvironment;
  readonly featureFlags: Record<string, boolean>;
}
