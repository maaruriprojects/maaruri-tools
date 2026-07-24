import { TestBed } from '@angular/core/testing';
import { LoadingService, SPINNER_DEBOUNCE_MS } from './loading.service';

describe('LoadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('isLoading is true only while requestCount > 0, supporting overlapping requests', () => {
    const service = TestBed.inject(LoadingService);

    expect(service.isLoading()).toBe(false);

    service.increment();
    expect(service.isLoading()).toBe(true);
    expect(service.requestCount()).toBe(1);

    service.increment(); // a second, overlapping request
    expect(service.requestCount()).toBe(2);

    service.decrement(); // first one finishes
    expect(service.isLoading()).toBe(true); // still loading — second one is in flight
    expect(service.requestCount()).toBe(1);

    service.decrement(); // second one finishes
    expect(service.isLoading()).toBe(false);
    expect(service.requestCount()).toBe(0);
  });

  it('decrement() never goes below zero', () => {
    const service = TestBed.inject(LoadingService);

    service.decrement();

    expect(service.requestCount()).toBe(0);
  });

  it('a fast request that resolves before the debounce never shows the spinner', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(LoadingService);

      service.increment();
      TestBed.tick();
      vi.advanceTimersByTime(SPINNER_DEBOUNCE_MS - 1);
      TestBed.tick();
      service.decrement();
      TestBed.tick();
      vi.advanceTimersByTime(1000);
      TestBed.tick();

      expect(service.isSpinnerVisible()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('a slow request shows the spinner only once the debounce has elapsed', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(LoadingService);

      service.increment();
      TestBed.tick();
      expect(service.isSpinnerVisible()).toBe(false);

      vi.advanceTimersByTime(SPINNER_DEBOUNCE_MS - 1);
      TestBed.tick();
      expect(service.isSpinnerVisible()).toBe(false);

      vi.advanceTimersByTime(1);
      TestBed.tick();
      expect(service.isSpinnerVisible()).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it('hides the spinner immediately once loading ends, even after it was visible', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(LoadingService);

      service.increment();
      TestBed.tick();
      vi.advanceTimersByTime(SPINNER_DEBOUNCE_MS);
      TestBed.tick();
      expect(service.isSpinnerVisible()).toBe(true);

      service.decrement();
      TestBed.tick();

      expect(service.isSpinnerVisible()).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
