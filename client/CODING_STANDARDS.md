# Coding Standards

Conventions for this Angular workspace. Enforced automatically where possible (ESLint, Prettier,
pre-commit hooks) — this doc covers the rest, plus the reasoning behind the automated rules.

## File naming

- `kebab-case` for every file: `tool-card.ts`, `tool-card.html`, `tool-card.scss`,
  `tool-card.spec.ts`, `date-format.pipe.ts`, `auth.guard.ts`.
- Suffix by role, not by type-of-file: `.service.ts`, `.guard.ts`, `.pipe.ts`, `.directive.ts`.
  Components have no suffix on the class file itself (`tool-card.ts`, not `tool-card.component.ts`)
  to match the Angular CLI's current defaults — stay consistent with whatever the CLI generates.
- One feature/concept per folder, named the same as its primary file:
  `shared/components/search-bar/search-bar.ts`.

## Class naming

- `PascalCase` for every class, interface, type, enum: `ToolCard`, `SearchBar`, `AuthGuard`.
- Angular decorators don't need a type suffix in the class name (`SearchBar`, not
  `SearchBarComponent`) — the file path and folder already say what it is. Don't fight this if a
  generator emits a suffixed name; just don't add one by hand.

## One exported class per file

Each file exports exactly one class (component, directive, pipe, service, guard). Co-locate small
private helpers or types the class alone uses in the same file; once something is reused elsewhere,
it moves to `shared/models` or its own file. This keeps `ng generate` scaffolding, imports, and
`git blame` history predictable as the tool count grows toward ~200.

## Signal vs. plain property

Default to a **signal** whenever a value:

- changes after the component/service is constructed, and
- is read from a template, a `computed()`, or an `effect()`.

```ts
count = signal(0);
doubled = computed(() => this.count() * 2);
```

Use a **plain property** when the value is set once (constructor/`inject()`-time) and never
reassigned, or when it's a pure constant/config object with no reactive consumers:

```ts
readonly pageSize = 25;
private readonly http = inject(HttpClient);
```

Component inputs/outputs/queries always use the signal-based APIs — never the legacy decorators:

| Instead of                                  | Use                       |
| ------------------------------------------- | ------------------------- |
| `@Input() value: string`                    | `value = input<string>()` |
| `@Input() @Output() value` (two-way)        | `value = model<string>()` |
| `@Output() changed = new EventEmitter<T>()` | `changed = output<T>()`   |
| `@ViewChild(Foo) foo!: Foo`                 | `foo = viewChild(Foo)`    |

This is enforced by `@angular-eslint/prefer-signals`, `prefer-signal-model`, and
`prefer-output-emitter-ref` in [eslint.config.js](eslint.config.js) — a violation fails lint and
blocks the commit, so treat these as the actual rule, not a suggestion.

## Standalone components — no NgModules

This project has no `NgModule` anywhere and never will. Every component, directive, and pipe is
standalone (the Angular 22 default — no `standalone: true` flag needed). Concretely:

- Import what a component needs directly in that component's `imports` array (e.g.
  `imports: [SearchBar, RouterLink]`), not through a shared module.
- Routes are configured via `provideRouter()` in [app.config.ts](src/app/app.config.ts) and
  lazy-loaded per feature with `loadComponent` / `loadChildren` — see
  [ARCHITECTURE.md](../ARCHITECTURE.md) for why `features/tools` is split by category this way.
- App-wide singletons (`core/`) are provided via `providedIn: 'root'` or in `app.config.ts`, never
  via a module's `providers` array.
- `@angular-eslint/prefer-standalone` fails the build on any component/directive/pipe that opts
  back into `standalone: false`.

## Other enforced conventions

These are ESLint rules, not just guidance — a violation is a lint error:

- `inject()` over constructor-parameter injection (`@angular-eslint/prefer-inject`).
- `@Service()` over `@Injectable({ providedIn: 'root' })` for plain singleton services
  (`prefer-service-decorator`) — see [ConfigService](src/app/core/config/config.service.ts) for the
  pattern. `@Injectable()` is still correct for anything that isn't root-provided (e.g. a value
  provided per-component).
- `ChangeDetectionStrategy.OnPush` on every component (`prefer-on-push-component-change-detection`)
  — this project is zoneless, so change detection is already signal/OnPush-driven; this rule just
  keeps that explicit at the decorator level.
- `computed()` must return a value (`computed-must-return`) and signals must be called, not passed
  around uncalled, in templates (`no-uncalled-signals`).

## Formatting

Formatting itself (quotes, semicolons, line width, indentation) is fully owned by Prettier via
[.prettierrc](.prettierrc) and mirrored in [.editorconfig](.editorconfig) so non-VS Code editors
match too. Don't hand-format or argue about style in review — run `npm run format` or let the
pre-commit hook do it.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <summary>`, e.g.
`feat(tools): add unit converter`, `fix(shared): correct pagination off-by-one`,
`docs(readme): update setup steps`. Allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`
(plus `test`, `style`, `perf`, `build`, `ci`, `revert` from the standard Conventional Commits set).
Enforced by commitlint on every commit via the `commit-msg` hook.
