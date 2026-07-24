import { Component, input } from '@angular/core';
import { AppLoadingSpinner } from '../loading-spinner/loading-spinner';

// Reference shared component — see COMPONENT_GUIDELINES.md. Pure
// @Input-driven: it never injects LoadingService itself (a shared
// component never injects app-specific services) — App (src/app/app.ts)
// injects LoadingService and passes its debounced `isSpinnerVisible`
// signal down as `[visible]`. Reuses AppLoadingSpinner for the glyph
// itself rather than duplicating it — the only new thing here is the
// full-page backdrop and centering.
//
// Stays permanently in the DOM and toggles opacity/visibility via a class,
// rather than being added/removed with @if, so the 100ms fade
// (docs/design/08-animation-motion.md §3) applies in both directions —
// Angular has no built-in leave-animation without @angular/animations,
// which this project doesn't use.
@Component({
  selector: 'app-loading-overlay',
  imports: [AppLoadingSpinner],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.scss',
})
export class AppLoadingOverlay {
  readonly visible = input(false);
}
