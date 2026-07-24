import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ToolMeta } from '../../shared/models/tool-meta';
import { Home } from './home';

describe('Home', () => {
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
    {
      slug: 'bmi-calculator',
      title: 'BMI Calculator',
      category: 'health-fitness',
      shortDescription: 'Calculate your BMI.',
      componentKey: 'BmiCalculator',
      seoDescription: 'Free BMI calculator.',
      icon: 'scale',
    },
  ];

  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows a loading state before the registry resolves', () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Loading tools');

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
  });

  it('renders the tool titles once the registry resolves', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Digital Clock');
    expect(text).toContain('BMI Calculator');
  });

  it('shows an error message when the registry request fails', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    TestBed.tick();

    httpMock
      .expectOne((req) => req.url.endsWith('tool-registry.json'))
      .flush('server error', { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain("Couldn't load tools");
  });
});
