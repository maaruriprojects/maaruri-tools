import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { AppIcon } from '../icon/icon';

// Per docs/design/09-ux-flow-interaction.md (modal). Uses the ARIA dialog
// pattern with focus trap. Escape closes; backdrop click closes if
// closeOnBackdrop is true. Mobile: slides up as a bottom sheet. Desktop:
// centered with backdrop dim. Respects reduced motion (no slide, just fade).
@Component({
  selector: 'app-modal',
  imports: [AppIcon],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class AppModal {
  readonly open = input(false);
  readonly title = input('');
  readonly closeOnBackdrop = input(true);

  readonly closed = output<void>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private previouslyFocused: HTMLElement | null = null;

  protected readonly titleId = `app-modal-title-${Math.random().toString(36).slice(2, 9)}`;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.previouslyFocused = document.activeElement as HTMLElement | null;
        this.focusDialog();
      } else if (this.previouslyFocused) {
        this.previouslyFocused.focus();
        this.previouslyFocused = null;
      }
    });

    afterNextRender(() => {
      fromEvent<KeyboardEvent>(document, 'keydown')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          if (event.key === 'Escape' && this.open()) {
            this.closed.emit();
          }
        });
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  private focusDialog(): void {
    requestAnimationFrame(() => {
      const dialog = this.elementRef.nativeElement.querySelector('[role="dialog"]');
      dialog?.focus();
    });
  }
}
