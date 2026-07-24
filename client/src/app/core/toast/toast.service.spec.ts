import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('success/error/warning/info each add a toast of the matching severity', () => {
    const service = TestBed.inject(ToastService);

    service.success('Copied 22.4 to clipboard.');
    service.error('Live rates failed to load. Showing last known values.');
    service.warning('Approaching the daily limit for this tool.');
    service.info('Results update automatically as you type.');

    const severities = service.toasts().map((toast) => toast.severity);
    expect(severities).toEqual(['success', 'error', 'warning', 'info']);
  });

  it('multiple toasts stack rather than overwriting each other', () => {
    const service = TestBed.inject(ToastService);

    service.error('First failure.');
    service.error('Second failure.');

    expect(service.toasts()).toHaveLength(2);
    expect(service.toasts()[0].message).toBe('First failure.');
    expect(service.toasts()[1].message).toBe('Second failure.');
    expect(service.toasts()[0].id).not.toBe(service.toasts()[1].id);
  });

  it('dismiss() removes only the specified toast', () => {
    const service = TestBed.inject(ToastService);

    service.success('First.');
    service.success('Second.');
    const [first, second] = service.toasts();

    service.dismiss(first.id);

    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0].id).toBe(second.id);
  });

  it('auto-dismisses a success toast after 3s', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(ToastService);
      service.success('Copied 22.4 to clipboard.');

      vi.advanceTimersByTime(2999);
      expect(service.toasts()).toHaveLength(1);

      vi.advanceTimersByTime(1);
      expect(service.toasts()).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('auto-dismisses an error toast later than a success toast (errors linger longer)', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(ToastService);
      service.error('Live rates failed to load.');

      vi.advanceTimersByTime(3000); // when a success toast would already be gone
      expect(service.toasts()).toHaveLength(1);

      vi.advanceTimersByTime(4000); // 7s total
      expect(service.toasts()).toHaveLength(0);
    } finally {
      vi.useRealTimers();
    }
  });

  it('auto-dismissing one toast does not affect an unrelated, still-live toast', () => {
    vi.useFakeTimers();
    try {
      const service = TestBed.inject(ToastService);
      service.success('Short-lived.'); // 3s
      service.error('Long-lived.'); // 7s

      vi.advanceTimersByTime(3000);

      expect(service.toasts()).toHaveLength(1);
      expect(service.toasts()[0].message).toBe('Long-lived.');
    } finally {
      vi.useRealTimers();
    }
  });
});
