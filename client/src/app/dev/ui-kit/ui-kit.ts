import { Component, input } from '@angular/core';
import { AppBadge, BadgeColor } from '../../shared/components/badge/badge';
import { AppButton, ButtonVariant } from '../../shared/components/button/button';

// Internal visual-QA page — renders every shared component built so far.
// Not linked anywhere; reached only via direct navigation to /dev/ui-kit,
// and gated by devRouteGuard (core/guards/dev-route.guard.ts).
@Component({
  selector: 'app-ui-kit',
  imports: [AppButton, AppBadge],
  templateUrl: './ui-kit.html',
  styleUrl: './ui-kit.scss',
})
export class UiKit {
  readonly title = input('');

  protected readonly buttonVariants: ButtonVariant[] = ['primary', 'secondary', 'ghost'];
  protected readonly badgeColors: BadgeColor[] = ['success', 'warning', 'error', 'info', 'neutral'];
}
