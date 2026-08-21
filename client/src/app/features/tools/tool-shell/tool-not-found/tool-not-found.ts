import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppEmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DEFAULT_LOCALE } from '../../../../core/i18n/locale';

// Per docs/design/09-ux-flow-interaction.md §3. Shown when a :toolSlug
// doesn't resolve in the registry. Uses EmptyState with a link back to the
// category browse page and the homepage.
@Component({
  selector: 'app-tool-not-found',
  imports: [RouterLink, AppEmptyState],
  templateUrl: './tool-not-found.html',
  styleUrl: './tool-not-found.scss',
})
export class ToolNotFound {
  readonly categorySegment = input.required<string>();
  readonly breadcrumbLabel = input('');

  protected readonly locale = DEFAULT_LOCALE.code;
}
