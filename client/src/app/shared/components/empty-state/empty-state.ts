import { Component, input, output } from '@angular/core';
import { AppButton } from '../button/button';
import { AppIcon } from '../icon/icon';

// Per docs/design/09-ux-flow-interaction.md §2. States the fact, then
// proposes the next action. Centered text, no illustration. Uses Body type,
// secondary color. Optional action button.
@Component({
  selector: 'app-empty-state',
  imports: [AppButton, AppIcon],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.scss',
})
export class AppEmptyState {
  readonly message = input.required<string>();
  readonly actionLabel = input<string | undefined>(undefined);
  readonly icon = input<string | undefined>(undefined);

  readonly action = output<void>();
}
