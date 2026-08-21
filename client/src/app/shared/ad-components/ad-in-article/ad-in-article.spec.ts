import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppAdInArticle } from './ad-in-article';

describe('AppAdInArticle', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AppAdInArticle],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppAdInArticle);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders the Advertisement label', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.textContent).toContain('Advertisement');
  });

  it('has the ad-in-article class', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.querySelector('.app-ad-in-article')).toBeTruthy();
  });
});
