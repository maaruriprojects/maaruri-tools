import { Service, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap, timer } from 'rxjs';

// How long a request must stay in flight before the spinner is allowed to
// show — docs/design/08-animation-motion.md §3: "the spinner does not
// render at all until the wait has already lasted ~200ms." A wait that
// resolves before that never shows a spinner at all.
export const SPINNER_DEBOUNCE_MS = 200;

// Tracks in-flight HTTP requests as a count, not a boolean — requests
// overlap (e.g. two components fetching at once), and the spinner must
// stay visible until the *last* one finishes, not the first. Incremented/
// decremented by loading.interceptor.ts for every request through
// BaseApiService (core/api) — the one entry point for HTTP, per Day 9.
@Service()
export class LoadingService {
  private readonly requestCountSignal = signal(0);
  readonly requestCount = this.requestCountSignal.asReadonly();

  // True the instant any request is in flight — not debounced. Use this
  // for logic; use `isSpinnerVisible` for anything rendered on screen.
  readonly isLoading = computed(() => this.requestCountSignal() > 0);

  // Debounced for display: becomes true only after `isLoading` has been
  // continuously true for SPINNER_DEBOUNCE_MS, so a fast local-JSON read
  // never flashes a spinner. Becomes false immediately the moment loading
  // ends — only the *appearance* is delayed, never the disappearance.
  // `toObservable(isLoading)` re-emits on every change, so switchMap
  // naturally cancels the pending timer the instant loading flips back to
  // false before it fires — no separate "immediate hide" branch needed.
  readonly isSpinnerVisible = toSignal(
    toObservable(this.isLoading).pipe(
      switchMap((loading) =>
        loading ? timer(SPINNER_DEBOUNCE_MS).pipe(map(() => true)) : of(false),
      ),
    ),
    { initialValue: false },
  );

  increment(): void {
    this.requestCountSignal.update((count) => count + 1);
  }

  decrement(): void {
    this.requestCountSignal.update((count) => Math.max(0, count - 1));
  }
}
