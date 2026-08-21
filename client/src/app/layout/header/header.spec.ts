import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppHeader } from './header';
import { ThemeService } from '../../core/theme/theme.service';
import { SearchIndexService } from '../../features/tools/search-index.service';

describe('AppHeader', () => {
  let themeService: ThemeService;

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AppHeader, RouterTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        ThemeService,
        { provide: SearchIndexService, useValue: { entries: signal([]) } },
      ],
    }).compileComponents();

    themeService = TestBed.inject(ThemeService);
  }

  it('renders the wordmark', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const wordmark = fixture.nativeElement.querySelector('.app-header__wordmark');
    expect(wordmark).toBeTruthy();
    expect(wordmark.textContent).toContain('Maaruri Tools');
  });

  it('renders all 11 category nav links', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const navLinks = fixture.nativeElement.querySelectorAll('.app-header__nav-link');
    expect(navLinks.length).toBe(11);
  });

  it('renders the theme toggle button', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const toggle = fixture.nativeElement.querySelector('.app-header__theme-toggle');
    expect(toggle).toBeTruthy();
  });

  it('calls themeService.toggle() when theme toggle is clicked', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const toggleSpy = vi.spyOn(themeService, 'toggle');
    const toggle = fixture.nativeElement.querySelector('.app-header__theme-toggle');
    toggle.click();

    expect(toggleSpy).toHaveBeenCalledOnce();
  });

  it('toggles mobile menu open state', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    expect(component.mobileMenuOpen()).toBe(false);

    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);

    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('toggles mobile search open state', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    expect(component.mobileSearchOpen()).toBe(false);

    component.toggleMobileSearch();
    expect(component.mobileSearchOpen()).toBe(true);
  });

  it('closes mobile menu when mobile search opens', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    component.toggleMobileMenu();
    expect(component.mobileMenuOpen()).toBe(true);

    component.toggleMobileSearch();
    expect(component.mobileSearchOpen()).toBe(true);
    expect(component.mobileMenuOpen()).toBe(false);
  });

  it('renders search bar on desktop section', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const searchDesktop = fixture.nativeElement.querySelector('.app-header__search-desktop');
    expect(searchDesktop).toBeTruthy();
  });

  it('category links are locale-aware', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppHeader);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance;
    const route = component.categoryRoute('health-fitness');
    expect(route).toEqual(['/', 'en-us', 'health-fitness']);
  });
});
