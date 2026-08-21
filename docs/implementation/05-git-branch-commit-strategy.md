# Git Branch & Commit Strategy

All branches use the `phaseN/NN-description` pattern. Each prompt maps to
exactly one branch and one commit. Do not combine prompts into a single
branch.

---

## Phase 1 — Foundation

| Prompt | Branch | Commit |
|---|---|---|
| 1 | `phase1/01-application-shell` | `feat: add application shell, header, footer, and navigation` |
| 2 | `phase1/02-design-foundation` | `feat: load fonts, add global styles, polish theme system` |
| 3 | `phase1/03-shared-components` | `feat: add ToolTile, CategoryTile, form controls, modal, state components` |
| 4 | `phase1/04-homepage-redesign` | `feat: redesign homepage per doc 05 spec` |
| 5 | `phase1/05-category-browse` | `feat: implement category browse pages per Template B` |
| 6 | `phase1/06-tool-shell` | `feat: add tool detail shell, registry resolution, invalid-slug 404` |

## Phase 2 — Tools

| Prompt | Branch | Commit |
|---|---|---|
| 7 | `phase2/01-bmi-calculator` | `feat: implement BMI Calculator tool` |
| 8 | `phase2/02-json-formatter` | `feat: implement JSON Formatter tool` |
| 9 | `phase2/03-digital-clock` | `feat: implement Digital Clock tool` |
| 10 | `phase2/04-countdown-timer` | `feat: implement Countdown Timer tool` |
| 11 | `phase2/05-loan-calculator` | `feat: implement Loan Calculator tool` |
| 12 | `phase2/06-percentage-calculator` | `feat: implement Percentage Calculator tool` |
| 13 | `phase2/07-unit-converter` | `feat: implement Unit Converter tool` |
| 14 | `phase2/08-currency-converter` | `feat: implement Currency Converter tool` |
| 15 | `phase2/09-word-counter` | `feat: implement Word Counter tool` |
| 16 | `phase2/10-text-case-converter` | `feat: implement Text Case Converter tool` |
| 17 | `phase2/11-color-picker` | `feat: implement Color Picker tool` |
| 18 | `phase2/12-gradient-generator` | `feat: implement Gradient Generator tool` |
| 19 | `phase2/13-regex-tester` | `feat: implement Regex Tester tool` |
| 20 | `phase2/14-base64-encoder` | `feat: implement Base64 Encoder/Decoder tool` |
| 21 | `phase2/15-tip-calculator` | `feat: implement Tip Calculator tool` |
| 22 | `phase2/16-random-picker` | `feat: implement Random Picker tool` |

## Phase 3 — Production Readiness

| Prompt | Branch | Commit |
|---|---|---|
| 23 | `phase3/01-recently-used` | `feat: add recently-used tool history with localStorage` |
| 24 | `phase3/02-seo-prerender` | `feat: improve SEO, prerendering, and sitemap readiness` |
| 25 | `phase3/03-final-review` | `fix: final accessibility, performance, and quality review` |

---

## Rules

1. **One prompt = one branch = one commit.** Do not squash or combine.
2. **Verify before committing.** Run type-check, lint, tests, and production
   build. Fix all errors before committing.
3. **Verify in the browser** at desktop, tablet, and mobile widths before
   committing. Fix visual regressions before committing.
4. **Commit message format:** `feat: ...` for new features, `fix: ...` for
   bug fixes, `refactor: ...` for non-behavioral changes.
5. **Do not push or create PRs** unless explicitly asked.
6. **Do not start the next prompt** until the current one passes all checks.
