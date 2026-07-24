import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { AppConfig } from '../config/app-config';
import { APP_CONFIG } from '../config/config.service';
import { BaseApiService } from './base-api.service';

describe('BaseApiService', () => {
  const testConfig: AppConfig = {
    apiBaseUrl: '/test-api',
    useMockData: true,
    environment: 'development',
    featureFlags: {},
  };

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: testConfig },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('resourceUrl() resolves a relative path against ConfigService.apiBaseUrl', () => {
    const service = TestBed.inject(BaseApiService);

    expect(service.resourceUrl('/widgets.json')).toBe('/test-api/widgets.json');
  });

  it('getResource() requests the resolved URL and exposes the parsed value', async () => {
    const service = TestBed.inject(BaseApiService);
    // httpResource() (used internally) requires an injection context — real
    // consumers call getResource() from a field initializer, which already
    // is one; TestBed.runInInjectionContext reproduces that here.
    const resource = TestBed.runInInjectionContext(() =>
      service.getResource<{ name: string }[]>(() => '/widgets.json', { defaultValue: [] }),
    );
    TestBed.tick();

    const req = httpMock.expectOne('/test-api/widgets.json');
    req.flush([{ name: 'widget-1' }]);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(resource.value()).toEqual([{ name: 'widget-1' }]);
  });

  it('getResource() skips the request while pathFn returns undefined', () => {
    const service = TestBed.inject(BaseApiService);
    TestBed.runInInjectionContext(() =>
      service.getResource<{ name: string }[]>(() => undefined, { defaultValue: [] }),
    );
    TestBed.tick();

    httpMock.expectNone(() => true);
  });
});
