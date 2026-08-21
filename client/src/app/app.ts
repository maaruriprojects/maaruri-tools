import { Component, inject } from '@angular/core';
import { LoadingService } from './core/loading/loading.service';
import { BreadcrumbService } from './core/seo/breadcrumb.service';
import { ToastService } from './core/toast/toast.service';
import { AppShell } from './layout/shell/shell';
import { AppLoadingOverlay } from './shared/components/loading-overlay/loading-overlay';
import { AppToast } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  imports: [AppShell, AppLoadingOverlay, AppToast],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly loadingService = inject(LoadingService);
  protected readonly toastService = inject(ToastService);
  protected readonly breadcrumbService = inject(BreadcrumbService);
}
