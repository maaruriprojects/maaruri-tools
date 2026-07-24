import { Service, signal } from '@angular/core';
import type { Toast, ToastSeverity } from './toast';

// Auto-dismiss lifetime per severity — errors linger longer than a success
// confirmation, since a confirmation is expected/low-stakes and an error is
// new, unexpected information the user may need a moment to actually read.
// doc08 §4 gives a single flat 4000ms baseline (written before severity was
// split out); success/error below follow this task's explicit split
// instead, info/warning keep close to that baseline as the two severities
// neither doc specifies individually.
const TOAST_DURATION_MS: Record<ToastSeverity, number> = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 7000,
};

let nextToastId = 0;

// Queue-based, not a single "current toast" — multiple toasts (e.g. two
// failed requests in quick succession) stack rather than one overwriting
// the other. AppToast (shared/components/toast) renders this queue; it
// never injects this service itself (shared components stay @Input-driven
// — see COMPONENT_GUIDELINES.md), so App (src/app/app.ts) wires the two
// together.
@Service()
export class ToastService {
  private readonly toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this.toastsSignal.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(severity: ToastSeverity, message: string): void {
    const id = nextToastId++;
    this.toastsSignal.update((toasts) => [...toasts, { id, severity, message }]);
    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS[severity]);
  }
}
