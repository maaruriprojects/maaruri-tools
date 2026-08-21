import { provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppShell } from './shell';
import { ThemeService } from '../../core/theme/theme.service';
import { SearchIndexService } from '../../features/tools/search-index.service';

describe('AppShell', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AppShell, RouterTestingModule],
      providers: [
        provideZonelessChangeDetection(),
        ThemeService,
        { provide: SearchIndexService, useValue: { entries: signal([]) } },
      ],
    }).compileComponents();
  }

  it('renders a skip link', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();
    await fixture.whenStable();

    const skipLink = fixture.nativeElement.querySelector('.app-shell__skip-link');
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
    expect(skipLink.textContent).toContain('Skip to content');
  });

  it('renders header, main, and footer in correct order', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.nativeElement.querySelector('header[role="banner"]');
    const main = fixture.nativeElement.querySelector('main#main-content');
    const footer = fixture.nativeElement.querySelector('footer[role="contentinfo"]');

    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(footer).toBeTruthy();

    const order = [
      header.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING,
      main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ];
    expect(order[0]).toBeTruthy();
    expect(order[1]).toBeTruthy();
  });

  it('skip link is off-screen by default', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();
    await fixture.whenStable();

    const skipLink = fixture.nativeElement.querySelector('.app-shell__skip-link');
    const style = getComputedStyle(skipLink);
    expect(style.top).not.toBe('0px');
  });

  it('renders router-outlet inside main', async () => {
    await setup();
    const fixture = TestBed.createComponent(AppShell);
    fixture.detectChanges();
    await fixture.whenStable();

    const main = fixture.nativeElement.querySelector('main#main-content');
    const routerOutlet = main.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
