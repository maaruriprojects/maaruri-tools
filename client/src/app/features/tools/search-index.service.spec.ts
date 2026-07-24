import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { AppConfig } from '../../core/config/app-config';
import { APP_CONFIG } from '../../core/config/config.service';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import { SearchIndexService } from './search-index.service';

describe('SearchIndexService', () => {
  const testConfig: AppConfig = {
    apiBaseUrl: '/test-assets',
    useMockData: true,
    environment: 'development',
    featureFlags: {},
  };

  const sampleEntries: SearchIndexEntry[] = [
    { slug: 'digital-clock', title: 'Digital Clock', category: 'time-date-tools' },
    { slug: 'bmi-calculator', title: 'BMI Calculator', category: 'health-fitness' },
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

  it('requests the search index from ConfigService.apiBaseUrl and exposes the parsed entries', async () => {
    const service = TestBed.inject(SearchIndexService);
    TestBed.tick();

    const req = httpMock.expectOne('/test-assets/search-index.json');
    req.flush(sampleEntries);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.entries()).toEqual(sampleEntries);
    expect(service.isLoading()).toBe(false);
    expect(service.error()).toBeUndefined();
  });

  it('starts in a loading state with an empty default before the response resolves', () => {
    const service = TestBed.inject(SearchIndexService);
    TestBed.tick();

    expect(service.isLoading()).toBe(true);
    expect(service.entries()).toEqual([]);

    httpMock.expectOne('/test-assets/search-index.json').flush(sampleEntries);
  });

  it('exposes an error when the request fails', async () => {
    const service = TestBed.inject(SearchIndexService);
    TestBed.tick();

    const req = httpMock.expectOne('/test-assets/search-index.json');
    req.flush('not found', { status: 404, statusText: 'Not Found' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.error()).toBeDefined();
    expect(service.isLoading()).toBe(false);
  });
});
