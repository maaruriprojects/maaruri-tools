import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/loading/loading.service';
import { ThemeService } from './core/theme/theme.service';
import { AppLoadingOverlay } from './shared/components/loading-overlay/loading-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLoadingOverlay],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly themeService = inject(ThemeService);
  protected readonly loadingService = inject(LoadingService);
}
