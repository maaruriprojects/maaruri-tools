import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../header/header';
import { AppFooter } from '../footer/footer';
import { AppBreadcrumb } from '../../shared/components/breadcrumb/breadcrumb';
import type { BreadcrumbItem } from '../../shared/models/breadcrumb-item';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, AppHeader, AppFooter, AppBreadcrumb],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class AppShell {
  readonly breadcrumbItems = input<readonly BreadcrumbItem[]>([]);
}
