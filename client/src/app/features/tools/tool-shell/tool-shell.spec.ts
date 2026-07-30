import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import type { ToolMeta } from '../../../shared/models/tool-meta';
import { ToolShell } from './tool-shell';

describe('ToolShell', () => {
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
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows the loading spinner before the registry resolves', () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('toolSlug', 'digital-clock');
    fixture.detectChanges();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('app-loading-spinner'),
    ).toBeTruthy();

    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
  });

  it('renders the real DigitalClock component for a known componentKey', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('toolSlug', 'digital-clock');
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    fixture.detectChanges();
    await fixture.whenStable(); // httpResource()'s state update lands a microtask later
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-digital-clock')).toBeTruthy();
  });

  it('sets the document title and meta description from the resolved tool', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('toolSlug', 'digital-clock');
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(TestBed.inject(Title).getTitle()).toBe('Digital Clock');
  });

  it('falls back to ToolComingSoon for a slug with no real component yet', async () => {
    const fixture = TestBed.createComponent(ToolShell);
    fixture.componentRef.setInput('toolSlug', 'countdown-timer');
    fixture.componentRef.setInput('title', 'Time & Date Tools');
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url.endsWith('tool-registry.json')).flush(sampleTools);
    await fixture.whenStable(); // httpResource()'s state update lands a microtask later
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-tool-coming-soon')).toBeTruthy();
    expect(el.querySelector('app-digital-clock')).toBeNull();
  });
});
