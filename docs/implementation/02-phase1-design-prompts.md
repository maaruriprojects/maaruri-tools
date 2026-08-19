# Phase 1 — Design Implementation

This document provides the step-by-step design prompts for Phase 1.
Each prompt is ready to copy and paste into the AI coding tool.

These are the same prompts as in `01-phase1-existing-code-changes.md`,
reformatted as standalone copy-paste blocks with all context inline.

---

## Prompt 1 — Application Shell

```
Review the existing Angular project before making changes. Read these files:
- client/src/app/app.html
- client/src/app/app.ts
- client/src/app/app.scss
- client/src/app/app.routes.ts
- client/src/app/core/config/route-paths.ts
- client/src/app/features/tools/tool-categories.ts
- client/src/app/core/theme/theme.service.ts
- client/src/app/features/tools/search-index.service.ts
- client/src/app/shared/components/search-bar/search-bar.ts
- client/src/app/shared/components/breadcrumb/breadcrumb.ts
- client/src/app/shared/components/button/button.ts
- client/src/app/core/i18n/locale.ts

Do not rewrite unrelated code.

Build the application shell described in docs/design/01-design-direction.md
and docs/design/04-page-layout-system.md.

Create these files:
- client/src/app/layout/header/header.ts
- client/src/app/layout/header/header.html
- client/src/app/layout/header/header.scss
- client/src/app/layout/header/header.spec.ts
- client/src/app/layout/footer/footer.ts
- client/src/app/layout/footer/footer.html
- client/src/app/layout/footer/footer.scss
- client/src/app/layout/footer/footer.spec.ts
- client/src/app/layout/shell/shell.ts
- client/src/app/layout/shell/shell.html
- client/src/app/layout/shell/shell.scss
- client/src/app/layout/shell/shell.spec.ts

Update these files:
- client/src/app/app.html — replace with shell wrapping router-outlet
- client/src/app/app.ts — import Shell, remove inline theme-toggle
- client/src/app/app.scss — remove temporary .theme-toggle styles

Header (control strip) requirements:
- Left: text wordmark "Maaruri Tools" in --font-display
- Center: category navigation from TOOL_CATEGORY_META (all 11 categories)
  - Desktop: inline list or dropdown
  - Mobile: hamburger menu opening a panel with all categories
- Right: jump-search and theme toggle
  - Desktop: visible AppSearchBar (entries from SearchIndexService)
  - Mobile: search icon opening full-width search mode
  - Theme toggle: calls ThemeService.toggle()
- Sticky at top
- Background: --color-surface, bottom border --color-border, no shadow at rest
- All interactive targets at least 44x44px on touch layouts

Footer requirements:
- Category index: links to all 11 categories (locale-aware)
- Static page links: About, Contact, Opportunities
- Copyright line
- Background: --color-surface, top border --color-border

Shell requirements:
- Renders <app-header>, <main id="main-content">, <app-footer>
- Skip link: <a class="skip-link" href="#main-content">Skip to content</a>
  - Hidden by default, visible on :focus-visible
- Breadcrumbs render inside <main> above <router-outlet>
- Loading overlay and toast remain at app level

Navigation:
- All links locale-aware: ['/', DEFAULT_LOCALE.code, segment]
- Category links use TOOL_CATEGORY_SEGMENT_LIST and TOOL_CATEGORY_META
- Search selection navigates to ['/', DEFAULT_LOCALE.code, entry.category, entry.slug]

Accessibility:
- <header role="banner">, <footer role="contentinfo">, <main>
- Hamburger menu: aria-expanded, aria-controls, keyboard operable
- Theme toggle: aria-label, aria-pressed
- Search icon button: aria-label, aria-expanded when open

SSR safety:
- No window/document/localStorage/sessionStorage access outside
  afterNextRender or isPlatformBrowser guards
- Header and footer must render correctly during SSR

Tests:
- Header renders logo, category nav, search, theme toggle
- Footer renders all links
- Shell renders skip link, header, main, footer in order
- Skip link hidden by default, visible on focus
- Theme toggle calls ThemeService.toggle()
- Mobile menu opens/closes (aria-expanded toggles)
- Category links are locale-aware

Run type-check, lint, unit tests, and production build. Fix all errors.
Verify in browser at desktop, tablet, and mobile widths.
```

---

## Prompt 2 — Design Foundation

```
Review these files before making changes:
- client/src/index.html
- client/src/styles.scss
- client/src/styles/_tokens.scss
- client/src/styles/theme.scss
- client/src/styles/_focus-visible.scss
- client/src/styles/_breakpoints.scss
- client/src/app/core/theme/theme.service.ts
- client/src/app/shared/components/button/button.scss
- client/src/app/shared/components/card/card.scss
- docs/design/02-color-typography.md
- docs/design/03-iconography-logos.md
- docs/design/06-component-visual-design.md

Load the three design-system fonts and add global base styles.

Update client/src/index.html:
- Add <link rel="preconnect" href="https://fonts.googleapis.com">
- Add <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
- Add stylesheet link for:
  IBM Plex Sans Condensed (weights 500, 600)
  Public Sans (weights 400, 600)
  IBM Plex Mono (weight 500)
  with display=swap

Create client/src/styles/_base.scss:
- body: background --color-bg, color --color-text-primary,
  font-family --font-body, font-size --type-body-size,
  line-height --type-body-line-height, margin 0
- h1-h6: font-family --font-display, font-weight 600, line-height 1.25,
  color --color-text-primary, margins from spacing scale
- a: color --color-info, text-decoration underline,
  hover text-decoration-thickness 2px
- ::selection: background --color-accent, color --color-readout-bg
- @media (prefers-reduced-motion: reduce): disable all transitions/animations
- Import in styles.scss after _focus-visible

Update client/src/styles/_tokens.scss:
- Add --shadow-rest: 0 1px 0 rgba(0,0,0,0.25) (used by buttons at rest)

Update client/src/styles/theme.scss:
- Add dark value for --shadow-rest: 0 1px 0 rgba(0,0,0,0.5)
- Add --shadow-hover: 0 4px 8px rgba(0,0,0,0.08) light / 0 4px 8px rgba(0,0,0,0.3) dark

Create client/src/styles/_category-colors.scss:
- Define 11 CSS custom properties for category accent colors
- Use hsl(H, 42%, 42%) light / hsl(H, 38%, 62%) dark per doc 03
- Hues must be >=25 degrees apart and outside exclusion zones
  (15-50, 135-165, 195-225, 345-15)
- Suggested: Time&Date 175, Health 320, Finance 255, Work 80,
  Converters 230, Everyday 110, Creative 300, Development 210,
  Travel 65, Document 140, Personal 270
- Document the final hues in the file

Update client/src/app/core/theme/theme.service.ts:
- On first visit (no sessionStorage value), check
  window.matchMedia('(prefers-color-scheme: dark)').matches
- Use that as initial theme
- Once user toggles, persist their choice
- Guard with isPlatformBrowser

Update client/src/app/shared/components/button/button.scss:
- Add box-shadow: var(--shadow-rest) to primary and secondary at rest
- Remove on :active

Update client/src/app/shared/components/card/card.scss:
- Add box-shadow: var(--shadow-hover) on hover

Tests:
- ThemeService: first-visit defaults to prefers-color-scheme value
- ThemeService: explicit toggle overrides prefers-color-scheme
- Existing tests still pass

Run type-check, lint, tests, and production build.
Verify in browser: both themes, all three breakpoints.
Confirm fonts load in DevTools Network and Computed Styles.
```

---

## Prompt 3 — Shared Components

```
Review all existing components in client/src/app/shared/components/ before
making changes. Match their conventions: signal inputs/outputs, standalone,
templateUrl, styleUrl, spec file.

Also review:
- client/src/app/shared/models/tool-meta.ts
- client/src/app/shared/models/search-index-entry.ts
- docs/design/06-component-visual-design.md
- docs/design/03-iconography-logos.md

Create these components in client/src/app/shared/components/:

1. ToolTile
   - Inputs: tool (ToolMeta), layout ('grid'|'compact', default 'grid'),
     link (CardLink)
   - Grid: icon 24px, name (Label type), description (Body-sm, secondary)
     1px border, --radius-md, --color-surface bg
     Hover: border to category color, translateY(-2px), hover shadow
     Mobile: 1px category-color border at rest
   - Compact: horizontal, icon 20px + name only, no description
   - Focus-visible: global ring on whole tile

2. CategoryTile
   - Inputs: categorySegment, title, toolCount, icon
   - Larger: --space-lg padding, 40px icon
   - 1.5px border in category accent color at rest (always visible)
   - Contents: icon, name (Subhead), count (Caption, secondary)
   - Hover: border to 2px, translateY(-2px), hover shadow
   - Mobile: horizontal list-row (icon left, name+count right)
   - Link: locale-aware category route

3. TextInput
   - Inputs: label (required), value, placeholder, hint, error, disabled,
     required, inputmode, type (default 'text'), id (auto-generated)
   - Output: valueChange (string)
   - Label associated via <label for>
   - Hint: Caption, secondary, aria-describedby
   - Error: Caption, error color, aria-invalid on input
   - States per doc 06 §3: default, focus (border+amber ring),
     error (red border+message), disabled (bg recedes)
   - Padding 10px vertical, --space-md horizontal, --radius-sm

4. SelectControl
   - Same as TextInput but <select>
   - Additional input: options ({value, label}[])

5. TextareaControl
   - Same as TextInput but <textarea>
   - Additional inputs: rows (default 4), maxLength

6. Modal
   - Inputs: open (boolean), title (string), closeOnBackdrop (default true)
   - Output: close (void)
   - ARIA dialog pattern, focus trap, escape closes, backdrop closes
   - Mobile: bottom-sheet (translateY), desktop: centered with backdrop
   - role=dialog, aria-modal=true, aria-labelledby
   - Focus to dialog on open, returns to trigger on close
   - Reduced motion: no slide, fade only

7. EmptyState
   - Inputs: message (required), actionLabel, icon (optional)
   - Output: action (void)
   - Centered text, no illustration, optional Secondary button
   - Per doc 09 §2: states fact, proposes next action

8. CopyButton
   - Inputs: value (required), label (default "Copy")
   - Output: copied (void)
   - Uses navigator.clipboard.writeText, guard with isPlatformBrowser
   - Success: icon to check for 1200ms, toast "Copied {value}"
   - Failure: error toast
   - Tabler copy icon, --color-icon-muted, 16-20px

Create ad placeholder components in client/src/app/shared/ad-components/:

9. AdBanner
   - Full-width, --color-surface-placeholder bg, --color-border-subtle border
   - "Advertisement" label (Caption, centered, secondary)
   - Height 90px desktop, hidden on mobile

10. AdRectangle
    - 300x250 placeholder, same styling
    - Used in tool-page sidebar

11. AdInArticle
    - Inline placeholder, same styling, max-width 728px

Create client/src/app/shared/models/category-meta.ts:
- CategoryMeta interface: segment, title, breadcrumbLabel,
  metaDescription, icon, toolCount

Icon system:
- Install @tabler/icons or create a lightweight IconComponent
  that takes a name input and renders Tabler outline SVG paths
- Icon color: --color-icon-muted default, --color-text-primary with active text
- Never --color-accent
- Sizes: 20px nav/buttons, 16px dense, 24px tool tiles, 40px category tiles

Add all new components to the /dev/ui-kit page for visual QA.

Each component needs a spec file testing:
- Renders with required inputs
- Emits outputs on interaction
- Accessibility attributes correct
- Disabled state works
- Error state shows message and aria-invalid (form controls)
- Modal: focus trap, escape close, backdrop close, aria attributes
- CopyButton: calls clipboard, shows check, fires toast

Run type-check, lint, tests, and production build. Fix all errors.
Verify all components in browser at both themes and all breakpoints.
```

---

## Prompt 4 — Homepage Redesign

```
Review these files before making changes:
- client/src/app/features/home/home.ts
- client/src/app/features/home/home.html
- client/src/app/features/home/home.scss
- client/src/app/features/home/home.spec.ts
- client/src/app/features/tools/tool-registry.service.ts
- client/src/app/features/tools/search-index.service.ts
- client/src/app/features/tools/tool-categories.ts
- client/src/app/shared/components/search-bar/search-bar.ts
- client/src/app/shared/components/tool-tile/tool-tile.ts
- client/src/app/shared/components/category-tile/category-tile.ts
- client/src/app/shared/ad-components/ad-banner/ad-banner.ts
- docs/design/05-dashboard-home-design.md
- docs/design/07-responsive-strategy.md

Redesign the homepage to match doc 05.

Update:
- client/src/app/features/home/home.ts
- client/src/app/features/home/home.html
- client/src/app/features/home/home.scss
- client/src/app/features/home/home.spec.ts

Create:
- client/src/app/features/tools/recently-used.service.ts
- client/src/app/features/tools/recently-used.service.spec.ts
- client/src/app/features/tools/trending.service.ts
- client/src/app/features/tools/trending.service.spec.ts

Homepage sections (top to bottom):

1. Hero search
   - Enlarged AppSearchBar (larger padding, Body-large sizing)
   - Placeholder rotates through tool names on desktop (3s interval)
   - Mobile: static placeholder, no rotation
   - Search selection navigates to tool page

2. Category chip strip
   - 11 chips (name + small icon), all visible on desktop
   - Tablet: horizontally scrollable
   - Mobile: 4-5 chips + "View all categories" link scrolling to grid
   - Each chip links to category page

3. Metadata line
   - "{N} tools · 11 categories · zero sign-up"
   - Caption type, secondary color, centered
   - N from ToolRegistryService.tools().length

4. Trending row
   - "Trending" heading (Subhead)
   - Horizontal row of ToolTile (compact layout), 6 tools
   - Sourced from TrendingService (local placeholder)
   - Hidden if trending data unavailable

5. Recently Used row (only when history exists)
   - "Recently Used" heading (Subhead)
   - Horizontal row of ToolTile (compact layout)
   - Sourced from RecentlyUsedService (localStorage)
   - Does NOT render when empty (no empty state)
   - "Clear" button to remove history

6. Browse All Categories grid
   - "Browse All Categories" heading (Subhead)
   - CategoryTile grid, alphabetical, uniform size
   - Tool counts from registry
   - Desktop: up to 4 per row. Tablet: 2-3. Mobile: horizontal list-rows

7. Ad unit
   - One AdBanner below category grid
   - Hidden on mobile

Loading/error states:
- Registry loading: loading message in category grid area
- Registry error: EmptyState with error message and retry action

RecentlyUsedService:
- recentTools(): readonly RecentTool[] signal
- add(slug, category): adds to front, deduplicates, caps at 6
- clear(): empties history
- localStorage key: maaruri-recent-tools
- Stores: [{slug, category, timestamp}]
- Guards all storage with isPlatformBrowser
- SSR: returns empty array
- Validates stored slugs against registry before rendering

TrendingService:
- trendingTools(): readonly ToolMeta[] signal
- Returns 6 tools from registry as static placeholder
- Document clearly: placeholder, not real site-wide data
- If registry fails, returns empty array (section hidden)

Tests:
- Homepage renders all sections
- Recently Used does not render when empty
- Recently Used renders when history exists
- Category tiles link to correct routes
- Tool tiles link to correct routes
- Registry loading state
- Registry error state with retry
- Mobile: curated chips + View all link
- Mobile: ad hidden
- Desktop: placeholder rotates
- Mobile: placeholder static
- Search selection navigates
- RecentlyUsedService: add, deduplicate, cap, clear, SSR safety
- TrendingService: returns tools, handles empty registry

Run type-check, lint, tests, and production build.
Verify in browser at desktop, tablet, mobile in both themes.
```

---

## Prompt 5 — Category Browse Pages

```
Review these files before making changes:
- client/src/app/features/tools/create-tool-category-routes.ts
- client/src/app/features/tools/create-tool-category-routes.spec.ts
- client/src/app/features/tools/tool-categories.ts
- client/src/app/features/tools/tool-registry.service.ts
- client/src/app/shared/components/tool-tile/tool-tile.ts
- client/src/app/shared/components/empty-state/empty-state.ts
- client/src/app/shared/ad-components/ad-in-article/ad-in-article.ts
- docs/design/04-page-layout-system.md (Template B)
- docs/design/07-responsive-strategy.md

Replace ToolComingSoon on category index routes with a real CategoryBrowse
page.

Create:
- client/src/app/features/tools/category-browse/category-browse.ts
- client/src/app/features/tools/category-browse/category-browse.html
- client/src/app/features/tools/category-browse/category-browse.scss
- client/src/app/features/tools/category-browse/category-browse.spec.ts

Update:
- client/src/app/features/tools/create-tool-category-routes.ts
  (index route loadComponent -> CategoryBrowse)
- client/src/app/features/tools/create-tool-category-routes.spec.ts

CategoryBrowse component:
- Reads category segment from route data (withComponentInputBinding)
- Reads title, metaDescription, breadcrumbLabel from route data
- Filters ToolRegistryService.tools() by category segment
- Displays:
  - Category legend: title (Subhead), tool count (Caption), sort control
  - Tool grid: ToolTile (grid layout) for each tool
  - Embedded ad: AdInArticle at every 12th tile desktop, every 18th mobile
  - Empty state: EmptyState "No tools in this category yet"
  - Loading state: loading message
  - Error state: EmptyState with error message and retry

Sort:
- Sort by name A-Z (default) and Z-A
- Desktop: inline SelectControl
- Mobile: bottom-sheet Modal

Grid:
- Desktop: repeat(auto-fill, minmax(220px, 1fr)), up to 6-7 columns at 1440px
- Tablet: 2-3 columns
- Mobile: single column

Ad interval:
- Track tile index
- Insert AdInArticle when (index+1) % interval === 0
- Interval: 12 desktop/tablet, 18 mobile

Tests:
- Renders category title, count, tool grid
- Filters tools by category
- Sort A-Z and Z-A
- Empty category shows empty state
- Loading state
- Error state
- Ad placeholder at correct interval
- Mobile: single column, adjusted ad interval
- Desktop: multi-column grid

Run type-check, lint, tests, and production build.
Verify in browser on at least 3 categories at all three breakpoints.
```

---

## Prompt 6 — Tool Shell and Registry Resolution

```
Review these files before making changes:
- client/src/app/features/tools/create-tool-category-routes.ts
- client/src/app/features/tools/create-tool-category-routes.spec.ts
- client/src/app/features/tools/tool-registry.service.ts
- client/src/app/shared/models/tool-meta.ts
- client/src/app/shared/components/breadcrumb/breadcrumb.ts
- client/src/app/shared/ad-components/ad-rectangle/ad-rectangle.ts
- client/src/app/shared/components/tool-tile/tool-tile.ts
- client/src/app/shared/components/empty-state/empty-state.ts
- client/src/app/shared/components/copy-button/copy-button.ts
- client/src/app/core/seo/seo.service.ts
- client/src/app/core/seo/breadcrumb.service.ts
- docs/design/04-page-layout-system.md (Template A)
- docs/design/07-responsive-strategy.md (mobile tool page)
- docs/design/08-animation-motion.md (Readout pulse)

Replace ToolComingSoon with a real ToolShell on the :toolSlug route.

Create:
- client/src/app/features/tools/tool-shell/tool-shell.ts
- client/src/app/features/tools/tool-shell/tool-shell.html
- client/src/app/features/tools/tool-shell/tool-shell.scss
- client/src/app/features/tools/tool-shell/tool-shell.spec.ts
- client/src/app/features/tools/tool-shell/tool-page-contract.ts
- client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.ts
- client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.html
- client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.scss
- client/src/app/features/tools/tool-shell/tool-not-found/tool-not-found.spec.ts

Update:
- client/src/app/features/tools/create-tool-category-routes.ts
  (:toolSlug route loadComponent -> ToolShell)
- client/src/app/features/tools/create-tool-category-routes.spec.ts

Delete:
- client/src/app/features/tools/tool-shell/tool-coming-soon.ts
- client/src/app/features/tools/tool-shell/tool-coming-soon.spec.ts

ToolPageContract interface (tool-page-contract.ts):
- tool: ToolMeta
- readout: Signal<string | null>
- readoutUnit: Signal<string | null> (optional)
- inputsValid: Signal<boolean>
- explanation: Signal<string | null>
- relatedTools: Signal<ToolMeta[]>

ToolShell component:
- Inputs from route: toolSlug, title, metaDescription, breadcrumbLabel
- Resolves toolSlug against ToolRegistryService.tools()
- If tool exists:
  - Page title = tool.title
  - Meta description = tool.seoDescription
  - Breadcrumbs: Home > Category > Tool Title
  - Render tool component (dynamic, based on componentKey)
  - Render shell frame: Readout, input area, explanation, related tools, ad
- If tool does NOT exist:
  - Render ToolNotFound
  - Page title = "Tool Not Found"
  - Breadcrumbs: Home > Category > Not Found

Layout (Template A):
- Desktop: two-column — content left, 300px sticky AdRectangle right
- Tablet: single column, ad inline below Readout
- Mobile: single column, Readout sticky below header, ad inline

Readout area:
- Recessed panel: --color-readout-bg, --color-readout-text, --font-mono
- Active value in --color-accent (amber)
- CopyButton in corner
- Acknowledgment pulse (opacity 100->60->100, 150ms) on value change
- Reduced motion: pulse still safe (opacity-only)

Input area:
- Tool component renders here via dynamic component or ng-content
- Shell provides no inputs itself

Explanation section:
- Reading column capped at 720px
- Tool provides explanation as signal (string or template)

Related tools:
- Horizontal row of ToolTile (compact), up to 4 from same category
- Exclude current tool
- Hide section if fewer than 1 related tool

ToolNotFound:
- Message: "This tool doesn't exist. It may have moved — try search, or
  browse all 200 tools."
- Links: home/search, category browse page
- Uses EmptyState

Dynamic tool loading:
- Registry map: Record<string, () => Promise<...>> mapping componentKey
  to lazy import()
- Start with a TestTool (minimal, outputs fixed value) to prove the shell
- If componentKey not in map, render ToolNotFound

Tests:
- ToolShell renders for valid tool
- ToolShell renders ToolNotFound for invalid slug
- Breadcrumbs correct for both cases
- SEO title and description set from tool metadata
- Related tools filtered by category, excluding current
- Desktop: two-column with sidebar ad
- Mobile: single column, sticky Readout
- CopyButton copies Readout value
- ToolNotFound shows correct message and links

Run type-check, lint, tests, and production build.
Verify in browser with a valid slug and an invalid slug.
```
