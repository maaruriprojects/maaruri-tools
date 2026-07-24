import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('toggles the whole page between light and dark via the test button', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    expect(document.documentElement.getAttribute('data-theme')).toBeNull();

    const button = (fixture.nativeElement as HTMLElement).querySelector('button.theme-toggle');
    (button as HTMLButtonElement).click();
    fixture.detectChanges();
    TestBed.tick();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
