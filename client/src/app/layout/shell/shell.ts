import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbService } from '../../core/seo/breadcrumb.service';
import { AppBreadcrumb } from '../../shared/components/breadcrumb/breadcrumb';
import { AppHeader } from '../header/header';
import { AppFooter } from '../footer/footer';

// The page frame: header, breadcrumb, routed content, footer. Replaces the
// flat structure that used to live directly in app.html/app.ts — App now
// only owns the two global overlays (loading, toast), which aren't page
// chrome. BreadcrumbService moves here from App for the same reason
// ThemeService/SearchIndexService moved into AppHeader: layout/ may depend
// on core/ (ARCHITECTURE.md), so it fetches its own data instead of
// receiving it as an input.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, AppHeader, AppFooter, AppBreadcrumb],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class AppShell {
  protected readonly breadcrumbService = inject(BreadcrumbService);
}
