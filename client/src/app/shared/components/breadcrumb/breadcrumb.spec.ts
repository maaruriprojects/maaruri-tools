import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import type { BreadcrumbItem } from '../../models/breadcrumb-item';
import { AppBreadcrumb } from './breadcrumb';

describe('AppBreadcrumb', () => {
  const trail: BreadcrumbItem[] = [
    { label: 'Home', url: '/en-us' },
    { label: 'Health & Fitness', url: '/en-us/health-fitness' },
    { label: 'Bmi Calculator', url: '/en-us/health-fitness/bmi-calculator' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  async function createFixture(items: readonly BreadcrumbItem[]) {
    await TestBed.configureTestingModule({ imports: [AppBreadcrumb] }).compileComponents();
    const fixture = TestBed.createComponent(AppBreadcrumb);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    return fixture;
  }

  it('renders nothing for an empty trail', async () => {
    const fixture = await createFixture([]);
    expect(fixture.nativeElement.querySelector('.app-breadcrumb')).toBeNull();
  });

  it('renders nothing for a single-item trail (current page only)', async () => {
    const fixture = await createFixture([{ label: 'Home', url: '/en-us' }]);
    expect(fixture.nativeElement.querySelector('.app-breadcrumb')).toBeNull();
  });

  it('renders every crumb as a link except the last, which is plain text', async () => {
    const fixture = await createFixture(trail);
    const el = fixture.nativeElement as HTMLElement;

    const links = Array.from(el.querySelectorAll('.app-breadcrumb__link'));
    expect(links.map((a) => a.textContent?.trim())).toEqual(['Home', 'Health & Fitness']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/en-us', '/en-us/health-fitness']);

    const current = el.querySelector('.app-breadcrumb__current');
    expect(current?.textContent?.trim()).toBe('Bmi Calculator');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('renders items in order inside a labeled nav landmark', async () => {
    const fixture = await createFixture(trail);
    const nav = fixture.nativeElement.querySelector('nav.app-breadcrumb');

    expect(nav?.getAttribute('aria-label')).toBe('Breadcrumb');
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('.app-breadcrumb__item');
    const labels = Array.from(items).map((li) => li.textContent?.trim());
    expect(labels).toEqual(['Home', 'Health & Fitness', 'Bmi Calculator']);
  });
});
