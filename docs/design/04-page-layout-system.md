# Page Layout System — Maaruri Tools

Builds on [`01-design-direction.md`](./01-design-direction.md) (breaker-panel
grid, control-strip navigation, the Readout) and
[`02-color-typography.md`](./02-color-typography.md) (type scale, tokens).
Implemented in Angular 22 on a Bootstrap 5 grid. This is the layout decision —
breakpoint code lands in Phase 2, Day 7.

---

## 1. Spacing scale

4px base unit, 8 steps, deliberately paired to the type scale from doc 02 so
type and space share one rhythm instead of two competing systems.

| Token | Value | Paired type step | Typical use |
|---|---|---|---|
| `--space-xs` | 4px / 0.25rem | — | icon-to-label gap, tight inline spacing |
| `--space-sm` | 8px / 0.5rem | Caption (12px) | chip/badge padding, dense list gaps |
| `--space-md` | 16px / 1rem | Body (16px) | default paragraph spacing, form field gaps — the workhorse unit |
| `--space-lg` | 24px / 1.5rem | Subhead (20px) | space above/below a section header |
| `--space-xl` | 32px / 2rem | Heading (28px) | gaps between major page sections |
| `--space-2xl` | 48px / 3rem | Display (40px) | hero-section padding, top of page |
| `--space-3xl` | 64px / 4rem | Readout (48–64px) | the generous clearance the Readout itself needs so it doesn't feel cramped against neighboring content |
| `--space-4xl` | 96px / 6rem | — | outer vertical rhythm on tall pages only (rare) |

**Bridge to Bootstrap:** rather than use Bootstrap 5's default `$spacer` scale
(0/.25/.5/1/1.5/3rem, keyed `0`–`5`), Phase 2 overrides the `$spacers` Sass map
with these eight values keyed to these names, so utilities like `.p-md` or
`.gap-lg` emit this scale directly. No spacing decision gets re-litigated at
implementation time — Day 7 is a transcription of this table into the map.

---

## 2. Page templates

Every template shares the same **control strip** (header) and **footer**
zones; they differ in how the middle of the page is structured. Ad zones are
placed deliberately per template — never inserted generically — following the
brief's "trustworthy, not flashy" mandate: ads are visually subordinate,
clearly separated, and template-appropriate rather than maximized everywhere.

### Template A — Tool Detail (content-heavy: e.g. BMI Calculator)

```
┌──────────────────────────────────────────────────────────────┐
│ CONTROL STRIP   [Logo]  [Category ▾]   [Jump-search…]   [☾]   │
├──────────────────────────────────────────────────────────────┤
│ ← Calculators                 BMI Calculator          [icon]  │
├────────────────────────────────────────────┬───────────────────┤
│  READOUT                                    │                   │
│  ┌────────────────────────────────────┐    │   AD ZONE         │
│  │            2 2 . 4                  │    │   300px, sticky   │
│  └────────────────────────────────────┘    │   within viewport  │
│                                              │                   │
│  INPUT CONTROLS                             │                   │
│  [ height ]  [ weight ]  [ units ▾ ]        │                   │
│                                              │                   │
│  ── reading column, ~720px max ──           │                   │
│  How this is calculated / what it means     │                   │
│  Lorem ipsum lorem ipsum lorem ipsum…       │                   │
│                                              │                   │
│  RELATED TOOLS                              │                   │
│  [ tile ] [ tile ] [ tile ] [ tile ]        │                   │
├────────────────────────────────────────────┴───────────────────┤
│ FOOTER — category index, legal, sitemap                        │
└──────────────────────────────────────────────────────────────┘
```

- **Header zone:** control strip (logo, category dropdown, jump-search,
  theme toggle) — identical on every template.
- **Content zone:** Readout first (the answer is the reason someone came),
  then input controls, then an explanation column capped at the doc-02
  reading width, then a related-tools row reusing the tool-module tile from
  the browse grid.
- **Sidebar/ad zone:** one 300px ad unit, sticky within the content zone's
  scroll range (never sticky past the footer). Desktop/`lg`+ only.
- **Footer zone:** shared across all templates.

### Template B — Category / Browse Grid (e.g. "Calculators" listing)

```
┌──────────────────────────────────────────────────────────────┐
│ CONTROL STRIP   [Logo]  [Category ▾]   [Jump-search…]   [☾]   │
├──────────────────────────────────────────────────────────────┤
│ CALCULATORS · 18 tools                       [ sort ▾ ]        │
├──────────────────────────────────────────────────────────────┤
│ [tile] [tile] [tile] [tile] [tile] [tile]                       │
│ [tile] [ AD ] [tile] [tile] [tile] [tile]                       │
│ [tile] [tile] [tile] [tile] [tile] [tile]                       │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                          │
└──────────────────────────────────────────────────────────────┘
```

- **Header zone:** same control strip.
- **Content zone:** a category legend line (name, tool count, sort/filter)
  above the breaker-panel module grid — no sidebar, because at up to ~200
  tiles, screen width should go to the grid, not to a fixed-width column
  fighting it for space.
- **Ad zone:** no sidebar. Instead, one ad tile is embedded directly in the
  grid rhythm at a fixed interval (every 12th tile), sized identically to a
  tool tile, labeled "Advertisement," bordered in `--color-border` instead of
  a category color so it reads as visually distinct from real tools without
  breaking the panel's density. This is template-specific: it only makes
  sense where a dense uniform grid already exists to embed into.
- **Footer zone:** shared.

### Template C — Simple / Static (About, Contact, Privacy)

```
┌──────────────────────────────────────────────────────────────┐
│ CONTROL STRIP   [Logo]  [Category ▾]   [Jump-search…]   [☾]   │
├──────────────────────────────────────────────────────────────┤
│                                                                  │
│                         Page Title                              │
│                                                                  │
│                 ── reading column, ~720px max ──                │
│                 Lorem ipsum lorem ipsum lorem…                  │
│                 Lorem ipsum lorem ipsum lorem…                  │
│                                                                  │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                          │
└──────────────────────────────────────────────────────────────┘
```

- **Content zone:** single centered reading column, same 720px cap as
  Template A's explanation text. No grid, no multi-zone layout.
- **Ad zone:** none, or at most one small inline unit low in the page.
  Trust-sensitive pages (About, Privacy, Contact) are deliberately the
  lowest ad-density template — this is a trust decision from the brief, not
  an oversight.
- **Footer zone:** shared.

---

## 3. Max content width & wide-desktop behavior

There are two different "max width" answers depending on what's on the page,
because a paragraph and a panel of switches don't scale the same way:

- **Reading content** (Template A's explanation column, all of Template C):
  capped at **720px**, always, regardless of viewport. This is a line-length
  decision (≈70–75 characters at the doc-02 body size), not a layout
  decision — it does not grow on wider screens.
- **The module grid** (Template B, and Template A's related-tools row):
  fluid, with tiles at a fixed minimum width (~200px) that wrap into
  additional columns as the viewport widens — a bigger panel simply has more
  switches on it, not bigger switches.
- **Outer page frame:** the whole layout — control strip, grid, everything —
  is capped at a **1440px** outer container, centered, with the surrounding
  viewport filled by `--color-bg`, not content. Past 1440px the page does
  **not** stretch edge-to-edge: an instrument panel is mounted with a frame
  around it, not stretched across an arbitrarily large wall. On the grid
  template specifically, this means columns stop being added once the grid
  reaches its practical maximum (around 6–7 tiles per row) — the frame gets
  wider margins on an ultrawide monitor, not more infinite columns.

---

## 4. Breakpoint interaction (implemented Phase 2, Day 7)

Described in terms of Bootstrap 5's existing breakpoint names — no new
breakpoint system is being introduced:

- **`xs` (<576px):** Control strip collapses to logo + hamburger + a
  collapsed jump-search (expands on tap). All templates go single-column.
  Template A's ad zone drops out of the sidebar entirely and reappears as one
  inline block below the Readout. Template B's grid runs 1 tile per row, ad
  tile keeps its same fixed-interval position in the single column.
- **`sm`–`md` (576–991px):** Grid (Template B) moves to 2–3 tiles per row.
  Template A's ad zone stays inline (not sidebared) through this range —
  there isn't reliably enough width for a 300px column without squeezing the
  reading column below its comfortable measure.
- **`lg` (992–1199px):** Template A's sidebar ad zone activates as a real
  fixed-width column for the first time. Grid moves to 4 tiles per row.
- **`xl` (1200–1399px):** Grid moves to 5–6 tiles per row. Reading column
  remains capped at 720px regardless — this breakpoint only affects the grid
  and sidebar math, never paragraph width.
- **`xxl` (≥1400px):** Outer 1440px frame takes over as the effective limit
  described in §3; the grid reaches its practical column maximum and any
  further viewport width becomes margin outside the frame, not more content.

The control strip, footer, and reading-column cap behave identically across
every breakpoint above `xs` — the only things that change with viewport are
grid column count and whether the ad zone is sidebared or inline.
