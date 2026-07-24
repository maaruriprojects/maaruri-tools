import { Component, input } from '@angular/core';

export type LoadingSpinnerSize = 'sm' | 'lg';

// Reference shared component — see COMPONENT_GUIDELINES.md. Purely
// presentational: a thin-stroke rotating arc per
// docs/design/08-animation-motion.md §3. `size` (not two near-duplicate
// components) covers both roles this system needs: 'sm' is "the small
// inline variant for button-level or per-section loading states" used
// directly; 'lg' is what AppLoadingOverlay (shared/components/
// loading-overlay) reuses for the global overlay, rather than duplicating
// the glyph.
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss',
})
export class AppLoadingSpinner {
  readonly size = input<LoadingSpinnerSize>('sm');
}
