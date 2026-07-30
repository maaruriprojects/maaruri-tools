import { TestBed } from '@angular/core/testing';
import { DigitalClock } from './digital-clock';

describe('DigitalClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // A fixed, known instant so digit assertions aren't flaky/time-of-day
    // dependent. UTC so the exact wall-clock digits depend only on the
    // test runner's local timezone for the local-time assertions below.
    vi.setSystemTime(new Date('2026-07-27T09:04:05Z'));
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createClock() {
    const fixture = TestBed.createComponent(DigitalClock);
    fixture.detectChanges();
    return fixture;
  }

  it('renders hour, minute, and (by default) second segments', () => {
    const fixture = createClock();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelectorAll('.digital-clock__segment')).toHaveLength(3);
    expect(el.querySelector('.digital-clock__segment--seconds')).toBeTruthy();
  });

  it('ticks every second without manual intervention', () => {
    const fixture = createClock();
    const el = fixture.nativeElement as HTMLElement;
    const secondsBefore = el.querySelector('.digital-clock__segment--seconds')?.textContent;

    vi.advanceTimersByTime(1000);
    fixture.detectChanges();

    const secondsAfter = el.querySelector('.digital-clock__segment--seconds')?.textContent;
    expect(secondsAfter).not.toBe(secondsBefore);
  });

  it('toggles between 12-hour and 24-hour format', () => {
    const fixture = createClock();
    const el = fixture.nativeElement as HTMLElement;

    const formatButton = Array.from(el.querySelectorAll('.digital-clock__toggle')).find((btn) =>
      btn.textContent?.includes('Hour'),
    ) as HTMLButtonElement;

    expect(formatButton.getAttribute('aria-pressed')).toBe('false');
    expect(el.querySelector('.digital-clock__meridiem')).toBeTruthy();

    formatButton.click();
    fixture.detectChanges();

    expect(formatButton.getAttribute('aria-pressed')).toBe('true');
    expect(el.querySelector('.digital-clock__meridiem')).toBeNull();
  });

  it('toggles seconds visibility', () => {
    const fixture = createClock();
    const el = fixture.nativeElement as HTMLElement;

    const secondsButton = Array.from(el.querySelectorAll('.digital-clock__toggle')).find((btn) =>
      btn.textContent?.includes('Seconds'),
    ) as HTMLButtonElement;

    expect(el.querySelector('.digital-clock__segment--seconds')).toBeTruthy();

    secondsButton.click();
    fixture.detectChanges();

    expect(el.querySelector('.digital-clock__segment--seconds')).toBeNull();
  });

  it('toggles UTC time visibility', () => {
    const fixture = createClock();
    const el = fixture.nativeElement as HTMLElement;

    const utcButton = Array.from(el.querySelectorAll('.digital-clock__toggle')).find((btn) =>
      btn.textContent?.includes('UTC Time'),
    ) as HTMLButtonElement;

    expect(el.querySelector('.digital-clock__utc')).toBeNull();

    utcButton.click();
    fixture.detectChanges();

    expect(el.querySelector('.digital-clock__utc')).toBeTruthy();
  });

  it('shows the UTC offset next to the timezone name', () => {
    const fixture = createClock();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.digital-clock__timezone')?.textContent).toMatch(
      /UTC[+-]\d{2}:\d{2}$/,
    );
  });

  it('clears the interval on destroy — no leaked timer', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const fixture = createClock();

    fixture.destroy();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
