import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppAdBanner } from './ad-banner';

describe('AppAdBanner', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AppAdBanner],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppAdBanner);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders the Advertisement label', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.textContent).toContain('Advertisement');
  });

  it('has the placeholder background', async () => {
    const fixture = await setup();
    const el = fixture.nativeElement.querySelector('.app-ad-banner');
    expect(el).toBeTruthy();
  });
});
