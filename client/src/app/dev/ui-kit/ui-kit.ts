import {
  Component,
  Injector,
  computed,
  inject,
  input,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { AppBadge, BadgeColor } from '../../shared/components/badge/badge';
import { AppButton, ButtonVariant } from '../../shared/components/button/button';
import { AppCard, CardLink } from '../../shared/components/card/card';
import { AppLoadingSpinner } from '../../shared/components/loading-spinner/loading-spinner';
import { AppPagination } from '../../shared/components/pagination/pagination';
import { AppSearchBar } from '../../shared/components/search-bar/search-bar';
import { AppToolTile } from '../../shared/components/tool-tile/tool-tile';
import { AppCategoryTile } from '../../shared/components/category-tile/category-tile';
import { AppTextInput } from '../../shared/components/text-input/text-input';
import { AppSelectControl } from '../../shared/components/select-control/select-control';
import { AppTextareaControl } from '../../shared/components/textarea-control/textarea-control';
import { AppModal } from '../../shared/components/modal/modal';
import { AppEmptyState } from '../../shared/components/empty-state/empty-state';
import { AppCopyButton } from '../../shared/components/copy-button/copy-button';
import { AppAdBanner } from '../../shared/ad-components/ad-banner/ad-banner';
import { AppAdRectangle } from '../../shared/ad-components/ad-rectangle/ad-rectangle';
import { AppAdInArticle } from '../../shared/ad-components/ad-in-article/ad-in-article';
import { BaseApiService } from '../../core/api/base-api.service';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import { LoadingService } from '../../core/loading/loading.service';
import { SearchIndexService } from '../../features/tools/search-index.service';
import type { SearchIndexEntry } from '../../shared/models/search-index-entry';
import type { ToolMeta } from '../../shared/models/tool-meta';
import { ToastService } from '../../core/toast/toast.service';

const SLOW_REQUEST_MS = 2000;
const FAST_REQUEST_MS = 50;
const MOCK_LIST_PAGE_SIZE = 10;

const PLACEHOLDER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%235B6B74'/%3E%3C/svg%3E";

interface CardDemoItem {
  readonly title: string;
  readonly description: string;
  readonly link: CardLink;
}

const DEMO_TOOL: ToolMeta = {
  slug: 'bmi-calculator',
  title: 'BMI Calculator',
  category: 'health-fitness',
  shortDescription: 'Calculate your Body Mass Index from height and weight.',
  componentKey: 'bmi-calculator',
  seoDescription: 'A BMI calculator.',
  icon: 'heart-rate-monitor',
};

@Component({
  selector: 'app-ui-kit',
  imports: [
    AppButton,
    AppBadge,
    AppLoadingSpinner,
    AppCard,
    AppSearchBar,
    AppPagination,
    AppToolTile,
    AppCategoryTile,
    AppTextInput,
    AppSelectControl,
    AppTextareaControl,
    AppModal,
    AppEmptyState,
    AppCopyButton,
    AppAdBanner,
    AppAdRectangle,
    AppAdInArticle,
  ],
  templateUrl: './ui-kit.html',
  styleUrl: './ui-kit.scss',
})
export class UiKit {
  private readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  private readonly api = inject(BaseApiService);
  private readonly injector = inject(Injector);
  protected readonly searchIndexService = inject(SearchIndexService);

  readonly title = input('');

  protected readonly buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
  protected readonly badgeColors: BadgeColor[] = ['success', 'warning', 'error', 'info', 'neutral'];
  protected readonly placeholderIcon = PLACEHOLDER_ICON;
  protected readonly demoTool = DEMO_TOOL;

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

  protected readonly relatedToolCard: CardDemoItem = {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data.',
    link: ['/', DEFAULT_LOCALE.code, 'development-web-tools', 'json-formatter'],
  };

  protected readonly categoryTileDemo = {
    segment: 'health-fitness' as const,
    title: 'Health & Fitness',
    toolCount: 12,
    icon: 'heart-rate-monitor',
  };

  protected readonly selectOptions = [
    { value: 'kg', label: 'Kilograms' },
    { value: 'lb', label: 'Pounds' },
    { value: 'st', label: 'Stones' },
  ];

  protected readonly modalOpen = signal(false);
  protected readonly textInputValue = signal('');
  protected readonly selectValue = signal('kg');
  protected readonly textareaValue = signal('');

  protected throwTestError(): void {
    throw new Error('Deliberate test error from /dev/ui-kit — verifying GlobalErrorHandler.');
  }

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

  protected triggerFailedRequest(): void {
    runInInjectionContext(this.injector, () => {
      this.api.getResource(() => '/does-not-exist.json', { defaultValue: undefined });
    });
  }

  protected readonly lastSelectedTool = signal<SearchIndexEntry | null>(null);

  protected onSearchSelect(entry: SearchIndexEntry): void {
    this.lastSelectedTool.set(entry);
  }

  protected readonly mockListItems: readonly string[] = Array.from(
    { length: 45 },
    (_, i) => `Item ${i + 1}`,
  );
  protected readonly mockListPage = signal(1);
  protected readonly mockListPageItems = computed(() => {
    const start = (this.mockListPage() - 1) * MOCK_LIST_PAGE_SIZE;
    return this.mockListItems.slice(start, start + MOCK_LIST_PAGE_SIZE);
  });

  protected onMockListPageChange(page: number): void {
    this.mockListPage.set(page);
  }

  protected openModal(): void {
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
  }

  protected onCopyCopied(): void {
    // Toast is fired by CopyButton itself
  }
}
