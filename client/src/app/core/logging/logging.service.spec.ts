import { TestBed } from '@angular/core/testing';
import type { AppConfig, AppEnvironment } from '../config/app-config';
import { APP_CONFIG } from '../config/config.service';
import { LoggingService } from './logging.service';

function configWith(environment: AppEnvironment): AppConfig {
  return {
    apiBaseUrl: '/assets/data',
    useMockData: true,
    environment,
    featureFlags: {},
  };
}

describe('LoggingService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes every level in development', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith('development') }],
    });
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const service = TestBed.inject(LoggingService);
    service.debug('debug message');
    service.info('info message');
    service.warn('warn message');
    service.error('error message');

    expect(debugSpy).toHaveBeenCalledWith('debug message');
    expect(infoSpy).toHaveBeenCalledWith('info message');
    expect(warnSpy).toHaveBeenCalledWith('warn message');
    expect(errorSpy).toHaveBeenCalledWith('error message');
  });

  it('suppresses debug and info in production, keeps warn and error', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith('production') }],
    });
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const service = TestBed.inject(LoggingService);
    service.debug('debug message');
    service.info('info message');
    service.warn('warn message');
    service.error('error message');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith('warn message');
    expect(errorSpy).toHaveBeenCalledWith('error message');
  });

  it('suppresses debug in staging but keeps info and up', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith('staging') }],
    });
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => undefined);
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const service = TestBed.inject(LoggingService);
    service.debug('debug message');
    service.info('info message');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).toHaveBeenCalledWith('info message');
  });

  it('prepends the context tag when provided', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith('development') }],
    });
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const service = TestBed.inject(LoggingService);
    service.info('loaded', '[ToolRegistryService]');

    expect(infoSpy).toHaveBeenCalledWith('[ToolRegistryService] loaded');
  });

  it('passes metadata through as a second argument when provided', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith('development') }],
    });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const service = TestBed.inject(LoggingService);
    const metadata = { status: 500 };
    service.error('request failed', '[BaseApiService]', metadata);

    expect(errorSpy).toHaveBeenCalledWith('[BaseApiService] request failed', metadata);
  });

  it('omits the metadata argument entirely when none is given', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: configWith('development') }],
    });
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);

    const service = TestBed.inject(LoggingService);
    service.info('no metadata here');

    expect(infoSpy).toHaveBeenCalledWith('no metadata here');
    expect(infoSpy.mock.calls[0]).toHaveLength(1);
  });
});
