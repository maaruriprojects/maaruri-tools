import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UrlTree } from '@angular/router';
import type { AppConfig } from '../config/app-config';
import { APP_CONFIG } from '../config/config.service';
import { devRouteGuard } from './dev-route.guard';

function runGuard(): boolean | UrlTree {
  return TestBed.runInInjectionContext(() =>
    devRouteGuard({} as unknown as ActivatedRouteSnapshot, {} as unknown as RouterStateSnapshot),
  ) as boolean | UrlTree;
}

function configWith(devUiKit: boolean): AppConfig {
  return {
    apiBaseUrl: '/assets/data',
    useMockData: true,
    environment: 'development',
    featureFlags: { devUiKit },
  };
}

describe('devRouteGuard', () => {
  it('allows activation when the devUiKit flag is on', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith(true) }],
    });

    expect(runGuard()).toBe(true);
  });

  it('redirects to / when the devUiKit flag is off', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith(false) }],
    });

    expect(runGuard()).toBeInstanceOf(UrlTree);
  });
});
