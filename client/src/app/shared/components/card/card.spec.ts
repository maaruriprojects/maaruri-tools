import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppCard } from './card';

@Component({
  selector: 'app-card-host',
  imports: [AppCard],
  template: `
    <app-card [title]="'BMI Calculator'" [description]="'Calculate your BMI.'" [link]="link">
      <span class="projected">footer content</span>
    </app-card>
  `,
})
class HostComponent {
  link = ['/', 'en-us', 'health-fitness', 'bmi-calculator'];
}

describe('AppCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders title, description, and projected content, as a single link', async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.app-card__title')?.textContent).toBe('BMI Calculator');
    expect(el.querySelector('.app-card__description')?.textContent).toBe('Calculate your BMI.');
    expect(el.querySelector('.projected')?.textContent).toBe('footer content');

    const links = el.querySelectorAll('a');
    expect(links).toHaveLength(1);
    expect(links[0].classList).toContain('app-card');
    expect(links[0].getAttribute('href')).toBe('/en-us/health-fitness/bmi-calculator');
  });

  it('renders no description paragraph when none is given', async () => {
    await TestBed.configureTestingModule({ imports: [AppCard] }).compileComponents();
    const fixture = TestBed.createComponent(AppCard);
    fixture.componentRef.setInput('title', 'Digital Clock');
    fixture.componentRef.setInput('link', '/en-us/time-date-tools/digital-clock');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.app-card__description')).toBeNull();
  });

  it('renders no image when imageUrl is not given, and a lazy-loaded one when it is', async () => {
    await TestBed.configureTestingModule({ imports: [AppCard] }).compileComponents();
    const fixture = TestBed.createComponent(AppCard);
    fixture.componentRef.setInput('title', 'Digital Clock');
    fixture.componentRef.setInput('link', '/en-us/time-date-tools/digital-clock');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeNull();

    fixture.componentRef.setInput('imageUrl', '/assets/icons/clock.svg');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/assets/icons/clock.svg');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('alt')).toBe('Digital Clock'); // falls back to title
  });

  it('uses imageAlt over the title fallback when provided', async () => {
    await TestBed.configureTestingModule({ imports: [AppCard] }).compileComponents();
    const fixture = TestBed.createComponent(AppCard);
    fixture.componentRef.setInput('title', 'Digital Clock');
    fixture.componentRef.setInput('link', '/en-us/time-date-tools/digital-clock');
    fixture.componentRef.setInput('imageUrl', '/assets/icons/clock.svg');
    fixture.componentRef.setInput('imageAlt', 'A stylized clock face');
    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('alt')).toBe('A stylized clock face');
  });
});
