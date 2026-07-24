// The contract, defined before the service (see SERVICE_GUIDELINES.md).
export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  readonly id: number;
  readonly severity: ToastSeverity;
  readonly message: string;
}
