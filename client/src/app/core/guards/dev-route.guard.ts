import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConfigService } from '../config/config.service';

// Gates routes under /dev (e.g. /dev/ui-kit) behind the `devUiKit` feature
// flag — on in development/staging, off in production (see
// src/environments/environment*.ts). Functional guard, per project
// convention (no class-based guards).
export const devRouteGuard: CanActivateFn = () => {
  const configService = inject(ConfigService);

  if (configService.config.featureFlags['devUiKit'] === true) {
    return true;
  }

  return inject(Router).parseUrl('/');
};
