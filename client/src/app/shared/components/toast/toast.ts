import { Component, input, output } from '@angular/core';
import type { Toast } from '../../../core/toast/toast';

// Reference shared component — see COMPONENT_GUIDELINES.md. Pure
// @Input-driven: it never injects ToastService itself (a shared component
// never injects app-specific services) — App (src/app/app.ts) injects
// ToastService and passes its `toasts` queue down, wiring `dismiss` back
// to `ToastService.dismiss()`.
//
// Entrance animation only (toast.scss) — a true pre-removal exit animation
// needs either @angular/animations (not used in this project) or the
// newer `animate.leave` template syntax, which this project isn't taking
// on yet; @for removes a dismissed toast's DOM node immediately, same
// trade-off already made for AppLoadingOverlay in Day 12.
@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class AppToast {
  readonly toasts = input<readonly Toast[]>([]);
  readonly dismiss = output<number>();
}
