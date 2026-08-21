import { Component, input, model } from '@angular/core';

let nextId = 0;

// Per docs/design/06-component-visual-design.md §3 (input states). A labeled
// text input with hint and error support. Label is associated via <label for>,
// hint via aria-describedby, error sets aria-invalid. States: default, focus
// (border strengthens + amber ring), error (red border + message), disabled.
@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
})
export class AppTextInput {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly placeholder = input('');
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly inputmode = input<string | undefined>(undefined);
  readonly type = input('text');
  readonly id = input(`app-text-input-${nextId++}`);

  protected readonly hintId = () => `${this.id()}-hint`;
  protected readonly errorId = () => `${this.id()}-error`;

  protected describedBy(): string | null {
    const ids: string[] = [];
    if (this.hint()) ids.push(this.hintId());
    if (this.error()) ids.push(this.errorId());
    return ids.length > 0 ? ids.join(' ') : null;
  }
}
