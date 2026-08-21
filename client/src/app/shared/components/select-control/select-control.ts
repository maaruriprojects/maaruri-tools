import { Component, input, model } from '@angular/core';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

let nextId = 0;

// Same pattern as AppTextInput but with a <select> element. Per
// docs/design/06-component-visual-design.md §3.
@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.html',
  styleUrl: './select-control.scss',
})
export class AppSelectControl {
  readonly label = input.required<string>();
  readonly value = model('');
  readonly options = input<readonly SelectOption[]>([]);
  readonly hint = input('');
  readonly error = input('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly id = input(`app-select-${nextId++}`);

  protected readonly hintId = () => `${this.id()}-hint`;
  protected readonly errorId = () => `${this.id()}-error`;

  protected describedBy(): string | null {
    const ids: string[] = [];
    if (this.hint()) ids.push(this.hintId());
    if (this.error()) ids.push(this.errorId());
    return ids.length > 0 ? ids.join(' ') : null;
  }
}
