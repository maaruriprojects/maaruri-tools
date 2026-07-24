import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { loadingInterceptor } from './loading.interceptor';
import { LoadingService } from './loading.service';

describe('loadingInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('increments on request start and decrements on success', async () => {
    const promise = firstValueFrom(httpClient.get('/api/widgets'));
    expect(loadingService.requestCount()).toBe(1);

    httpMock.expectOne('/api/widgets').flush({});
    await promise;

    expect(loadingService.requestCount()).toBe(0);
  });

  it('decrements on error too', async () => {
    const promise = firstValueFrom(httpClient.get('/api/widgets')).catch(() => undefined);
    expect(loadingService.requestCount()).toBe(1);

    httpMock.expectOne('/api/widgets').flush('err', { status: 500, statusText: 'Server Error' });
    await promise;

    expect(loadingService.requestCount()).toBe(0);
  });

  it('tracks overlapping requests independently, decrementing per request', async () => {
    const first = firstValueFrom(httpClient.get('/api/a'));
    const second = firstValueFrom(httpClient.get('/api/b'));
    expect(loadingService.requestCount()).toBe(2);

    httpMock.expectOne('/api/a').flush({});
    await first;
    expect(loadingService.requestCount()).toBe(1);

    httpMock.expectOne('/api/b').flush({});
    await second;
    expect(loadingService.requestCount()).toBe(0);
  });
});
