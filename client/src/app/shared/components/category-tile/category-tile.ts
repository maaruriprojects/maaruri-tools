import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../icon/icon';
import { DEFAULT_LOCALE } from '../../../core/i18n/locale';
import type { ToolCategorySegment } from '../../../core/config/route-paths';

// Per docs/design/03-iconography-logos.md (category tile) and
// docs/design/06-component-visual-design.md §2. A larger tile for a
// category, with a 1.5px category-accent border at rest, ~40px icon,
// category name, and tool count. Navigation is via routerLink.
@Component({
  selector: 'app-category-tile',
  imports: [RouterLink, AppIcon],
  templateUrl: './category-tile.html',
  styleUrl: './category-tile.scss',
})
export class AppCategoryTile {
  readonly categorySegment = input.required<ToolCategorySegment>();
  readonly title = input.required<string>();
  readonly toolCount = input(0);
  readonly icon = input.required<string>();

  protected readonly locale = DEFAULT_LOCALE.code;
  protected readonly categoryColorVar = computed(
    () => `var(--cat-color-${this.categorySegment()})`,
  );
}
