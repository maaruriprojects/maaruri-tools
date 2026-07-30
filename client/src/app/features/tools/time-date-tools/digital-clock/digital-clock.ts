import { DatePipe, isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';

type TimeFormat = '12h' | '24h';

const TICK_MS = 1000;

// The real tool behind the "digital-clock" registry entry (see
// tool-registry.json / search-index.json) — rendered by ToolShell
// (features/tools/tool-shell/tool-shell.ts) when it resolves componentKey
// 'DigitalClock'. Lives under its category folder (time-date-tools), not
// shared/components/, since it's feature-specific, not a reusable UI
// primitive — same reasoning ARCHITECTURE.md gives for the whole
// features/tools/<category>/ split.
//
// `ngSkipHydration`: the textbook case Angular's own hydration docs use it
// for — a live clock's server-rendered second can never match the client's
// first tick a moment later, so this subtree is skipped during hydration
// and rendered fresh client-side instead, avoiding a guaranteed
// hydration-mismatch on every load.
@Component({
  selector: 'app-digital-clock',
  imports: [DatePipe],
  templateUrl: './digital-clock.html',
  styleUrl: './digital-clock.scss',
  host: { ngSkipHydration: 'true' },
})
export class DigitalClock {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly card = viewChild<ElementRef<HTMLElement>>('card');

  protected readonly now = signal(new Date());
  protected readonly format = signal<TimeFormat>('12h');
  protected readonly showSeconds = signal(true);
  protected readonly showUtc = signal(false);
  protected readonly isFullscreen = signal(false);

  protected readonly is24Hour = computed(() => this.format() === '24h');
  protected readonly isoTimestamp = computed(() => this.now().toISOString());

  // DST-aware — derived from `now()` (via Intl.formatToParts) rather than
  // computed once, so a DST transition during a long-open tab still shows
  // the correct offset instead of a stale one.
  protected readonly utcOffset = computed(() => resolveUtcOffset(this.now()));

  // The IANA zone name never changes without a browser restart (unlike the
  // offset above) — a plain property, not a signal, per
  // CODING_STANDARDS.md's "value set once, never reassigned" rule. Only
  // meaningful client-side: Node's Intl would report the *build machine's*
  // timezone during SSR, not the visitor's, but ngSkipHydration means this
  // is replaced by the real client-side value before it matters.
  protected readonly timeZoneName = this.isBrowser
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'UTC';

  protected readonly fullscreenSupported =
    this.isBrowser && typeof document !== 'undefined' && document.fullscreenEnabled;

  constructor() {
    if (!this.isBrowser) {
      return;
    }

    const destroyRef = inject(DestroyRef);

    const intervalId = setInterval(() => this.now.set(new Date()), TICK_MS);
    destroyRef.onDestroy(() => clearInterval(intervalId));

    // Keeps isFullscreen in sync when the user exits via Escape (or any
    // other browser-native path) instead of our own toggle button.
    document.addEventListener('fullscreenchange', this.onFullscreenChange);
    destroyRef.onDestroy(() =>
      document.removeEventListener('fullscreenchange', this.onFullscreenChange),
    );
  }

  protected toggleFormat(): void {
    this.format.update((current) => (current === '24h' ? '12h' : '24h'));
  }

  protected toggleSeconds(): void {
    this.showSeconds.update((current) => !current);
  }

  protected toggleUtc(): void {
    this.showUtc.update((current) => !current);
  }

  protected async toggleFullscreen(): Promise<void> {
    const element = this.card()?.nativeElement;
    if (!element) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await element.requestFullscreen();
    }
  }

  private readonly onFullscreenChange = (): void => {
    this.isFullscreen.set(document.fullscreenElement !== null);
  };
}

// 'longOffset' zero-pads the hour ("GMT+05:30"), unlike 'shortOffset'
// ("GMT+5:30") — the template prepends its own "UTC" label, so the "GMT"/
// "UTC" prefix ICU returns here is stripped, leaving just "+05:30".
function resolveUtcOffset(date: Date): string {
  const parts = new Intl.DateTimeFormat('en', { timeZoneName: 'longOffset' }).formatToParts(date);
  const offset = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+00:00';
  return offset.replace(/^(GMT|UTC)/, '') || '+00:00';
}
