import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppAdRectangle } from './ad-rectangle';

describe('AppAdRectangle', () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [AppAdRectangle],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppAdRectangle);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  it('renders the Advertisement label', async () => {
    const fixture = await setup();
    expect(fixture.nativeElement.textContent).toContain('Advertisement');
  });

  it('has 300x250 dimensions', async () => {
    const fixture = await setup();
    const el = fixture.nativeElement.querySelector('.app-ad-rectangle');
    expect(el).toBeTruthy();
  });
});
