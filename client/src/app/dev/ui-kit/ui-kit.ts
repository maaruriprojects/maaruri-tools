import { Component, Injector, inject, input, runInInjectionContext } from '@angular/core';
import { AppBadge, BadgeColor } from '../../shared/components/badge/badge';
import { AppButton, ButtonVariant } from '../../shared/components/button/button';
import { AppCard, CardLink } from '../../shared/components/card/card';
import { AppLoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { BaseApiService } from '../../core/api/base-api.service';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { LoadingService } from '../../core/loading/loading.service';
import { ToastService } from '../../core/toast/toast.service';

const SLOW_REQUEST_MS = 2000; // well past SPINNER_DEBOUNCE_MS — spinner should show
const FAST_REQUEST_MS = 50; // well under it — spinner should never show

// A plain gray circle — a stand-in "icon" so the card grid demo exercises
// the real <img loading="lazy"> path without needing real icon assets
// (doc03's icon system isn't built yet).
const PLACEHOLDER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%235B6B74'/%3E%3C/svg%3E";

interface CardDemoItem {
  readonly title: string;
  readonly description: string;
  readonly link: CardLink;
}

// Internal visual-QA page — renders every shared component built so far.
// Not linked anywhere; reached only via direct navigation to /dev/ui-kit,
// and gated by devRouteGuard (core/guards/dev-route.guard.ts).
@Component({
  selector: 'app-ui-kit',
  imports: [AppButton, AppBadge, AppLoadingSpinner, AppCard],
  templateUrl: './ui-kit.html',
  styleUrl: './ui-kit.scss',
})
export class UiKit {
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly api = inject(BaseApiService);
  private readonly injector = inject(Injector);

  readonly title = input('');

  protected readonly buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
  protected readonly badgeColors: BadgeColor[] = ['success', 'warning', 'error', 'info', 'neutral'];
  protected readonly placeholderIcon = PLACEHOLDER_ICON;

  // Grid usage: category/tool-listing style, several cards side by side.
  protected readonly cardGridItems: CardDemoItem[] = [
    {
      title: 'Digital Clock',
      description: 'A live digital clock with 12/24-hour display.',
      link: ['/', DEFAULT_LOCALE.code, 'time-date-tools', 'digital-clock'],
    },
    {
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index from height and weight.',
      link: ['/', DEFAULT_LOCALE.code, 'health-fitness', 'bmi-calculator'],
    },
    {
      title: 'Loan Calculator',
      description: 'Estimate monthly payments and total interest on a loan.',
      link: ['/', DEFAULT_LOCALE.code, 'finance-money-tools', 'loan-calculator'],
    },
  ];

  // Standalone usage: a single related-tool suggestion, no image, with
  // projected content (a badge) beyond the base title/description shape —
  // proving ng-content over a one-off "badge" input.
  protected readonly relatedToolCard: CardDemoItem = {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data.',
    link: ['/', DEFAULT_LOCALE.code, 'development-web-tools', 'json-formatter'],
  };

  // Verifies GlobalErrorHandler end-to-end: throwing here should log full
  // detail (check the console) and redirect to the friendly ErrorPage.
  protected throwTestError(): void {
    throw new Error('Deliberate test error from /dev/ui-kit — verifying GlobalErrorHandler.');
  }

  // Drives the real LoadingService (the same one loading.interceptor.ts
  // drives for actual HTTP requests) through the exact timeline a slow or
  // fast request would produce, to verify the global overlay's debounce:
  // the slow one should show the spinner after ~200ms, the fast one never.
  protected simulateSlowRequest(): void {
    this.simulateRequest(SLOW_REQUEST_MS);
  }

  protected simulateFastRequest(): void {
    this.simulateRequest(FAST_REQUEST_MS);
  }

  private simulateRequest(durationMs: number): void {
    this.loadingService.increment();
    setTimeout(() => this.loadingService.decrement(), durationMs);
  }

  // One of each severity, so multiple toasts stacking (rather than
  // overwriting each other) is visible by clicking a few of these in a row.
  protected showSuccessToast(): void {
    this.toastService.success('Copied 22.4 to clipboard.');
  }

  protected showErrorToast(): void {
    this.toastService.error('Live exchange rates failed to load. Showing last known values.');
  }

  protected showWarningToast(): void {
    this.toastService.warning('Approaching the daily limit for this tool.');
  }

  protected showInfoToast(): void {
    this.toastService.info('Results update automatically as you type.');
  }

  // Real, deliberately-failing HTTP request through BaseApiService — the
  // actual chain a live failure exercises: loadingInterceptor,
  // httpErrorInterceptor (logs it, calls ToastService.error()), and this
  // resource's own `.error()` signal. httpResource() needs an injection
  // context, which a click handler isn't on its own, hence
  // runInInjectionContext; see Day 9's ToolRegistryService for the normal
  // (field-initializer) usage.
  protected triggerFailedRequest(): void {
    runInInjectionContext(this.injector, () => {
      this.api.getResource(() => '/does-not-exist.json', { defaultValue: undefined });
    });
  }
}
