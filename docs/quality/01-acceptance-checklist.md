# Final Implementation Checklist

Use this checklist after every prompt and again at the end of each phase.
Do not declare a prompt complete until every applicable box is verified.

---

## Per-Prompt Checklist

Run these after every prompt:

- [ ] Type-check passes (`ng build` or `tsc --noEmit`)
- [ ] Lint passes (`ng lint`)
- [ ] Unit tests pass (`ng test`)
- [ ] Production build passes (`ng build`)
- [ ] Browser verified at desktop width (>1024px)
- [ ] Browser verified at tablet width (768–1024px)
- [ ] Browser verified at mobile width (<768px)
- [ ] Browser verified in light theme
- [ ] Browser verified in dark theme
- [ ] No console errors
- [ ] No hydration warnings in console
- [ ] No horizontal scroll on mobile
- [ ] All new components have spec files
- [ ] All new services have spec files
- [ ] No unrelated code was rewritten

---

## Phase 1 Completion Checklist

After all 6 Phase 1 prompts:

### Application Shell
- [ ] Header renders on every page with logo, category nav, search, theme toggle
- [ ] Footer renders on every page with category links and static page links
- [ ] Skip link is hidden by default, visible on focus
- [ ] Router outlet is inside `<main>` landmark
- [ ] `<header role="banner">`, `<footer role="contentinfo">`, `<main>` present
- [ ] Mobile hamburger menu opens and closes with keyboard
- [ ] All touch targets are at least 44×44px on mobile
- [ ] Navigation is locale-aware for all links

### Design Foundation
- [ ] IBM Plex Sans Condensed loads and applies to headings
- [ ] Public Sans loads and applies to body text
- [ ] IBM Plex Mono loads and applies to Readout values
- [ ] `font-display: swap` is set (no FOIT)
- [ ] Body has correct background, text color, font, line-height, margin
- [ ] Headings have correct font-family, weight, line-height
- [ ] Links have underline with visible hover and focus states
- [ ] `::selection` has readable contrast in both themes
- [ ] `prefers-reduced-motion` disables transitions globally
- [ ] `prefers-color-scheme: dark` is detected on first visit
- [ ] Explicit theme toggle overrides OS preference
- [ ] Buttons have rest-state bottom shadow
- [ ] Cards have hover shadow
- [ ] 11 category color tokens are defined and distinct
- [ ] Amber is only used for Readout, focus rings, and active suggestions

### Shared Components
- [ ] ToolTile renders in grid and compact layouts
- [ ] CategoryTile renders with category-color border at rest
- [ ] TextInput has label association, hint, error, disabled states
- [ ] SelectControl has label association and options
- [ ] TextareaControl has label association, rows, maxLength
- [ ] Modal traps focus, closes on Escape, closes on backdrop
- [ ] EmptyState shows message and optional action
- [ ] CopyButton copies value, shows check, fires toast
- [ ] Ad placeholders are labeled "Advertisement"
- [ ] All components are on the `/dev/ui-kit` page
- [ ] All components pass unit tests

### Homepage
- [ ] Hero search is enlarged with rotating placeholder on desktop
- [ ] Hero search has static placeholder on mobile
- [ ] Category chip strip shows all 11 on desktop
- [ ] Category chip strip shows 4–5 + "View all categories" on mobile
- [ ] Metadata line shows correct tool count
- [ ] Trending row renders 6 ToolTiles (compact)
- [ ] Recently Used row does NOT render when history is empty
- [ ] Recently Used row renders when history exists
- [ ] Category grid is alphabetical with correct counts
- [ ] Ad banner is below category grid, hidden on mobile
- [ ] Registry loading state shows loading message
- [ ] Registry error state shows error with retry

### Category Browse Pages
- [ ] All 11 category routes render CategoryBrowse (not ToolComingSoon)
- [ ] Category title, count, and sort control display
- [ ] Tool grid is filtered by category
- [ ] Sort A–Z and Z–A work
- [ ] Ad placeholder appears at correct interval (12 desktop, 18 mobile)
- [ ] Empty category shows empty state
- [ ] Loading and error states work
- [ ] Desktop: multi-column grid
- [ ] Mobile: single column

### Tool Shell
- [ ] ToolComingSoon is deleted
- [ ] ToolShell renders for valid slugs
- [ ] ToolNotFound renders for invalid slugs
- [ ] Breadcrumbs are correct for valid and invalid cases
- [ ] SEO title and description come from tool metadata
- [ ] Related tools are filtered by category, excluding current tool
- [ ] Desktop: two-column layout with sidebar ad
- [ ] Tablet: single column, inline ad
- [ ] Mobile: single column, sticky Readout, inline ad
- [ ] CopyButton copies Readout value
- [ ] Readout pulse fires on value change

---

## Phase 2 Completion Checklist

After all 16 tool prompts:

### Per-Tool (verify for each tool)
- [ ] Tool renders inside ToolShell
- [ ] Tool appears in tool-registry.json with correct slug, category, title
- [ ] Tool appears in search-index.json
- [ ] Tool slug appears in TOOL_SLUGS_BY_CATEGORY
- [ ] Tool componentKey is in ToolShell component map
- [ ] Readout shows the primary result in amber, --font-mono
- [ ] Inputs validate on blur (not on every keystroke)
- [ ] Reset button clears inputs and result
- [ ] CopyButton copies the result
- [ ] Explanation section explains the result in plain language
- [ ] Tool works in light and dark themes
- [ ] Tool works at desktop, tablet, mobile widths
- [ ] Unit tests for calculation/logic pass
- [ ] Unit tests for validation pass
- [ ] Component tests pass
- [ ] Route test passes
- [ ] No eval, no Function constructors, no innerHTML with untrusted input

### All Tools
- [ ] All 16 tools are implemented and verified
- [ ] Category pages show the correct tools for each category
- [ ] Search finds all 16 tools
- [ ] No console errors on any tool page
- [ ] No hydration warnings on any tool page

---

## Phase 3 Completion Checklist

After all 3 Phase 3 prompts:

### Recently Used
- [ ] Opening a tool records it in Recently Used
- [ ] Recently Used shows up to 6 tools on homepage
- [ ] Clearing history works
- [ ] Invalid slugs are filtered out
- [ ] SSR does not crash (no localStorage access during SSR)
- [ ] Storage failure is handled gracefully

### SEO and Prerender
- [ ] All tool pages have unique titles and descriptions
- [ ] JSON-LD is present in prerendered HTML
- [ ] Invalid slugs return not-found during SSR
- [ ] `ng build` prerenders all routes without errors
- [ ] Sitemap generation process is documented

### Final Review
- [ ] Keyboard-only navigation works across the entire app
- [ ] Screen-reader landmarks are correct on every page
- [ ] Heading hierarchy is logical (one h1 per page)
- [ ] All form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Focus-visible ring appears on all interactive elements
- [ ] Touch targets are at least 44×44px on mobile
- [ ] No horizontal scroll on mobile
- [ ] Production bundle is within budget
- [ ] Fonts load with display=swap
- [ ] Images are lazy-loaded
- [ ] No eval, no innerHTML with untrusted input, no untrusted URL navigation
- [ ] tool-registry.json and search-index.json are in sync
- [ ] TOOL_SLUGS_BY_CATEGORY matches registry entries
- [ ] All unit tests pass
- [ ] Lint passes
- [ ] Type-check passes
- [ ] Production build passes
