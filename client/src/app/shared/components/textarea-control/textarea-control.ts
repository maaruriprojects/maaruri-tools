import { Component, input, model } from '@angular/core';

let nextId = 0;

// Same pattern as AppTextInput but with a <textarea>. Per
// docs/design/06-component-visual-design.md §3.
@Component({
  selector: 'app-textarea-control',
  templateUrl: './textarea-control.html',
  styleUrl: './textarea-control.scss',
})
export class AppTextareaControl {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly rows = input(4);
  readonly maxLength = input<number | undefined>(undefined);
  readonly id = input(`app-textarea-${nextId++}`);

  protected readonly hintId = () => `${this.id()}-hint`;
  protected readonly errorId = () => `${this.id()}-error`;

  protected describedBy(): string | null {
    const ids: string[] = [];
    if (this.hint()) ids.push(this.hintId());
    if (this.error()) ids.push(this.errorId());
    return ids.length > 0 ? ids.join(' ') : null;
  }
}
