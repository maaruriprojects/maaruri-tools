# Phase 1 — Design Implementation Prompts

Use these prompts in order. For each prompt, inspect only the listed files, make only the requested changes, reuse existing patterns, and run only the listed focused checks. Do not refactor unrelated code or add dependencies.

---

## Prompt 1 — Application Shell

```
Review only the existing app shell, routing, theme, search, breadcrumb, button, locale, and category metadata files needed for this change, plus docs/design/01-design-direction.md and docs/design/04-page-layout-system.md.

Build the application shell.

Create header, footer, and shell components with matching HTML, SCSS, and focused specs under client/src/app/layout/.

Header:
- Sticky control strip with the “Maaruri Tools” wordmark.
- Locale-aware links for all 11 categories from TOOL_CATEGORY_META and TOOL_CATEGORY_SEGMENT_LIST.
- Desktop category navigation, search, and theme toggle.
- Mobile hamburger category panel and full-width search mode.
- Theme toggle calls ThemeService.toggle().
- Interactive targets are at least 44px on touch layouts.
- Use correct banner semantics, labels, expanded/pressed attributes, and keyboard operation.

Footer:
- Locale-aware links for all categories and About, Contact, and Opportunities.
- Copyright line and required footer semantics.

Shell:
- Render skip link, header, <main id="main-content">, breadcrumbs above router-outlet, footer, loading overlay, and toast.
- Keep SSR-safe browser APIs behind existing browser guards.

Update only app.html, app.ts, and app.scss as needed to use the shell.

Focused tests:
- Header wordmark, navigation, search, theme toggle, and mobile menu.
- Footer links.
- Shell order and skip link.
- Locale-aware category links.
```

---

## Prompt 2 — Design Foundation

```
Review only the existing global styles, tokens, theme service, button/card styles, and docs/design/02-color-typography.md, 03-iconography-logos.md, and 06-component-visual-design.md.

Implement the design foundation:
- Load IBM Plex Sans Condensed 500/600, Public Sans 400/600, and IBM Plex Mono 500 with display=swap.
- Create and import client/src/styles/_base.scss with the required body, heading, link, selection, spacing, typography, and reduced-motion styles.
- Add --shadow-rest and light/dark shadow values.
- Create/update _category-colors.scss with 11 documented category hues following the required spacing and exclusion rules.
- Make ThemeService default to the OS color preference on first visit, then persist user toggles with SSR-safe guards.
- Add rest shadow to primary/secondary buttons and hover shadow to cards.

Do not change component behavior beyond the requested visual foundation.

Focused tests:
- ThemeService first-visit OS preference and explicit toggle persistence.
```

---

## Prompt 3 — Shared Components

```
Review the existing shared components, shared models, dev UI kit, and docs/design/03-iconography-logos.md and 06-component-visual-design.md.

Create or complete only these requested shared pieces, each with matching HTML, SCSS, and focused spec:
- ToolTile: grid/compact layouts, category hover/focus styling, locale-aware link.
- CategoryTile: icon, title, count, category accent, locale-aware link, responsive list layout.
- TextInput, SelectControl, TextareaControl: signal inputs/outputs, labels, hints, errors, disabled state, accessibility, and required visual states.
- Modal: dialog semantics, focus management, Escape/backdrop close, desktop centered layout, mobile bottom sheet, reduced-motion behavior.
- EmptyState: message, optional icon, optional action.
- CopyButton: browser-safe clipboard copy, success check state, success/error toast, copied output.
- AdBanner, AdRectangle, and AdInArticle placeholders with the specified labels, sizing, and responsive visibility.
- CategoryMeta model if it does not already exist.
- Reuse the existing icon approach; do not add an icon dependency unless none exists and it is required.
- Add the requested components to the dev UI kit.

Focused tests cover required inputs, outputs, accessibility, disabled/error states, modal interactions, and clipboard behavior for the components changed here.
```

---

## Prompt 4 — Homepage Redesign

```
Review the existing homepage, registry/search services, category metadata, shared tiles/search/ad components, and docs/design/05-dashboard-home-design.md and 07-responsive-strategy.md.

Update only the homepage files and create the two requested services with focused specs.

Homepage sections, in order:
- Hero search with rotating desktop placeholder every 3 seconds and static mobile placeholder; selection navigates to the tool route.
- Responsive category chip strip with all categories on desktop, horizontal scrolling on tablet, and curated mobile chips plus a “View all categories” link.
- Metadata line using the registry count.
- Trending compact row of up to 6 tools from a documented local placeholder service; hide when unavailable.
- Recently Used compact row only when history exists, backed by browser-safe localStorage, deduplicated, capped at 6, validated against the registry, with Clear.
- Browse All Categories grid with counts and responsive layout.
- AdBanner below the grid, hidden on mobile.
- Registry loading and retryable error states.

RecentlyUsedService must expose recentTools(), add(), and clear(), use key maaruri-recent-tools, and return empty data during SSR.
TrendingService must expose trendingTools(), return up to 6 registry tools, and return empty data on registry failure.

Focused tests only cover the homepage sections and the two services, including responsive behavior represented by existing test patterns, search navigation, storage safety, deduplication, cap, clear, and empty/error handling.
```

---

## Prompt 5 — Category Browse Pages

```
Review only the category route factory/spec, category metadata, registry service, ToolTile, EmptyState, AdInArticle, and the Template B/responsive design docs.

Create CategoryBrowse with matching HTML, SCSS, and focused spec. Update only the category route factory/spec so category index routes load it.

CategoryBrowse:
- Receive categorySegment, title, metaDescription, and breadcrumbLabel through route input binding.
- Filter registry tools by category.
- Show category title, count, ToolTile grid, A–Z/Z–A sorting, loading state, retryable error state, and empty state with browse-all link.
- Use SelectControl on desktop and Modal bottom sheet on mobile.
- Insert AdInArticle after every 12th tile on desktop/tablet and every 18th tile on mobile.
- Use desktop multi-column, tablet 2–3 column, and mobile single-column layouts.

Focused tests only cover filtering, count/title, both sort directions, loading/error/empty states, ad insertion, and responsive class/layout behavior.
```

---

## Prompt 6 — Tool Shell and Registry Resolution

```
Review only the tool route factory/spec, registry, ToolMeta, breadcrumb/SEO services, CopyButton, ToolTile, AdRectangle, EmptyState, and Template A/mobile/readout design docs.

Replace ToolComingSoon on :toolSlug routes with ToolShell. Create only the requested ToolShell, ToolPageContract, ToolNotFound files and focused specs; delete ToolComingSoon and its spec.

ToolPageContract:
- tool: ToolMeta
- readout: Signal<string | null>
- optional readoutUnit: Signal<string | null>
- inputs: Signal<boolean>
- explanation: Signal<string | null>
- relatedTools: Signal<ToolMeta[]>

ToolShell:
- Receive toolSlug, title, metaDescription, breadcrumbLabel, and categorySegment from route binding.
- Resolve the slug against the registry.
- For a valid tool, set title/meta description, render Home > Category > Tool Title, dynamically load the component by componentKey, and render the readout, input area, explanation, related tools, CopyButton, and AdRectangle.
- Use a registry map with the minimal TestTool implementation required to prove dynamic rendering. Unknown component keys render ToolNotFound.
- Show up to 4 same-category related tools excluding the current tool; hide the section when empty.
- Use Template A: desktop content plus 300px sticky sidebar ad; tablet/mobile single column with inline ad; mobile sticky readout.
- Style the readout with the readout colors, mono/tabular numerals, accent value, and a 150ms opacity pulse when the value changes; respect reduced motion.

ToolNotFound:
- Use EmptyState with “This tool doesn’t exist. It may have moved — try search, or browse all 200 tools.”
- Include links to search/home and the category page.
- Set title to “Tool Not Found” and breadcrumbs to Home > Category > Not Found.

Focused tests only cover valid/invalid resolution, dynamic TestTool rendering, breadcrumbs, SEO, related tools, responsive shell classes, CopyButton integration, and ToolNotFound links/message.
```

---

## Prompt 7 — Final Phase 1 Validation

```
Do not change functionality unless a validation failure requires a minimal fix.

Run the complete Phase 1 validation:
- Type-check the client.
- Run lint.
- Run the full unit test suite.
- Run the production build and prerender.
- Verify in a browser at desktop, tablet, and mobile widths, in light and dark themes:
  - application shell navigation and skip link;
  - homepage search, categories, trending/recent sections, and responsive ad;
  - at least three category browse pages with sorting, loading/error/empty behavior, and ad placement;
  - one valid tool slug with readout, copy, explanation, related tools, SEO, breadcrumbs, and sidebar/inline ad behavior;
  - one invalid tool slug with ToolNotFound and correct links.

Fix only failures caused by Phase 1 changes. Report any pre-existing warning separately and do not broaden scope.
```
