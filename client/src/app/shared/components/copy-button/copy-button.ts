import {
  Component,
  PLATFORM_ID,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppIcon } from '../icon/icon';
import { ToastService } from '../../../core/toast/toast.service';

const CHECK_DURATION_MS = 1200;

// Per docs/design/09-ux-flow-interaction.md §3. Copies a value to the
// clipboard via navigator.clipboard, shows a check icon for ~1.2s, and
// fires a success toast with the actual value ("Copied 22.4"). On failure,
// fires an error toast. Guarded with isPlatformBrowser for SSR.
@Component({
  selector: 'app-copy-button',
  imports: [AppIcon],
  templateUrl: './copy-button.html',
  styleUrl: './copy-button.scss',
})
export class AppCopyButton {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toastService = inject(ToastService);

  readonly value = input.required<string>();
  readonly label = input('Copy');

  readonly copied = output<void>();

  protected readonly showCheck = signal(false);

  protected async onCopy(): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !navigator.clipboard) {
      this.toastService.error('Clipboard not available.');
      return;
    }

    try {
      await navigator.clipboard.writeText(this.value());
      this.showCheck.set(true);
      this.copied.emit();
      this.toastService.success(`Copied ${this.value()}`);
      setTimeout(() => this.showCheck.set(false), CHECK_DURATION_MS);
    } catch {
      this.toastService.error('Failed to copy to clipboard.');
    }
  }
}
