import { TestBed } from '@angular/core/testing';
// `ng test` builds against the `development` configuration by default, so this
// import resolves through the same fileReplacement as the app itself.
import { environment as activeEnvironment } from '../../../environments/environment';
import { environment as developmentEnvironment } from '../../../environments/environment.development';
import { environment as stagingEnvironment } from '../../../environments/environment.staging';
import { APP_CONFIG, ConfigService } from './config.service';

describe('ConfigService', () => {
  it('exposes the development config by default under the ng test build', () => {
    TestBed.configureTestingModule({});

    const service = TestBed.inject(ConfigService);

    expect(service.config).toEqual(activeEnvironment);
    expect(service.config).toEqual(developmentEnvironment);
    expect(service.config.environment).toBe('development');
    expect(service.config.apiBaseUrl).toBe('/assets/data');
    expect(service.config.useMockData).toBe(true);
  });

  it('exposes the staging config when APP_CONFIG is overridden', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: APP_CONFIG, useValue: stagingEnvironment }],
    });

    const service = TestBed.inject(ConfigService);

    expect(service.config).toEqual(stagingEnvironment);
    expect(service.config.environment).toBe('staging');
    expect(service.config.useMockData).toBe(false);
  });
});
