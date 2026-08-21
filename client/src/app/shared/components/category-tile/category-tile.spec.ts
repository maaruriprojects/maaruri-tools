import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppCategoryTile } from './category-tile';

describe('AppCategoryTile', () => {
  async function setup(inputs: Record<string, unknown> = {}) {
    await TestBed.configureTestingModule({
      imports: [AppCategoryTile, RouterTestingModule],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppCategoryTile);
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key, value);
    });
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders the title and tool count', async () => {
    const fixture = await setup({
      categorySegment: 'health-fitness',
      title: 'Health & Fitness',
      toolCount: 12,
      icon: 'heart-rate-monitor',
    });
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.app-category-tile__title')?.textContent).toContain('Health & Fitness');
    expect(el.querySelector('.app-category-tile__count')?.textContent).toContain('12 tools');
  });

  it('renders the category icon', async () => {
    const fixture = await setup({
      categorySegment: 'time-date-tools',
      title: 'Time & Date',
      toolCount: 5,
      icon: 'clock',
    });
    expect(fixture.nativeElement.querySelector('svg.app-icon')).toBeTruthy();
  });

  it('applies the category color CSS variable', async () => {
    const fixture = await setup({
      categorySegment: 'finance-money-tools',
      title: 'Finance & Money',
      toolCount: 8,
      icon: 'coin',
    });
    const tile = fixture.nativeElement.querySelector('.app-category-tile') as HTMLElement;
    expect(tile.style.getPropertyValue('--tile-category-color')).toContain('cat-color-finance');
  });

  it('links to the locale-aware category route', async () => {
    const fixture = await setup({
      categorySegment: 'development-web-tools',
      title: 'Development & Web',
      toolCount: 15,
      icon: 'code',
    });
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toContain('development-web-tools');
  });
});
