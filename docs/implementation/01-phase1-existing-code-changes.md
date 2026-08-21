# Phase 1 — Existing Code Changes

These prompts modify the existing codebase to build the foundation. Run them
in order. Each prompt assumes the previous one is complete and verified.

Before each prompt: review the files it touches. After each prompt: run
type-check, lint, unit tests, production build, and browser verification.

---

## Prompt 1 — Application Shell

**Branch:** `phase1/01-application-shell`
**Commit:** `feat: add application shell, header, footer, and navigation`

### Scope

Build the persistent application chrome described in docs/design/01 and
docs/design/04: a control-strip header, a footer, and a shell layout that
wraps the router outlet in a semantic `<main>` landmark with a skip-to-content
link. This is the single biggest structural gap in the current project —
`layout/header`, `layout/footer`, `layout/shell`, and `layout/sidebar` are
all `.gitkeep` stubs today.

### What to review first

- `client/src/app/app.html` — currently a temporary theme-toggle button,
  breadcrumb, router-outlet, loading overlay, and toast. No shell.
- `client/src/app/app.ts` — injects ThemeService, LoadingService,
  ToastService, BreadcrumbService.
- `client/src/app/app.routes.ts` — all routes live under `/:locale`.
- `client/src/app/core/config/route-paths.ts` — `TOOL_CATEGORY_SEGMENTS`,
  `ROUTE_SEGMENTS`, `LOCALE_PARAM`.
- `client/src/app/features/tools/tool-categories.ts` — `TOOL_CATEGORY_META`
  (title, breadcrumbLabel, metaDescription per category).
- `client/src/app/core/theme/theme.service.ts` — `theme()` signal, `toggle()`.
- `client/src/app/features/tools/search-index.service.ts` — `entries()` signal.
- `client/src/app/shared/components/search-bar/search-bar.ts` — combobox
  component, takes `entries` input, emits `toolSelected`.
- `client/src/app/shared/components/breadcrumb/breadcrumb.ts` — takes `items`.
- `client/src/app/shared/components/button/button.ts` — variants.
- `client/src/app/core/i18n/locale.ts` — `DEFAULT_LOCALE`.

### Files to create

```
client/src/app/layout/header/header.ts
client/src/app/layout/header/header.html
client/src/app/layout/header/header.scss
client/src/app/layout/header/header.spec.ts
client/src/app/layout/footer/footer.ts
client/src/app/layout/footer/footer.html
client/src/app/layout/footer/footer.scss
client/src/app/layout/footer/footer.spec.ts
client/src/app/layout/shell/shell.ts
client/src/app/layout/shell/shell.html
client/src/app/layout/shell/shell.scss
client/src/app/layout/shell/shell.spec.ts
```

### Files to update

```
client/src/app/app.html          — replace with <app-shell> wrapping router-outlet
client/src/app/app.ts            — import Shell, remove inline theme-toggle
client/src/app/app.scss          — remove temporary .theme-toggle styles
client/src/app/app.routes.ts     — wrap locale children inside a shell loadComponent
                                    OR keep shell in app.html (see decision below)
```

### Requirements

**Header (control strip):**
- Left: logo or text wordmark ("Maaruri Tools" in `--font-display`).
- Center: category navigation. Desktop: a dropdown or inline list of all 11
  categories from `TOOL_CATEGORY_META`. Mobile: a hamburger menu that opens a
  panel listing all categories.
- Right: jump-search (desktop: visible `AppSearchBar`; mobile: search icon
  that opens a full-width search mode) and theme toggle (calls
  `ThemeService.toggle()`).
- The header is sticky at the top.
- All interactive targets must be at least 44×44px on touch layouts.
- Use `--color-surface` background, `--color-border` bottom border, no shadow
  at rest (per doc 06 — the only rest-state shadow is the search dropdown).

**Footer:**
- Category index (links to all 11 categories, locale-aware).
- Static page links: About, Contact, Opportunities.
- Copyright line.
- `--color-surface` background, `--color-border` top border.

**Shell:**
- Renders `<app-header>`, then `<main id="main-content">` with a skip link
  targeting it, then `<app-footer>`.
- The skip link is visually hidden until focused (`:focus-visible`), then
  becomes visible at the top-left of the page.
- Breadcrumbs render inside `<main>`, above the `<router-outlet>`.
- Loading overlay and toast remain at the app level (they're app-wide, not
  shell-scoped).

**Navigation:**
- All links must be locale-aware: `['/', DEFAULT_LOCALE.code, category]`.
- Category links use `TOOL_CATEGORY_SEGMENT_LIST` and `TOOL_CATEGORY_META`.
- Search selection navigates to `['/', DEFAULT_LOCALE.code, entry.category, entry.slug]`.

**Accessibility:**
- `<header role="banner">`, `<footer role="contentinfo">`, `<main>`.
- Skip link: `<a class="skip-link" href="#main-content">Skip to content</a>`.
- Hamburger menu: `aria-expanded`, `aria-controls`, keyboard operable.
- Theme toggle: `aria-label` describing the action, `aria-pressed` if applicable.
- Search icon button: `aria-label`, `aria-expanded` when search is open.

**SSR safety:**
- Do not access `window`, `document`, `localStorage`, or `sessionStorage`
  outside of `afterNextRender` or `isPlatformBrowser` guards.
- The header and footer must render correctly during SSR (no hydration errors).

### Tests

- Header renders logo, category nav, search, theme toggle.
- Footer renders all category links and static page links.
- Shell renders skip link, header, main, footer in correct order.
- Skip link is hidden by default, visible on focus.
- Theme toggle calls `ThemeService.toggle()`.
- Mobile menu opens and closes (aria-expanded toggles).
- Category links are locale-aware.
- All tests pass.

### Completion criteria

- The app has a persistent header and footer on every page.
- The router outlet is inside `<main>` with a skip link.
- Navigation works for all 11 categories and the static pages.
- Search works from the header on desktop.
- Theme toggle works from the header.
- No hydration errors in SSR.
- Type-check, lint, tests, and production build all pass.
- Verified in browser at desktop, tablet, and mobile widths.

---

## Prompt 2 — Design Foundation

**Branch:** `phase1/02-design-foundation`
**Commit:** `feat: load fonts, add global styles, polish theme system`

### Scope

Load the three design-system fonts (IBM Plex Sans Condensed, Public Sans, IBM
Plex Mono), add global body/heading/link/selection defaults, add
`prefers-color-scheme` detection to ThemeService, and add the deferred visual
tokens (button rest-shadow, card hover-shadow, category-color ring) that the
existing components already reference as "deferred."

### What to review first

- `client/src/index.html` — no font links currently.
- `client/src/styles.scss` — load order: tokens → bootstrap-overrides → theme → focus-visible.
- `client/src/styles/_tokens.scss` — theme-invariant tokens.
- `client/src/styles/theme.scss` — light/dark value sets + Bootstrap bridge.
- `client/src/styles/_focus-visible.scss` — global focus ring.
- `client/src/styles/_breakpoints.scss` — mobile/tablet/desktop mixins.
- `client/src/app/core/theme/theme.service.ts` — no `prefers-color-scheme` detection.
- `client/src/app/shared/components/button/button.scss` — comment says
  "rest-state bottom-edge shadow deferred."
- `client/src/app/shared/components/card/card.scss` — comment says
  "hover shadow deferred" and "category-accent hover border deferred."
- `docs/design/02-color-typography.md` — font families, type scale.
- `docs/design/03-iconography-logos.md` — Category Color Ring formula.
- `docs/design/06-component-visual-design.md` — button shadow, card shadow,
  input states.

### Files to update

```
client/src/index.html               — add font preconnect + stylesheet links
client/src/styles.scss               — add global base styles after focus-visible
client/src/styles/_tokens.scss       — add --shadow-rest (button), --shadow-hover (card)
client/src/styles/theme.scss        — add --shadow-rest / --shadow-hover dark values
client/src/app/core/theme/theme.service.ts — add prefers-color-scheme on first visit
client/src/app/shared/components/button/button.scss — add rest-state shadow
client/src/app/shared/components/card/card.scss — add hover shadow
```

### Files to create

```
client/src/styles/_base.scss         — body, heading, link, selection, reduced-motion defaults
client/src/styles/_category-colors.scss — 11 category accent colors per doc 03 formula
```

### Requirements

**Fonts:**
- Add `<link rel="preconnect">` for Google Fonts.
- Load IBM Plex Sans Condensed (weights 500, 600), Public Sans (400, 600),
  IBM Plex Mono (500) with `display=swap`.
- Do not self-host in this prompt — use Google Fonts. The tokens already
  reference these families by name.

**Global base styles (`_base.scss`):**
- `body`: `background-color: var(--color-bg)`, `color: var(--color-text-primary)`,
  `font-family: var(--font-body)`, `font-size: var(--type-body-size)`,
  `line-height: var(--type-body-line-height)`, `margin: 0`.
- Headings (`h1`–`h6`): `font-family: var(--font-display)`, `font-weight: 600`,
  `line-height: 1.25`, `color: var(--color-text-primary)`, margins from spacing scale.
- Links: `color: var(--color-info)`, `text-decoration: underline`, hover
  `text-decoration-thickness: 2px`, focus-visible inherits global ring.
- `::selection`: `background: var(--color-accent)`, `color: var(--color-readout-bg)`.
  (Amber on dark backing — the only sanctioned non-Readout use is selection,
  which is ephemeral and not a UI component.)
- `@media (prefers-reduced-motion: reduce)`: disable all transitions and
  animations globally as a safety net.
- Import `_base.scss` in `styles.scss` after `_focus-visible`.

**Deferred tokens:**
- `--shadow-rest`: `0 1px 0 rgba(0,0,0,0.25)` light / `0 1px 0 rgba(0,0,0,0.5)` dark.
  Used by primary/secondary buttons at rest.
- `--shadow-hover`: `0 4px 8px rgba(0,0,0,0.08)` light / `0 4px 8px rgba(0,0,0,0.3)` dark.
  Used by cards on hover.

**Category colors (`_category-colors.scss`):**
- Define 11 CSS custom properties (`--cat-color-time-date`, etc.) using the
  `hsl(H, 42%, 42%)` light / `hsl(H, 38%, 62%)` dark formula from doc 03.
- Assign hues ≥25° apart, outside the four exclusion zones (15°–50°, 135°–165°,
  195°–225°, 345°–15°).
- Suggested hues: Time & Date 175°, Health & Fitness 320°, Finance 255°,
  Work & Productivity 80°, Converters & Calculators 230°, Everyday 350°
  (outside zones — use 355° adjusted, or pick 110°), Creative & Design 300°,
  Development & Web 195° is excluded — use 210°, Travel 50° is excluded —
  use 65°, Document & Language 140°, Personal & Social 270°.
- Verify each hue is ≥25° from every other and outside exclusion zones.
  Adjust as needed. Document the final 11 hues in the file.

**ThemeService `prefers-color-scheme`:**
- On first visit (no `sessionStorage` value), check
  `window.matchMedia('(prefers-color-scheme: dark)').matches` and use that
  as the initial theme.
- Once the user explicitly toggles, persist their choice — do not override it.
- Guard with `isPlatformBrowser`.

**Button and card polish:**
- Button primary/secondary: add `box-shadow: var(--shadow-rest)` at rest,
  remove on `:active`.
- Card: add `box-shadow: var(--shadow-hover)` on hover (alongside the existing
  `translateY(-2px)` and border color change).

### Tests

- ThemeService: first-visit defaults to `prefers-color-scheme` value.
- ThemeService: explicit toggle overrides `prefers-color-scheme`.
- Button: has rest-state shadow (if testable via computed style).
- Existing tests still pass.

### Completion criteria

- All three fonts load and render (check DevTools Network + Computed Styles).
- Body text uses Public Sans, headings use IBM Plex Sans Condensed, Readout
  uses IBM Plex Mono.
- Global styles produce readable text in both themes.
- Theme toggle respects OS preference on first visit.
- Buttons have a rest-state bottom shadow; cards have a hover shadow.
- 11 category color tokens are defined and distinct.
- Type-check, lint, tests, and production build pass.
- Verified in browser: both themes, all three breakpoints.

---

## Prompt 3 — Shared Components

**Branch:** `phase1/03-shared-components`
**Commit:** `feat: add ToolTile, CategoryTile, form controls, modal, state components`

### Scope

Add the reusable presentational components that the homepage, category pages,
and tool pages need. These are all in `shared/` — no feature-specific logic.

### What to review first

- All existing components in `client/src/app/shared/components/` — match their
  conventions (signal inputs/outputs, standalone, templateUrl, styleUrl, spec).
- `client/src/app/shared/components/card/card.ts` — the pattern for
  link-based tile components.
- `client/src/app/shared/components/button/button.ts` — input pattern.
- `client/src/app/shared/components/badge/badge.ts` — color-variant pattern.
- `client/src/app/shared/components/search-bar/search-bar.ts` — the most
  complex existing component; reference for keyboard/ARIA patterns.
- `docs/design/06-component-visual-design.md` — specs for inputs, badges,
  search dropdown.
- `docs/design/03-iconography-logos.md` — tool-tile and category-tile visual specs.
- `client/src/app/shared/models/tool-meta.ts` — `ToolMeta` interface.
- `client/src/app/shared/models/search-index-entry.ts` — `SearchIndexEntry`.

### Files to create

```
shared/components/tool-tile/tool-tile.ts
shared/components/tool-tile/tool-tile.html
shared/components/tool-tile/tool-tile.scss
shared/components/tool-tile/tool-tile.spec.ts
shared/components/category-tile/category-tile.ts
shared/components/category-tile/category-tile.html
shared/components/category-tile/category-tile.scss
shared/components/category-tile/category-tile.spec.ts
shared/components/text-input/text-input.ts
shared/components/text-input/text-input.html
shared/components/text-input/text-input.scss
shared/components/text-input/text-input.spec.ts
shared/components/select-control/select-control.ts
shared/components/select-control/select-control.html
shared/components/select-control/select-control.scss
shared/components/select-control/select-control.spec.ts
shared/components/textarea-control/textarea-control.ts
shared/components/textarea-control/textarea-control.html
shared/components/textarea-control/textarea-control.scss
shared/components/textarea-control/textarea-control.spec.ts
shared/components/modal/modal.ts
shared/components/modal/modal.html
shared/components/modal/modal.scss
shared/components/modal/modal.spec.ts
shared/components/empty-state/empty-state.ts
shared/components/empty-state/empty-state.html
shared/components/empty-state/empty-state.scss
shared/components/empty-state/empty-state.spec.ts
shared/components/copy-button/copy-button.ts
shared/components/copy-button/copy-button.html
shared/components/copy-button/copy-button.scss
shared/components/copy-button/copy-button.spec.ts
shared/ad-components/ad-banner/ad-banner.ts
shared/ad-components/ad-banner/ad-banner.html
shared/ad-components/ad-banner/ad-banner.scss
shared/ad-components/ad-banner/ad-banner.spec.ts
shared/ad-components/ad-rectangle/ad-rectangle.ts
shared/ad-components/ad-rectangle/ad-rectangle.html
shared/ad-components/ad-rectangle/ad-rectangle.scss
shared/ad-components/ad-rectangle/ad-rectangle.spec.ts
shared/ad-components/ad-in-article/ad-in-article.ts
shared/ad-components/ad-in-article/ad-in-article.html
shared/ad-components/ad-in-article/ad-in-article.scss
shared/ad-components/ad-in-article/ad-in-article.spec.ts
shared/models/category-meta.ts
```

### Component specifications

**ToolTile:**
- Inputs: `tool: ToolMeta | undefined`, `layout: 'grid' | 'compact'` (default
  `'grid'`), `link: CardLink | undefined`.
- Output: none (navigation is via `routerLink` on the root element).
- Grid layout: icon (24px), tool name (Label type), short description
  (Body-sm, secondary color). 1px border, `--radius-md`, `--color-surface` bg.
  Hover: border shifts to category color, `translateY(-2px)`, hover shadow.
  Mobile: 1px category-color border at rest (no hover on touch).
- Compact layout: horizontal row — icon (20px) + name only, no description.
  Used for trending/recent/related rows.
- Uses the `icon` field from `ToolMeta` to render a Tabler icon (see icon
  system below).
- Focus-visible: global ring on the whole tile.

**CategoryTile:**
- Inputs: `categorySegment: ToolCategorySegment`, `title: string`,
  `toolCount: number`, `icon: string`.
- Output: none (navigation via `routerLink`).
- Larger than ToolTile: `--space-lg` padding, ~40px icon.
- 1.5px border in the category's accent color at rest (always visible).
- Contents: category icon, category name (Subhead type), tool count (Caption,
  secondary color).
- Hover: border thickens to 2px, `translateY(-2px)`, hover shadow.
- Mobile: horizontal list-row layout (icon left, name + count stacked right).
- Link: `['/', locale, categorySegment]`.

**TextInput:**
- Inputs: `label: string` (required), `value: string`, `placeholder: string`,
  `hint: string`, `error: string`, `disabled: boolean`, `required: boolean`,
  `inputmode: string`, `type: string` (default `'text'`), `id: string`
  (auto-generated if not provided).
- Output: `valueChange: string`.
- Label is a `<label for>` associated with the input.
- Hint text below input (Caption, secondary color) with `aria-describedby`.
- Error message below input (Caption, error color) with `aria-describedby`
  and `aria-invalid="true"` on the input.
- States per doc 06 §3: default, focus (border strengthens + amber ring),
  error (red border + message), disabled (bg recedes).
- Padding: 10px vertical, `--space-md` horizontal. Radius: `--radius-sm`.

**SelectControl:**
- Same pattern as TextInput but with a `<select>` element.
- Inputs: `label`, `value`, `options: { value: string; label: string }[]`,
  `hint`, `error`, `disabled`, `required`, `id`.

**TextareaControl:**
- Same pattern as TextInput but with a `<textarea>`.
- Additional input: `rows: number` (default 4), `maxLength: number`.

**Modal:**
- Inputs: `open: boolean`, `title: string`, `closeOnBackdrop: boolean`
  (default true).
- Output: `close: void`.
- Uses `<dialog>` element or ARIA dialog pattern.
- Focus trap inside the dialog. Escape closes. Backdrop click closes if
  `closeOnBackdrop`.
- Mobile: slides up as a bottom sheet (transform: translateY). Desktop:
  centered with backdrop dim.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title.
- Focus moves to the dialog on open, returns to trigger on close.
- Respect reduced motion (no slide, just fade).

**EmptyState:**
- Inputs: `message: string` (required), `actionLabel: string`,
  `icon: string` (Tabler icon name, optional).
- Output: `action: void`.
- Centered text, no illustration. Uses Body type, secondary color.
- Optional Secondary button for the action.
- Per doc 09 §2: states the fact, then proposes the next action.

**CopyButton:**
- Inputs: `value: string` (required), `label: string` (default "Copy").
- Output: `copied: void`.
- Uses `navigator.clipboard.writeText()` — guard with `isPlatformBrowser`.
- On success: icon swaps to check for 1200ms, fires success toast via
  `ToastService.success()` with the actual value ("Copied 22.4" per doc 09 §3).
- On failure: fires error toast.
- Tabler `copy` icon, `--color-icon-muted`, 16–20px.

**Ad components (placeholders only):**
- `AdBanner`: full-width placeholder, `--color-surface-placeholder` bg,
  `--color-border-subtle` border, "Advertisement" label (Caption, centered,
  secondary color). Height 90px desktop, hidden on mobile.
- `AdRectangle`: 300×250 placeholder, same styling. Used in tool-page sidebar.
- `AdInArticle`: inline placeholder, same styling, max-width 728px.
- None connect to an ad network. All are visual placeholders.

**Icon system:**
- Use Tabler Icons (outline set) via `lucide-react`-equivalent for Angular.
  Since the project does not have an icon library yet, install
  `@tabler/icons` or use inline SVGs from Tabler's outline set.
- Alternatively, create a lightweight `IconComponent` that takes a `name`
  input and renders the corresponding Tabler outline SVG path. This keeps
  the bundle small (only the icons used are included).
- Icon color: `--color-icon-muted` by default, `--color-text-primary` when
  paired with active text. Never `--color-accent`.
- Sizes: 20px in nav/buttons, 16px in dense contexts, 24px in tool tiles,
  40px in category tiles.

**CategoryMeta model:**
- Create `shared/models/category-meta.ts` exporting `CategoryMeta`
  interface: `segment: ToolCategorySegment`, `title: string`,
  `breadcrumbLabel: string`, `metaDescription: string`, `icon: string`,
  `toolCount: number`.

### Tests

Each component needs a spec file testing:
- Renders with required inputs.
- Emits outputs on user interaction.
- Accessibility attributes are correct (aria-label, aria-describedby, role).
- Disabled state works.
- Error state shows message and sets aria-invalid (form controls).
- Modal: focus trap, escape close, backdrop close, aria attributes.
- CopyButton: calls clipboard, shows check, fires toast.

### Completion criteria

- All components render correctly in both themes.
- All components pass unit tests.
- All components are added to the `/dev/ui-kit` page for visual QA.
- Form controls have correct label association and error handling.
- Modal traps focus and returns it on close.
- Ad placeholders are clearly labeled "Advertisement."
- Type-check, lint, tests, and production build pass.

---

## Prompt 4 — Homepage Redesign

**Branch:** `phase1/04-homepage-redesign`
**Commit:** `feat: redesign homepage per doc 05 spec`

### Scope

Replace the current minimal homepage (title + subtitle + search + flat card
grid) with the full doc 05 spec: enlarged hero search with rotating placeholder,
category chip strip, metadata line, trending row, recently-used row (when
history exists), category tile grid, and one ad unit.

### What to review first

- `client/src/app/features/home/home.ts` — current implementation.
- `client/src/app/features/home/home.html` — current template.
- `client/src/app/features/home/home.scss` — current styles.
- `client/src/app/features/tools/tool-registry.service.ts` — `tools()`,
  `isLoading()`, `error()` signals.
- `client/src/app/features/tools/search-index.service.ts` — `entries()` signal.
- `client/src/app/features/tools/tool-categories.ts` — `TOOL_CATEGORY_META`.
- `client/src/app/shared/components/search-bar/search-bar.ts` — hero search.
- `client/src/app/shared/components/tool-tile/tool-tile.ts` — from Prompt 3.
- `client/src/app/shared/components/category-tile/category-tile.ts` — from Prompt 3.
- `client/src/app/shared/ad-components/ad-banner/ad-banner.ts` — from Prompt 3.
- `docs/design/05-dashboard-home-design.md` — the full spec.
- `docs/design/07-responsive-strategy.md` §3 — mobile homepage behavior.

### Files to update

```
client/src/app/features/home/home.ts
client/src/app/features/home/home.html
client/src/app/features/home/home.scss
client/src/app/features/home/home.spec.ts
```

### Files to create

```
client/src/app/features/tools/recently-used.service.ts
client/src/app/features/tools/recently-used.service.spec.ts
client/src/app/features/tools/trending.service.ts
client/src/app/features/tools/trending.service.spec.ts
```

### Requirements

**Hero search:**
- Enlarged search bar (larger padding, Body-large sizing per doc 05 §1).
- Placeholder text rotates through real tool names on desktop
  ("Try: BMI Calculator…", "Try: JSON Formatter…", etc.) with a 3-second
  interval. On mobile: static placeholder, no rotation (doc 07 §2).
- Search selection navigates to the tool page.

**Category chip strip:**
- Single row of 11 category chips (name + small icon), all visible on desktop,
  horizontally scrollable on tablet.
- Mobile: show 4–5 chips plus a "View all categories ↓" link that scrolls to
  the category grid (doc 07 §3).
- Each chip links to its category page.

**Metadata line:**
- Below the search: "{N} tools · 11 categories · zero sign-up" (Caption type,
  secondary color, centered).
- N is derived from `ToolRegistryService.tools().length`.

**Trending row:**
- Section heading "Trending" (Subhead type).
- Horizontal row of ToolTile (compact layout).
- Sourced from `TrendingService` — a local service that returns a static
  list of 6 tools from the registry (the ones with the highest slug
  alphabetical order, or a hand-picked list). This is explicitly a
  placeholder for real site-wide data; document this clearly in the service.
- Loading and error states: if trending fails, the section is hidden (do not
  block the homepage).

**Recently Used row:**
- Section heading "Recently Used" (Subhead type).
- Horizontal row of ToolTile (compact layout).
- Sourced from `RecentlyUsedService` — a local `localStorage`-backed
  service storing up to 6 tool slugs + timestamps.
- The section renders ONLY when history exists (no empty state per doc 05 §3).
- "Clear" button to remove history.

**Category grid:**
- Section heading "Browse All Categories" (Subhead type).
- Grid of CategoryTile components, alphabetical order.
- Tool count per category derived from the registry.
- Desktop: up to 4 tiles per row. Tablet: 2–3. Mobile: horizontal list-rows.
- Per doc 05 §2: tiles are uniform-sized, alphabetical, counts are low-contrast.

**Ad unit:**
- One `AdBanner` below the category grid, before the footer.
- Hidden on mobile (doc 07 §2).

**Loading and error states:**
- Registry loading: show a loading message in the category grid area.
- Registry error: show an EmptyState with "Couldn't load tools" message and
  a retry action.

### RecentlyUsedService

- `recentTools(): readonly RecentTool[]` signal.
- `add(slug: string, category: ToolCategorySegment): void` — adds to front,
  deduplicates, caps at 6.
- `clear(): void` — empties history.
- Uses `localStorage` key `maaruri-recent-tools`.
- Stores: `[{ slug, category, timestamp }]`.
- Guards all storage access with `isPlatformBrowser`.
- On SSR: returns empty array (no storage access).
- Validates that stored slugs still exist in the registry before rendering
  (invalid entries are filtered out).

### TrendingService

- `trendingTools(): readonly ToolMeta[]` signal.
- Returns 6 tools from the registry as a static placeholder.
- Documents clearly: "This is a placeholder. Real trending requires a
  server-controlled write path. Do not pretend local data is site-wide usage."
- If the registry fails, returns empty array (section hidden on homepage).

### Tests

- Homepage renders hero search, chips, metadata, trending, category grid.
- Recently Used section does not render when history is empty.
- Recently Used section renders when history has entries.
- Category tiles link to correct category routes.
- Tool tiles in trending link to correct tool routes.
- Registry loading state shows loading message.
- Registry error state shows error message with retry.
- Mobile: chips show curated subset + "View all categories" link.
- Mobile: ad banner is hidden.
- Desktop: placeholder text rotates.
- Mobile: placeholder text is static.
- Search selection navigates to tool page.
- RecentlyUsedService: add, deduplicate, cap at 6, clear, SSR safety.
- TrendingService: returns tools, handles empty registry.

### Completion criteria

- Homepage matches doc 05 wireframe on desktop.
- Homepage adapts correctly on tablet and mobile per doc 07.
- Trending and Recently Used rows work.
- Category grid is alphabetical with correct counts.
- Ad is placed correctly and hidden on mobile.
- Type-check, lint, tests, and production build pass.
- Verified in browser at all three breakpoints, both themes.

---

## Prompt 5 — Category Browse Pages

**Branch:** `phase1/05-category-browse`
**Commit:** `feat: implement category browse pages per Template B`

### Scope

Replace the `ToolComingSoon` placeholder on every category's index route
with a real category browse page: category legend, tool grid, sort/filter,
embedded ad, empty/loading/error states.

### What to review first

- `client/src/app/features/tools/create-tool-category-routes.ts` — current
  factory that wires both `''` and `:toolSlug` to `ToolComingSoon`.
- `client/src/app/features/tools/tool-categories.ts` — `TOOL_CATEGORY_META`.
- `client/src/app/features/tools/tool-registry.service.ts` — `tools()` signal.
- `client/src/app/shared/components/tool-tile/tool-tile.ts` — from Prompt 3.
- `client/src/app/shared/components/empty-state/empty-state.ts` — from Prompt 3.
- `client/src/app/shared/ad-components/ad-in-article/ad-in-article.ts` — from Prompt 3.
- `docs/design/04-page-layout-system.md` — Template B spec.
- `docs/design/07-responsive-strategy.md` §3/§4 — mobile/tablet category page.

### Files to create

```
client/src/app/features/tools/category-browse/category-browse.ts
client/src/app/features/tools/category-browse/category-browse.html
client/src/app/features/tools/category-browse/category-browse.scss
client/src/app/features/tools/category-browse/category-browse.spec.ts
```

### Files to update

```
client/src/app/features/tools/create-tool-category-routes.ts
  — index route loadComponent → CategoryBrowse instead of ToolComingSoon
client/src/app/features/tools/create-tool-category-routes.spec.ts
  — update to verify CategoryBrowse is loaded
```

### Requirements

**CategoryBrowse component:**
- Reads `category` segment from route data (via `withComponentInputBinding`).
- Reads `title`, `metaDescription`, `breadcrumbLabel` from route data.
- Filters `ToolRegistryService.tools()` by the current category segment.
- Displays:
  - Category legend: category title (Subhead type), tool count (Caption),
    sort control.
  - Tool grid: `ToolTile` (grid layout) for each tool in this category.
  - Embedded ad: `AdInArticle` placeholder inserted into the grid at every
    12th tile on desktop, every 16th–20th on mobile (doc 07 §3).
  - Empty state: `EmptyState` with "No tools in this category yet" and a
    link to browse all categories.
  - Loading state: loading message while registry loads.
  - Error state: `EmptyState` with error message and retry.

**Sort/filter:**
- Sort by: name (A–Z, default), name (Z–A). Keep it simple — no complex
  filtering yet.
- Desktop: inline dropdown (use `SelectControl`). Mobile: bottom-sheet
  (use `Modal` from Prompt 3).

**Grid:**
- Desktop: `repeat(auto-fill, minmax(220px, 1fr))`, up to 6–7 columns at 1440px.
- Tablet: 2–3 columns.
- Mobile: single column list (ToolTile compact or horizontal layout).

**Invalid category:**
- If the category segment does not match any `TOOL_CATEGORY_SEGMENTS` value,
  the route should not match (the router handles this — only valid segments
  have routes). No additional 404 logic needed here.

**Ad interval:**
- Track the tile index. When `(index + 1) % interval === 0`, insert an
  `AdInArticle` placeholder instead of a tool tile.
- Interval: 12 on desktop/tablet, 18 on mobile. Use a signal or computed
  based on breakpoint.

### Tests

- Renders category title, count, and tool grid.
- Filters tools by category correctly.
- Sort A–Z and Z–A work.
- Empty category shows empty state.
- Loading state shows loading message.
- Error state shows error message.
- Ad placeholder appears at the correct interval.
- Mobile: single column, adjusted ad interval.
- Desktop: multi-column grid.

### Completion criteria

- All 11 category routes render CategoryBrowse instead of ToolComingSoon.
- Tool grids are filtered by category.
- Sort works.
- Ad placeholders are embedded at the correct intervals.
- Empty, loading, and error states are friendly and actionable.
- Type-check, lint, tests, and production build pass.
- Verified in browser on at least 3 categories at all three breakpoints.

---

## Prompt 6 — Tool Shell and Registry Resolution

**Branch:** `phase1/06-tool-shell`
**Commit:** `feat: add tool detail shell, registry resolution, invalid-slug 404`

### Scope

Replace `ToolComingSoon` on the `:toolSlug` route with a real tool detail
shell (Template A) that resolves the slug against the registry, renders a
404 for invalid slugs, and provides the layout frame every tool will render
inside: Readout area, input area, explanation, related tools, sidebar ad.

### What to review first

- `client/src/app/features/tools/create-tool-category-routes.ts` — currently
  wires `:toolSlug` to `ToolComingSoon`.
- `client/src/app/features/tools/tool-registry.service.ts` — `tools()` signal.
- `client/src/app/shared/models/tool-meta.ts` — `ToolMeta`.
- `client/src/app/shared/components/breadcrumb/breadcrumb.ts` — breadcrumbs.
- `client/src/app/shared/ad-components/ad-rectangle/ad-rectangle.ts` — sidebar ad.
- `client/src/app/shared/components/tool-tile/tool-tile.ts` — related tools.
- `client/src/app/shared/components/empty-state/empty-state.ts` — 404 state.
- `client/src/app/core/seo/seo.service.ts` — SEO/meta.
- `client/src/app/core/seo/breadcrumb.service.ts` — breadcrumb trail.
- `docs/design/04-page-layout-system.md` — Template A spec.
- `docs/design/07-responsive-strategy.md` §3 — mobile tool page behavior.

### Files to create

```
client/src/app/features/tools/tool-shell/tool-shell.ts
client/src/app/features/tools/tool-shell/tool-shell.html
client/src/app/features/tools/tool-shell/tool-shell.scss
client/src/app/features/tools/tool-shell/tool-shell.spec.ts
client/src/app/features/tools/tool-shell/tool-page-contract.ts
client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.ts
client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.html
client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.scss
client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.spec.ts
```

### Files to update

```
client/src/app/features/tools/create-tool-category-routes.ts
  — :toolSlug route loadComponent → ToolShell instead of ToolComingSoon
client/src/app/features/tools/create-tool-category-routes.spec.ts
  — update to verify ToolShell is loaded
```

### Files to delete

```
client/src/app/features/tools/tool-shell/tool-coming-soon.ts
client/src/app/features/tools/tool-shell/tool-coming-soon.spec.ts
```

### ToolPageContract interface (`tool-page-contract.ts`)

```typescript
export interface ToolPageContract {
  readonly tool: ToolMeta;
  readonly readout: Signal<string | null>;
  readonly readoutUnit?: Signal<string | null>;
  readonly inputs: Signal<boolean>; // true when inputs are valid
  readonly explanation: Signal<string | null>;
  readonly relatedTools: Signal<ToolMeta[]>;
}
```

The shell defines this contract. Each tool component implements it by
providing signals for the shell to render. The shell handles: layout,
breadcrumbs, SEO, ad placement, related-tools rendering, and the 404 case.

### ToolShell component

**Inputs (from route data + params via `withComponentInputBinding`):**
- `toolSlug: string | undefined` — from the `:toolSlug` route param.
- `title: string` — from route data (category title, used as fallback).
- `metaDescription: string` — from route data.
- `breadcrumbLabel: string` — from route data.

**Behavior:**
1. On init, resolve `toolSlug` against `ToolRegistryService.tools()`.
2. If the tool exists:
   - Set the page title to the tool's `title`.
   - Set the meta description to the tool's `seoDescription`.
   - Update breadcrumbs: Home > Category > Tool Title.
   - Render the tool component (dynamically loaded based on `componentKey`).
   - Render the shell frame: Readout area, input area (where the tool
     component renders), explanation section, related tools, sidebar ad.
3. If the tool does NOT exist:
   - Render `ToolNotFound` component.
   - Set page title to "Tool Not Found".
   - Breadcrumbs: Home > Category > Not Found.

**Layout (Template A per doc 04):**
- Desktop: two-column — content (Readout + inputs + explanation + related)
  on the left, 300px sticky `AdRectangle` on the right.
- Tablet: single column, ad inline below the Readout.
- Mobile: single column, Readout is sticky below the header when scrolling
  (doc 07 §3), ad inline.

**Readout area:**
- A recessed panel: `--color-readout-bg` background, `--color-readout-text`
  text, `--font-mono`, tabular-nums.
- The active value is rendered in `--color-accent` (amber).
- CopyButton in the corner.
- The acknowledgment pulse (doc 08 §5) fires when the value changes.

**Input area:**
- The tool component renders here via `<ng-content>` or a dynamic component.
- The shell provides no inputs itself — the tool owns this area.

**Explanation section:**
- Reading column capped at 720px.
- The tool provides explanation content as a signal (string or template).

**Related tools:**
- Horizontal row of ToolTile (compact layout).
- Up to 4 related tools from the same category (excluding the current tool).
- If fewer than 1 related tool exists, hide the section.

**ToolNotFound component:**
- Per doc 09 §3: "This tool doesn't exist. It may have moved — try search,
  or browse all 200 tools."
- Links: search (or home), category browse page.
- Uses `EmptyState` component.

### Dynamic tool loading

- The shell needs to load the correct tool component based on `componentKey`
  from `ToolMeta`.
- Use a registry map: `const TOOL_COMPONENTS: Record<string, () => Promise<...>>`
  mapping `componentKey` to a lazy `import()`.
- Start with a single test tool: `TestTool` (a minimal tool that outputs a
  fixed value) to prove the shell works. This tool is removed in Phase 2
  when real tools are implemented.
- If `componentKey` is not in the map, render `ToolNotFound`.

### Tests

- ToolShell renders Readout, input area, explanation, related tools for a
  valid tool.
- ToolShell renders ToolNotFound for an invalid slug.
- Breadcrumbs are correct for both cases.
- SEO title and description are set from the tool's metadata.
- Related tools are filtered by category and exclude the current tool.
- Desktop: two-column layout with sidebar ad.
- Mobile: single column, sticky Readout.
- CopyButton copies the Readout value.
- ToolNotFound shows the correct message and links.

### Completion criteria

- `ToolComingSoon` is deleted; `ToolShell` replaces it on all `:toolSlug` routes.
- Valid slugs render the shell with a test tool.
- Invalid slugs render ToolNotFound.
- Breadcrumbs, SEO, and related tools work.
- Desktop two-column and mobile single-column layouts work.
- Type-check, lint, tests, and production build pass.
- Verified in browser with a valid slug and an invalid slug.
