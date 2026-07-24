import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import type { AppError } from './app-error';
import { httpErrorInterceptor } from './http-error.interceptor';
import { LoggingService } from '../logging/logging.service';
import { ToastService } from '../toast/toast.service';

describe('httpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('re-throws a user-safe AppError, never the raw server body, for a 404', async () => {
    const loggingSpy = vi.spyOn(TestBed.inject(LoggingService), 'error');

    const resultPromise = firstValueFrom(httpClient.get('/api/widgets')).catch(
      (error: AppError) => error,
    );
    httpMock
      .expectOne('/api/widgets')
      .flush('raw server stack trace or body', { status: 404, statusText: 'Not Found' });
    const result = await resultPromise;

    expect(result).toEqual({
      message: "The requested resource couldn't be found. Try again or refresh the page.",
      status: 404,
      source: 'http',
    });
    expect(JSON.stringify(result)).not.toContain('raw server stack trace');

    expect(loggingSpy).toHaveBeenCalledWith(
      '404 Not Found — GET /api/widgets',
      '[httpErrorInterceptor]',
      expect.objectContaining({ url: '/api/widgets', method: 'GET', status: 404 }),
    );
  });

  it('gives a user-safe message for a network failure (status 0)', async () => {
    const resultPromise = firstValueFrom(httpClient.get('/api/widgets')).catch(
      (error: AppError) => error,
    );
    httpMock.expectOne('/api/widgets').error(new ProgressEvent('error'), { status: 0 });
    const result = await resultPromise;

    expect(result).toEqual({
      message: "Couldn't reach the server. Check your connection and try again.",
      status: 0,
      source: 'http',
    });
  });

  it('gives a user-safe message for a 500', async () => {
    const resultPromise = firstValueFrom(httpClient.get('/api/widgets')).catch(
      (error: AppError) => error,
    );
    httpMock
      .expectOne('/api/widgets')
      .flush('internal error detail', { status: 500, statusText: 'Internal Server Error' });
    const result = await resultPromise;

    expect(result).toEqual({
      message: 'The server had a problem on its end. Please try again shortly.',
      status: 500,
      source: 'http',
    });
  });

  it('closes the loop from Day 11: calls ToastService.error() with the same user-safe message', async () => {
    const toastService = TestBed.inject(ToastService);

    const resultPromise = firstValueFrom(httpClient.get('/api/widgets')).catch(
      (error: AppError) => error,
    );
    httpMock
      .expectOne('/api/widgets')
      .flush('server body', { status: 500, statusText: 'Internal Server Error' });
    await resultPromise;

    expect(toastService.toasts()).toHaveLength(1);
    expect(toastService.toasts()[0]).toMatchObject({
      severity: 'error',
      message: 'The server had a problem on its end. Please try again shortly.',
    });
  });

  it('stacks toasts for multiple failed requests rather than overwriting one another', async () => {
    const toastService = TestBed.inject(ToastService);

    const first = firstValueFrom(httpClient.get('/api/a')).catch((error: AppError) => error);
    const second = firstValueFrom(httpClient.get('/api/b')).catch((error: AppError) => error);
    httpMock.expectOne('/api/a').flush('err', { status: 500, statusText: 'Internal Server Error' });
    httpMock.expectOne('/api/b').flush('err', { status: 404, statusText: 'Not Found' });
    await Promise.all([first, second]);

    expect(toastService.toasts()).toHaveLength(2);
  });
});
