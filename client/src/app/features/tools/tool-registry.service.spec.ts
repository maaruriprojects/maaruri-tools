import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { AppConfig } from '../../core/config/app-config';
import { APP_CONFIG } from '../../core/config/config.service';
import type { ToolMeta } from '../../shared/models/tool-meta';
import { ToolRegistryService } from './tool-registry.service';

describe('ToolRegistryService', () => {
  const testConfig: AppConfig = {
    apiBaseUrl: '/test-assets',
    useMockData: true,
    environment: 'development',
    featureFlags: {},
  };

  const sampleTools: ToolMeta[] = [
    {
      slug: 'digital-clock',
      title: 'Digital Clock',
      category: 'time-date-tools',
      shortDescription: 'A live digital clock.',
      componentKey: 'DigitalClock',
      seoDescription: 'Free online digital clock.',
      icon: 'clock',
    },
  ];

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

  it('requests the registry from ConfigService.apiBaseUrl and exposes the parsed tools', async () => {
    const service = TestBed.inject(ToolRegistryService);
    TestBed.tick();

    const req = httpMock.expectOne('/test-assets/tool-registry.json');
    req.flush(sampleTools);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.tools()).toEqual(sampleTools);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeUndefined();
  });

  it('starts in a loading state with an empty default before the response resolves', () => {
    const service = TestBed.inject(ToolRegistryService);
    TestBed.tick();

    expect(service.isLoading()).toBe(true);
    expect(service.tools()).toEqual([]);

    httpMock.expectOne('/test-assets/tool-registry.json').flush(sampleTools);
  });

  it('exposes an error when the request fails', async () => {
    const service = TestBed.inject(ToolRegistryService);
    TestBed.tick();

    const req = httpMock.expectOne('/test-assets/tool-registry.json');
    req.flush('not found', { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.error()).toBeDefined();
    expect(service.isLoading()).toBe(false);
  });
});
