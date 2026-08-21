import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../icon/icon';
import { CardLink } from '../card/card';
import type { ToolMeta } from '../../../shared/models/tool-meta';
import { ToolCategorySegment } from '../../../core/config/route-paths';

// Per docs/design/03-iconography-logos.md (tool tile) and
// docs/design/06-component-visual-design.md §2. A link-based tile for a
// single tool. Grid layout shows icon + name + description; compact layout
// shows icon + name only (for trending/recent/related rows). Navigation is
// via routerLink on the root anchor — no output needed.
@Component({
  selector: 'app-tool-tile',
  imports: [RouterLink, AppIcon],
  templateUrl: './tool-tile.html',
  styleUrl: './tool-tile.scss',
})
export class AppToolTile {
  readonly tool = input<ToolMeta | undefined>(undefined);
  readonly layout = input<'grid' | 'compact'>('grid');
  readonly link = input<CardLink | undefined>(undefined);

  protected readonly categoryColorVar = computed<string>(() => {
    const category = this.tool()?.category as ToolCategorySegment | undefined;
    if (!category) return 'var(--color-border)';
    return `var(--cat-color-${category})`;
  });
}
