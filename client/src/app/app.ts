import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/loading/loading.service';
import { BreadcrumbService } from './core/seo/breadcrumb.service';
import { ThemeService } from './core/theme/theme.service';
import { ToastService } from './core/toast/toast.service';
import { AppBreadcrumb } from './shared/components/breadcrumb/breadcrumb';
import { AppLoadingOverlay } from './shared/components/loading-overlay/loading-overlay';
import { AppToast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLoadingOverlay, AppToast, AppBreadcrumb],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly themeService = inject(ThemeService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly toastService = inject(ToastService);
  protected readonly breadcrumbService = inject(BreadcrumbService);
}
