import { ErrorHandler, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { DEFAULT_LOCALE } from '../i18n/locale';
import { LoggingService } from '../logging/logging.service';
import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  function setUp(platform: 'browser' | 'server' = 'browser') {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const loggingSpy = vi.spyOn(TestBed.inject(LoggingService), 'error');
    const handler = TestBed.inject(ErrorHandler);

    return { handler, router, navigateSpy, loggingSpy };
  }

  it('logs full technical detail and navigates to the error page', () => {
    const { handler, navigateSpy, loggingSpy } = setUp();

    handler.handleError(new Error('boom'));

    expect(loggingSpy).toHaveBeenCalledWith(
      'boom',
      '[GlobalErrorHandler]',
      expect.objectContaining({ name: 'Error', stack: expect.any(String) }),
    );
    expect(navigateSpy).toHaveBeenCalledWith([DEFAULT_LOCALE.code, 'error']);
  });

  it('wraps a non-Error thrown value before logging', () => {
    const { handler, loggingSpy } = setUp();

    handler.handleError('a plain string error');

    expect(loggingSpy).toHaveBeenCalledWith(
      'a plain string error',
      '[GlobalErrorHandler]',
      expect.objectContaining({ name: 'Error' }),
    );
  });

  it('does not navigate again when already on the error page', () => {
    const { handler, router, navigateSpy } = setUp();
    Object.defineProperty(router, 'url', {
      value: `/${DEFAULT_LOCALE.code}/error`,
      configurable: true,
    });

    handler.handleError(new Error('boom again'));

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('does not navigate when not running in the browser (SSR)', () => {
    const { handler, navigateSpy } = setUp('server');

    handler.handleError(new Error('server-side boom'));

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
