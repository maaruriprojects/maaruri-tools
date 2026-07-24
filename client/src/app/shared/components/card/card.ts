import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type CardLink = string | readonly (string | number)[];

// Reference shared component — see COMPONENT_GUIDELINES.md. Inputs cover
// only the shape every card has (title, description, image, link);
// anything beyond that (a footer, a badge, a price) is projected content
// via <ng-content />, not a new boolean input per use case. Works both in
// a grid (a consumer's own grid/flex container around several
// <app-card>s) and standalone — this component has no opinion on layout
// beyond its own box, so both are just "however many are placed."
//
// docs/design/06-component-visual-design.md §2 (tool card) drives surface/
// border/radius/padding/content-layout. Category-accent border-on-hover
// isn't implemented — that needs the doc03 category-color-ring system,
// which doesn't exist as tokens/data yet (this component stays generic,
// not category-aware, per "no component-specific business logic inside
// it"). The hover shadow (`0 4px 8px rgba(0,0,0,.08)` light / `.3` dark)
// is deferred for the same reason AppButton's rest-state shadow was in
// Day 8: a new theme-varying token, not yet defined, for a detail beyond
// today's explicit requirements.
@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class AppCard {
  readonly title = input.required<string>();
  readonly description = input('');
  /** Icon or image URL — either is just an image to this component. */
  readonly imageUrl = input('');
  readonly imageAlt = input('');
  readonly link = input.required<CardLink>();
}
