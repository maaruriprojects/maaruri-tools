# Shared Component Guidelines

Conventions for everything under `shared/components/`. These are the ~200-tool-scale rules —
followed consistently now, they're what keeps the component library legible once it's large,
not just while it's two components. See [`AppButton`](src/app/shared/components/button/button.ts)
and [`AppBadge`](src/app/shared/components/badge/badge.ts) for the pattern in practice, and
`/dev/ui-kit` for a rendered view of every shared component built so far.

## Standalone only

No `NgModule`s, ever — matches [CODING_STANDARDS.md](CODING_STANDARDS.md). A shared component
imports only what it needs directly in its own `imports` array.

## Signal inputs/outputs, not decorators

`input()`, `output()`, and `model()` — never `@Input()`/`@Output()`. This isn't just style:
signal inputs are how a component's public API stays type-safe and readable from the class body
alone, without cross-referencing a template or a decorator's options object.

```ts
// Do
readonly variant = input<ButtonVariant>('primary');

// Not this
@Input() variant: ButtonVariant = 'primary';
```

`OnPush` needs no explicit `changeDetection` — under zoneless change detection it's already the
effective default; only setting it back to `Default` would need an explicit (and discouraged)
opt-out. See [CODING_STANDARDS.md](CODING_STANDARDS.md)'s note on
`prefer-on-push-component-change-detection`.

## Content projection over boolean flags

When a component needs to render caller-supplied markup — not just caller-supplied data — prefer
`<ng-content />` over adding another `@Input` flag. A button's label is projected content, not a
`text: string` input; a card's body is projected, not an `innerHtml`-style input. This keeps a
component's input surface describing **what it is** (a variant, a state) rather than **what it
contains**, and avoids the well-known anti-pattern of a component that grows a new boolean input
for every visual permutation someone eventually needs (`isPrimary`, `isLarge`, `showIcon`,
`iconPosition`, ...). One `variant` input beats three mutually-exclusive booleans every time.

This is a preference, not an absolute: a component whose entire job is rendering a short, styled
string (`AppBadge`) is reasonably an `@Input`-driven leaf with no projected content at all —
there's no markup variation to project. Use judgment; the rule is about avoiding
flag-explosion, not about banning simple string inputs.

## One component per folder, co-located files

```
shared/components/button/
  button.ts
  button.html
  button.scss
  button.spec.ts
```

Kebab-case folder and file names, matching [CODING_STANDARDS.md](CODING_STANDARDS.md). The
class name drops the folder's own word where it's redundant with the `App` prefix + name (e.g.
`AppButton`, not `AppButtonComponent` — see that doc's note on CLI-current naming). Template and
styles are separate files, not inline — at shared-component scale, co-located `.html`/`.scss`
are easier to scan and diff than a growing inline template string.

## Never inject app-specific services

A shared component's only data source is its `@Input`s (signal inputs). It never calls
`inject(ConfigService)`, `inject(ToolRegistryService)`, `inject(ThemeService)`, or anything else
from `core/` or `features/` — that's exactly the dependency direction
[ARCHITECTURE.md](../ARCHITECTURE.md) forbids (`shared/` must not depend on app-specific state).
A shared component that needs data gets it passed in by the feature that uses it; it never goes
and fetches its own.

The one narrow exception: reading CSS custom properties (design tokens) in a component's own
`.scss` file is fine and expected — tokens are the one piece of "global state" shared components
are allowed to depend on, because they're the whole point of
[Day 7's theming system](src/styles/_tokens.scss). "No app-specific services" means no Angular
DI dependency on application state or app-specific business logic, not "no design tokens."

## Selector prefix

`app-` prefix, kebab-case element selector (`app-button`, `app-badge`) — enforced by
`@angular-eslint/component-selector` in [eslint.config.js](eslint.config.js). Shared components
use the same `app-` prefix as every other component in this project; there's no separate
"library" prefix, since these aren't published outside this app.
