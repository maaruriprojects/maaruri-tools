import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { LoadingService } from './core/loading/loading.service';
import { ToastService } from './core/toast/toast.service';

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

  it('renders the global loading overlay, driven by LoadingService', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    const overlay = (fixture.nativeElement as HTMLElement).querySelector('app-loading-overlay');
    expect(overlay).toBeTruthy();

    const loadingService = TestBed.inject(LoadingService);
    expect(loadingService.isSpinnerVisible()).toBe(false);
  });

  it('renders the toast container, wired to ToastService', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    TestBed.tick();

    expect((fixture.nativeElement as HTMLElement).querySelector('app-toast')).toBeTruthy();

    const toastService = TestBed.inject(ToastService);
    toastService.success('Copied 22.4 to clipboard.');
    fixture.detectChanges();

    const toastEl = (fixture.nativeElement as HTMLElement).querySelector('.app-toast');
    expect(toastEl?.textContent).toContain('Copied 22.4 to clipboard.');
  });
});
