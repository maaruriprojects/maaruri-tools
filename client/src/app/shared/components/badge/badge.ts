import { Component, input } from '@angular/core';

export type BadgeColor = 'success' | 'warning' | 'error' | 'info' | 'neutral';

// Reference shared component — see COMPONENT_GUIDELINES.md. A badge is a
// short styled string with no markup to project, so (unlike AppButton) it's
// a plain @Input-driven leaf: text + color, both simple values. Shape/type
// per docs/design/06-component-visual-design.md §4 (Badges/tags), modeled
// on that section's "semantic badge" case — border and text share one
// color, taken directly from the tuned semantic tokens.
@Component({
  selector: 'app-badge',
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class AppBadge {
  readonly text = input.required<string>();
  readonly color = input<BadgeColor>('neutral');
}
