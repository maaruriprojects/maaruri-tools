# Color & Typography Spec — Maaruri Tools

Derived from the approved brief in
[`01-design-direction.md`](./01-design-direction.md). This document is the design
decision; wiring it into SCSS custom properties happens in Phase 2, Day 7. Every
value below is named so it can be copied directly into `:root` / `[data-theme="dark"]`
custom properties without re-deriving anything at implementation time.

WCAG target: **4.5:1** for normal text (AA), **3:1** for large text (≥24px / 19px
bold) and non-text UI component boundaries (icons, input borders — WCAG 1.4.11).
Every ratio below was computed from relative luminance, not eyeballed.

---

## 1. Core color set

### Light theme

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-bg` | Bezel Gray | `#E6E8EA` | page background |
| `--color-surface` | Casing White | `#F8F9F9` | tool-module / card surface |
| `--color-text-primary` | Engraved Ink | `#262B2E` | primary text |
| `--color-text-secondary` | Steel Deep | `#4C5A62` | secondary/muted text |
| `--color-border` | Hairline | `#D6DADC` | decorative dividers, card edges |
| `--color-icon-muted` | Steel | `#5B6B74` | inactive icons, non-text UI marks only |

### Dark theme

| Token | Name | Hex | Role |
|---|---|---|---|
| `--color-bg` | Graphite | `#1B1E20` | page background |
| `--color-surface` | Panel | `#24282B` | tool-module / card surface (raised) |
| `--color-text-primary` | Mist | `#E9EBEC` | primary text |
| `--color-text-secondary` | Haze | `#9BA8AE` | secondary/muted text |
| `--color-border` | Seam | `#3A4046` | decorative dividers, card edges |
| `--color-icon-muted` | Haze | `#9BA8AE` | inactive icons, non-text UI marks |

Dark mode is not an inversion — it's the same panel with the room lights off.
Graphite and Panel are new dark tones built off the Engraved Ink family; Mist and
Haze are light tones built off the Bezel Gray / Steel families, not literal
inverses of their light-mode counterparts.

### Contrast verification — core pairs

| Pair | Ratio | Result |
|---|---|---|
| Engraved Ink on Bezel Gray | 11.7:1 | pass (AAA) |
| Engraved Ink on Casing White | 13.7:1 | pass (AAA) |
| Steel Deep on Bezel Gray | 5.8:1 | pass (AA) |
| Steel Deep on Casing White | 6.8:1 | pass (AA) |
| Mist on Graphite | 14.0:1 | pass (AAA) |
| Mist on Panel | 12.4:1 | pass (AAA) |
| Haze on Graphite | 6.9:1 | pass (AA) |
| Haze on Panel | 6.1:1 | pass (AA) |

**Flagged and adjusted:** the brief's raw `Steel` (`#5B6B74`) sits at **~4.50:1**
against Bezel Gray — right on the AA line, too close to trust for arbitrary body
text. Rather than carry a borderline value forward, `text-secondary` uses a
deepened derivative, **Steel Deep** (`#4C5A62`), which clears AA with margin on
both background and surface. `Steel` itself is kept, but demoted to a non-text
role (icons, inactive marks) where the 3:1 threshold applies and it passes
comfortably (5.2:1 against surface).

---

## 2. Semantic colors

Success reuses the brief's Confirm Green hue; warning and info are new but stay
inside the same desaturated, instrument-panel family (rust-amber and gauge-blue)
rather than pulling in Bootstrap's stock yellow/cyan. Warning is deliberately a
**different hue-value from Indicator Amber** — the brief reserves amber
exclusively for marking a live readout value, so a semantic "warning" state
cannot borrow that exact color without diluting the signature element.

### Light theme

| Token | Name | Hex | Harmonizes with | Ratio (on Bezel Gray / Casing White) |
|---|---|---|---|---|
| `--color-success` | Confirm Green (deep) | `#2A7150` | brief's Confirm Green `#3F9C6D` | 4.8:1 / 5.6:1 — pass |
| `--color-warning` | Warning Rust | `#93521F` | Indicator Amber family, shifted darker/redder | 4.9:1 / 5.7:1 — pass |
| `--color-error` | Brick | `#B23B3B` | Engraved Ink's warm-neutral undertone | 4.8:1 / 5.6:1 — pass |
| `--color-info` | Gauge Blue | `#33608F` | Steel's blue-gray hue, saturated up | 5.3:1 / 6.2:1 — pass |

### Dark theme

| Token | Name | Hex | Ratio (on Graphite / Panel) |
|---|---|---|---|
| `--color-success` | Confirm Green (bright) | `#59C08A` | 7.4:1 / 6.6:1 — pass |
| `--color-warning` | Warning Rust (bright) | `#E0954C` | 6.8:1 / 6.1:1 — pass |
| `--color-error` | Brick (bright) | `#D97575` | 5.4:1 / 4.8:1 — pass |
| `--color-info` | Gauge Blue (bright) | `#6FA3D8` | 6.3:1 / 5.6:1 — pass |

**Flagged and adjusted:** the first-pass values, taken straight from/near the
brief's palette, failed AA as text/icon colors:

- Confirm Green `#3F9C6D` → **2.9–3.2:1** against light surfaces (fails). Deepened
  to `#2A7150`.
- A first warning candidate `#9C5822` → **4.46:1** against Bezel Gray (fails,
  narrowly). Deepened to `#93521F`.
- Info candidate `#3D6FA5` → **4.25:1** against Bezel Gray (fails, narrowly).
  Deepened to `#33608F`.
- Brick `#B23B3B` passed on the first attempt (4.8:1 / 5.6:1) — no adjustment
  needed.

These four are the tokens to use for semantic text, icons, and alert borders.
If Phase 2 needs solid-fill badges/buttons in these colors, reuse the same
tokens at full opacity with `--color-text-primary`-on-dark / white text — they
were tuned to the stricter 4.5:1 body-text bar, so they clear the 3:1 large-text
bar for fills by construction.

---

## 3. Theme-invariant tokens (the Readout)

Indicator Amber fails AA when placed as text directly on light surfaces (only
**2.0:1** on Casing White), which is exactly why the brief's signature element
gives it its own permanently dark backing rather than sitting on the page
background in either theme — like an LCD display that stays dark regardless of
room lighting. These three tokens do **not** change between light and dark theme:

| Token | Name | Hex | Role | Ratio |
|---|---|---|---|---|
| `--color-readout-bg` | Readout Ink | `#262B2E` | recessed panel fill, both themes | — |
| `--color-readout-text` | Readout Paper | `#F8F9F9` | inactive tabular numerals | 13.7:1 on Readout Ink — pass |
| `--color-accent` | Indicator Amber | `#E8A33D` | the live/active digit or unit only | 6.7:1 on Readout Ink — pass |

**Rule:** Indicator Amber may only be set as text/icon color against
`--color-readout-bg` (or another surface at least as dark as Graphite). Never
place it as text directly on Bezel Gray, Casing White, Panel, or Mist — all of
those fail AA for amber-on-light. This rule is what keeps the accent
functioning as a signal instead of decoration.

---

## 4. Typography

Two roles per the brief — **IBM Plex Sans Condensed** (display, used with
restraint) and **Public Sans** (body/UI) — plus **IBM Plex Mono** for the
Readout, which isn't a third "role" so much as the mandatory treatment for the
one thing every tool actually produces: a number.

| Token | Family | Use |
|---|---|---|
| `--font-display` | IBM Plex Sans Condensed | tool/category titles, page headings only |
| `--font-body` | Public Sans | body copy, labels, buttons, nav, all UI chrome |
| `--font-mono` | IBM Plex Mono | Readout values and units only — never body copy |

### Type scale

8 steps, caption → display, plus the Readout as its own functional step.
`rem` assumes a 16px base.

| Step | Token prefix | Family | Size | Weight | Line-height | Use |
|---|---|---|---|---|---|---|
| Caption | `--type-caption` | body | 12px / 0.75rem | 400 | 1.4 | metadata, timestamps, ad labels, disclaimers |
| Body Small | `--type-body-sm` | body | 14px / 0.875rem | 400 | 1.5 | secondary UI text, form hints, footnotes |
| Body | `--type-body` | body | 16px / 1rem | 400 | 1.6 | default paragraph text (base size) |
| Label | `--type-label` | body | 16px / 1rem | 600 | 1.5 | form labels, buttons, tool names in the panel grid |
| Subhead | `--type-subhead` | display | 20px / 1.25rem | 500 | 1.3 | category legends, section headers |
| Heading | `--type-heading` | display | 28px / 1.75rem | 600 | 1.25 | individual tool page titles |
| Display | `--type-display` | display | 40px / 2.5rem | 600 | 1.15 | homepage hero only — used sparingly per the brief |
| Readout | `--type-readout` | mono | 48px / 3rem (scales to 64px / 4rem on larger tools) | 500 | 1.1 | the computed answer itself; tabular-nums, +0.02em tracking |

**Notes for Phase 2:**
- `Label` and `Body` share a size but differ in weight — this is what
  distinguishes an interactive tool-panel name from ordinary paragraph text
  without introducing another size.
- Readout is the only step permitted to use `--font-mono` and the only step
  that pairs with `--color-accent` for its active portion; everywhere else,
  amber stays off text entirely (focus rings / small indicator dots only).
- `Display` should be genuinely rare in the shipped UI — the brief's
  restriction, not a new one introduced here.
