# Master Implementation Guide — Maaruri Tools

This document is the single source of truth for the implementation order.
It prevents tool work from starting before the foundation is ready, and
ensures every phase has clear completion criteria.

---

## Phase 1 — Existing Code Changes & Design

Build the foundation: application shell, fonts, shared components, homepage,
category browse pages, and the tool shell contract. No individual tool
logic is implemented in Phase 1.

| Step | Prompt | Branch | What it delivers |
|---|---|---|---|
| 1.1 | Prompt 1 | `phase1/01-application-shell` | Header, footer, shell, skip link, main landmark |
| 1.2 | Prompt 2 | `phase1/02-design-foundation` | Fonts, global styles, theme polish, `prefers-color-scheme` |
| 1.3 | Prompt 3 | `phase1/03-shared-components` | ToolTile, CategoryTile, form controls, modal, empty/error states, ad placeholders |
| 1.4 | Prompt 4 | `phase1/04-homepage-redesign` | Full homepage per doc 05 (hero search, chips, trending, recent, category grid, ad) |
| 1.5 | Prompt 5 | `phase1/05-category-browse` | Real category landing pages (Template B) replacing ToolComingSoon |
| 1.6 | Prompt 6 | `phase1/06-tool-shell` | Tool detail shell (Template A), registry resolution, invalid-slug 404, tool contract |

**Phase 1 is complete when:**
- The app has a header, footer, and shell on every page.
- Fonts load correctly in both themes.
- The homepage matches doc 05.
- Category browse pages render real tool grids.
- The tool shell resolves slugs from the registry and shows a 404 for invalid slugs.
- All Phase 1 prompts have passed type-check, lint, unit tests, production build, and browser verification.

---

## Phase 2 — Tools Implementation

Implement tools one at a time. Each tool gets its own branch and commit.

| Step | Prompt | Tool | Branch |
|---|---|---|---|
| 2.1 | Prompt 7 | BMI Calculator | `phase2/01-bmi-calculator` |
| 2.2 | Prompt 8 | JSON Formatter | `phase2/02-json-formatter` |
| 2.3 | Prompt 9 | Digital Clock | `phase2/03-digital-clock` |
| 2.4 | Prompt 10 | Countdown Timer | `phase2/04-countdown-timer` |
| 2.5 | Prompt 11 | Loan Calculator | `phase2/05-loan-calculator` |
| 2.6 | Prompt 12 | Percentage Calculator | `phase2/06-percentage-calculator` |
| 2.7 | Prompt 13 | Unit Converter | `phase2/07-unit-converter` |
| 2.8 | Prompt 14 | Currency Converter | `phase2/08-currency-converter` |
| 2.9 | Prompt 15 | Word Counter | `phase2/09-word-counter` |
| 2.10 | Prompt 16 | Text Case Converter | `phase2/10-text-case-converter` |
| 2.11 | Prompt 17 | Color Picker | `phase2/11-color-picker` |
| 2.12 | Prompt 18 | Gradient Generator | `phase2/12-gradient-generator` |
| 2.13 | Prompt 19 | Regex Tester | `phase2/13-regex-tester` |
| 2.14 | Prompt 20 | Base64 Encoder/Decoder | `phase2/14-base64-encoder` |
| 2.15 | Prompt 21 | Tip Calculator | `phase2/15-tip-calculator` |
| 2.16 | Prompt 22 | Random Picker | `phase2/16-random-picker` |

After each tool: verify in the browser, run tests, then proceed to the next.

**Phase 2 is complete when:**
- All 16 tools above are implemented, tested, and verified.
- Each tool appears in the registry and search index.
- Each tool renders inside the tool shell with a Readout.
- Each tool works on mobile, tablet, and desktop in both themes.

---

## Phase 3 — Production Readiness (after Phase 2)

| Step | Prompt | Branch | What it delivers |
|---|---|---|---|
| 3.1 | Prompt 23 | `phase3/01-recently-used` | Local browser history for Recently Used |
| 3.2 | Prompt 24 | `phase3/02-seo-prerender` | SEO, prerendering, sitemap readiness |
| 3.3 | Prompt 25 | `phase3/03-final-review` | Final accessibility, performance, and quality review |

---

## Data Storage Policy

- **No database at this stage.** All tool metadata lives in local JSON files
  under `client/src/assets/data/`.
- The `ToolRegistryService` and `SearchIndexService` already load from these
  JSON files via `BaseApiService` / `httpResource`. Changing `apiBaseUrl` in
  the environment files is the only change needed to migrate to a real API later.
- Recently Used history (Phase 3) uses browser `localStorage` only — not a
  database, not Supabase.
- Trending tools are out of scope until a server-controlled write path exists.
  The homepage shows a placeholder or omits the section entirely until then.

---

## Rules for the AI Coding Tool

1. **Review the existing code before every prompt.** Read the files the prompt
   touches before making changes.
2. **Do not rewrite unrelated code.** Each prompt has a narrow scope.
3. **Use existing design tokens.** Never introduce new colors, spacing, or
   typography outside `_tokens.scss` and `theme.scss`.
4. **Follow the one-way dependency rule:** `features/` and `layout/` →
   `shared/` → `core/`. Never import upward.
5. **Use signals, standalone components, and functional interceptors/guards.**
6. **Every new component and service needs unit tests.**
7. **Verify in the browser** at desktop, tablet, and mobile widths after each
   prompt. Fix all errors before declaring the prompt complete.
8. **Never use `eval`, `Function` constructors, `innerHTML` with untrusted
   input, or untrusted URL navigation.**
9. **Respect `prefers-reduced-motion`** in every animation or transition.
10. **Amber (`--color-accent`) is reserved** for the Readout, focus-visible
    rings, and the active search-suggestion row. Never use it for buttons,
    links, or decoration.
