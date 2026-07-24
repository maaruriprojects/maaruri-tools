import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// LoggingService isn't available yet — bootstrap hasn't produced an
// injector, so this is a legitimate direct console.error() (see
// core/logging/logging.service.ts and its eslint.config.js exception).
bootstrapApplication(App, appConfig).catch((err) => console.error(err));
