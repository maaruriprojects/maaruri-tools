import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppFooter } from './footer';

describe('AppFooter', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AppFooter, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
  }

  it('renders all 11 category links', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll('.app-footer__category-list a');
    expect(links.length).toBe(11);
  });

  it('renders static page links (About, Contact, Opportunities)', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll('.app-footer__page-list a');
    const texts = Array.from(links, (el) => (el as HTMLElement).textContent?.trim());
    expect(texts).toContain('About');
    expect(texts).toContain('Contact');
    expect(texts).toContain('Opportunities');
  });

  it('renders a copyright line', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();
    await fixture.whenStable();

    const copyright = fixture.nativeElement.querySelector('.app-footer__copyright');
    expect(copyright).toBeTruthy();
    expect(copyright.textContent).toContain('Maaruri Tools');
  });

  it('category links are locale-aware', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppFooter);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    const route = component.categoryRoute('time-date-tools');
    expect(route).toEqual(['/', 'en-us', 'time-date-tools']);
  });
});
