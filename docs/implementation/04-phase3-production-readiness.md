# Phase 3 — Production Readiness

After all Phase 1 and Phase 2 prompts are complete and verified, run these
prompts in order.

---

## Prompt 23 — Recently Used History

**Branch:** `phase3/01-recently-used`
**Commit:** `feat: add recently-used tool history with localStorage`

```
Review the existing homepage, routing, tool registry, and browser/SSR
patterns before making changes. Check if RecentlyUsedService already
exists from Prompt 4 — if so, enhance it; if not, create it.

Add Recently Used tool history using browser-local storage only.

Requirements:
- Record a tool after the user successfully opens it (in ToolShell)
- Store only: tool slug, category, timestamp
- Keep a maximum of 6 recent tools
- Remove duplicates while preserving most-recent order
- Ignore invalid or removed tools (validate against registry)
- Do NOT store user-entered calculator values
- Do NOT store health, financial, document, or personal input data
- Handle unavailable browser storage gracefully (try/catch)
- Never access browser storage during SSR (isPlatformBrowser guard)
- Provide a signal-based service with a small, testable API:
  - recentTools(): readonly RecentTool[] signal
  - add(slug, category): void
  - clear(): void
- Render the homepage Recently Used section only when valid history exists
- Use ToolTile (compact layout)
- Provide a clear action to remove recent history
- Add tests for: ordering, deduplication, invalid entries, storage failure,
  SSR safety, empty state

Do NOT use Supabase or any database for this feature. This is device-local
navigation history and should not leave the user's browser.

Run type-check, lint, tests, and production build.
Verify in browser: open tools, return to homepage, see recent, clear history.
Test at desktop, tablet, mobile. Verify SSR does not crash.
```

---

## Prompt 24 — SEO, Prerendering, and Sitemap

**Branch:** `phase3/02-seo-prerender`
**Commit:** `feat: improve SEO, prerendering, and sitemap readiness`

```
Review the current SSR configuration, route configuration, SEO services,
registry, and Angular build configuration before making changes:
- client/src/app/app.routes.server.ts
- client/src/app/app.config.server.ts
- client/src/app/core/seo/seo.service.ts
- client/src/app/core/seo/breadcrumb.service.ts
- client/src/app/core/seo/route-data-title-strategy.ts
- client/src/app/features/tools/tool-registry.ts
- client/src/app/features/tools/tool-registry.service.ts
- client/src/app/features/tools/tool-shell/tool-shell.ts
- client/angular.json

Improve SEO and prerender readiness for all pages.

Requirements:
- Tool pages: use resolved registry metadata for title and description
  (already done in ToolShell — verify it works during SSR)
- Keep titles and descriptions unique per tool
- Generate canonical locale-aware URLs in SEO service
- Preserve JSON-LD behavior (BreadcrumbService already does this)
- Do NOT expose internal errors in metadata
- Invalid slugs: verify they return a proper not-found result during SSR
- Ensure SSR does not access browser-only APIs (no window/document/localStorage)
- Update app.routes.server.ts: ensure TOOL_SLUGS_BY_CATEGORY in tool-registry.ts
  matches the actual tools in tool-registry.json. If they diverge, update
  tool-registry.ts to derive from the same source or document the sync requirement.
- Document how future tools become prerenderable: add a tool to
  tool-registry.json, add its slug to TOOL_SLUGS_BY_CATEGORY, add its
  componentKey to the ToolShell component map.
- Add sitemap generation readiness: create a utility or document the process
  for generating sitemap.xml from the registry data. Do NOT hard-code 200
  future tools — derive from registry.
- Test server rendering for: homepage, a category page, a valid tool page,
  an invalid tool page, a static page.

Do NOT add a CMS or database solely for SEO in this task.

Run type-check, lint, tests, and production build.
Verify in browser: check page source for correct meta tags, JSON-LD, titles.
Test with `ng build` to verify prerendering works without errors.
```

---

## Prompt 25 — Final Quality and Accessibility Review

**Branch:** `phase3/03-final-review`
**Commit:** `fix: final accessibility, performance, and quality review`

```
Perform a focused review of the completed application without changing
product scope. Review every area below. Fix only confirmed issues. Do NOT
introduce broad refactoring.

Architecture:
- Verify one-way dependency rule: features/layout -> shared -> core
  (grep for imports that violate this)
- Verify all components are standalone
- Verify all services use @Service() or @Injectable() correctly
- Verify signals are used consistently (no unnecessary RxJS)

SSR and hydration:
- Verify no browser-only API access outside afterNextRender/isPlatformBrowser
- Verify no hydration errors in console
- Verify prerendering works for all routes

Error handling:
- Verify GlobalErrorHandler still works (test via /dev/ui-kit error button)
- Verify httpErrorInterceptor shows user-safe messages
- Verify no raw stack traces in the UI

Loading:
- Verify LoadingService debounce works (test via /dev/ui-kit)
- Verify loading states show on homepage and category pages

Theme:
- Verify theme toggle works from header
- Verify prefers-color-scheme is respected on first visit
- Verify both themes have readable contrast everywhere
- Verify amber is only used for Readout, focus rings, and active suggestions

Responsive:
- Verify header, footer, homepage, category pages, tool pages at
  mobile (<768px), tablet (768-1024px), desktop (>1024px)
- Verify touch targets are at least 44x44px on mobile
- Verify no horizontal scroll on mobile

Accessibility:
- Run keyboard-only navigation: tab through header, search, chips, tiles,
  tool inputs, footer — verify everything is reachable and operable
- Verify skip link works
- Verify focus-visible ring appears on all interactive elements
- Verify screen-reader landmarks: header (banner), main, footer (contentinfo)
- Verify heading hierarchy: one h1 per page, logical h2/h3 nesting
- Verify form labels are associated with inputs
- Verify error messages are announced (aria-live or aria-invalid)
- Verify modal traps focus and returns it on close

Performance:
- Check production bundle size against angular.json budgets
- Verify lazy loading works (check network tab for chunk loading)
- Verify fonts load with display=swap (no FOIT)
- Verify images are lazy-loaded

Security:
- Verify no eval or Function constructors in any tool
- Verify no innerHTML with untrusted input
- Verify no untrusted URL navigation
- Verify all tool outputs are rendered as text, not HTML

Data:
- Verify tool-registry.json and search-index.json are in sync
- Verify TOOL_SLUGS_BY_CATEGORY matches registry entries
- Verify RecentlyUsedService does not store sensitive data

Tests:
- Run all unit tests — fix any failures
- Run lint — fix any errors
- Run type-check — fix any errors
- Run production build — fix any errors

Report any remaining limitations honestly. Do not claim success if checks
show failures.
```
