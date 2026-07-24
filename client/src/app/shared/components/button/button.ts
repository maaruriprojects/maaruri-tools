import { Component, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// Reference shared component — see COMPONENT_GUIDELINES.md. The label is
// projected content, not a `text` input; variant is one input, not a
// boolean flag per style. Colors/spacing/radius per
// docs/design/06-component-visual-design.md §1 (Buttons).
@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class AppButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly disabled = input(false);
}
