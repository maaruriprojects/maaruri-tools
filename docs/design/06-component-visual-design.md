# Core Component Visual Specs — Maaruri Tools

Precise enough for Phase 2 (Days 8 & 14) to build without new decisions.
Every value below is a token already established in
[02-color-typography.md](./02-color-typography.md) and
[04-page-layout-system.md](./04-page-layout-system.md), or a small new token
(the radius scale) introduced here because nothing before this document
needed it.

## 0. Shared tokens used throughout this doc

**Radius scale** (new — the "small consistent chamfer" doc 01 called for,
now given exact numbers for UI-control scale; doc 03's 12px logo-container
radius becomes `--radius-lg` in this scale):

| Token | Value | Used by |
|---|---|---|
| `--radius-sm` | 6px | buttons, inputs, badges |
| `--radius-md` | 10px | cards, tool/category tiles |
| `--radius-lg` | 12px | logo containers (doc 03, unchanged) |

Nothing in this system uses `0` (flat/newspaper) or a full pill/`9999px`
radius — both were explicitly rejected in doc 01.

**Universal focus-visible ring** — applies to *every* interactive element in
this document. Defined once, here, and inherited everywhere else:

| Property | Value |
|---|---|
| Style | 2px solid `--color-accent` (Indicator Amber, `#E8A33D`) |
| Offset | 2px outline-offset |
| Trigger | `:focus-visible` only — never on mouse-click `:focus`, so pointer users never see it as noise |
| Theme behavior | Identical in light and dark (amber is theme-invariant per doc 02 §3) |

This is the **one sanctioned extension** of Indicator Amber's exclusivity
rule from doc 02 (§3: amber only ever appears against the Readout's dark
backing). A focus ring marking "this is the live control right now" carries
the exact same meaning amber already carries for a live digit — it isn't a
dilution of the rule, it's the same rule applied to a second kind of "live."
No component below defines its own focus treatment; every one inherits this.

---

## 1. Buttons

Primary buttons are **not** amber. Indicator Amber technically passes AA as
a button fill (6.7:1 with ink text), but using it here would make amber mean
"clickable" everywhere instead of "this is a live reading" — exactly the
dilution doc 01's signature element depends on avoiding. Primary buttons
instead use a solid ink fill: a dark, high-contrast control, closer to a
physical toggle switch than a colored SaaS CTA.

### Primary

| State | Light theme | Dark theme |
|---|---|---|
| Default | bg `--color-text-primary` (`#262B2E`), text `--color-surface` (`#F8F9F9`) | bg `--color-text-primary` (`#E9EBEC`), text `--color-bg` (`#1B1E20`) |
| Hover | bg swaps to `--color-text-secondary` (`#4C5A62`) | bg swaps to `--color-text-secondary` (`#9BA8AE`) |
| Active | same as hover + `translateY(1px)`, resting bottom-edge shadow removed | same |
| Disabled | bg `--color-border`, text `--color-icon-muted`, `cursor: not-allowed` | same tokens, dark values |
| Focus-visible | inherits §0 | inherits §0 |

- Padding: 10px vertical, `--space-lg` (24px) horizontal — targets a 44px
  total height (10 + 24px Label line-height + 10) for comfortable tap size.
- Radius: `--radius-sm`.
- Type: Label (16px / 600 / line-height 1.5), `--font-body`.
- Rest state carries a 1px bottom-edge shadow (`0 1px 0 rgba(0,0,0,.25)`
  light / `rgba(0,0,0,.5)` dark) suggesting a raised switch; active state
  removes it and shifts the button down 1px — the only place in this system
  a shadow implies physical depth rather than floating elevation.

### Secondary

| State | Light theme | Dark theme |
|---|---|---|
| Default | bg `--color-surface`, text `--color-text-primary`, border 1.5px `--color-text-secondary` | bg `--color-surface`, text `--color-text-primary`, border 1.5px `--color-text-secondary` (Haze) |
| Hover | border strengthens to `--color-text-primary` | same |
| Active | bg fills `--color-border` + `translateY(1px)` | same |
| Disabled | border `--color-border`, text `--color-icon-muted` | same |
| Focus-visible | inherits §0 | inherits §0 |

Same padding, radius, and type as Primary.

### Ghost

| State | Light theme | Dark theme |
|---|---|---|
| Default | no bg, no border, text `--color-text-primary` | same |
| Hover | bg `--color-border` (flat tint, no border added) | same |
| Active | bg darkens to `--color-icon-muted` at 20% opacity | same |
| Disabled | text `--color-icon-muted`, no bg ever | same |
| Focus-visible | inherits §0 | inherits §0 |

Same padding, radius, and type as Primary. Used for tertiary actions
(inline "Reset," "Copy," "Clear" controls) where a bordered button would be
too heavy.

---

## 2. Cards

### Tool card (grid tile, doc 04/05)

- Container: `--color-surface` fill, **1px `--color-border` border, no
  shadow at rest** — a hairline, not a floating SaaS card. Shadow only
  appears transiently on hover (below), never at rest.
- Radius: `--radius-md`.
- Padding: `--space-md` (16px) on all sides.
- Contents, top to bottom: the tool's 48px logo export (full
  container+border+pictogram detail, per doc 03's size rules) with
  `--space-sm` clearance from the card edge; tool name in Label type below
  it; one-line function description in Body-sm, `--color-text-secondary`,
  below that.
- Hover: border color shifts from neutral `--color-border` to the tool's
  **category accent color** (doc 03 ring) — this is the one moment a tool
  card shows category color, as a response to interaction, not a resting
  decoration. Card lifts `translateY(-2px)` with a light shadow
  (`0 4px 8px rgba(0,0,0,.08)` light / `.3` dark) that doesn't exist at rest.
- Active (press before navigation): `translateY(1px)`, shadow removed —
  same tactile language as buttons.
- Focus-visible: inherits §0, applied to the full card (the whole tile is
  the link/focus target, not just the text).

### Category card (homepage grid, doc 05)

Structurally identical to the tool card, with two deliberate differences:

- **Larger**: `--space-lg` (24px) internal padding instead of `--space-md`,
  and a bigger icon (~40px vs. the tool card's 24–32px effective icon size)
  — it represents an entire domain, not one tool.
- **Border carries category color at rest**, not just on hover: 1.5px solid
  in the category's accent color, always. Unlike a tool card — where a
  colored border would be redundant clutter repeated 200 times — a category
  card's border color *is* its primary identifying signal, so it's shown
  immediately rather than revealed on interaction.
- Contents: category-level icon (same container formula as doc 03, no
  specific tool pictogram — a generic category-representative glyph, e.g.
  a calculator-keypad icon for "Calculators"), category name (Label or
  Subhead type), tool count (Caption, `--color-text-secondary`) — count is
  visually minor by design (see doc 05 §2).
- Hover: border thickens 1.5px → 2px (still the category color, no new
  color introduced) + `translateY(-2px)` lift + same transient shadow as
  tool cards.
- Focus-visible: inherits §0 — the amber ring visually overrides the
  category-color border while focused, since amber's meaning ("this is
  live right now") outranks the category signal in that moment.

---

## 3. Inputs & search bar

### Standard input

| State | Spec |
|---|---|
| Default | bg `--color-surface`, text `--color-text-primary`, placeholder `--color-text-secondary`, border 1.5px `--color-border` |
| Focus | border strengthens to `--color-text-primary` **and** the §0 amber ring appears outside it — both fire together, no exceptions, so keyboard behavior is identical across every component in this system |
| Error | border `--color-error` (`#B23B3B` light / `#D97575` dark), inline message below in Caption size using the same error token |
| Disabled | bg `--color-bg` (recedes below surface level — reads as "powered off" rather than just faded), text `--color-icon-muted`, border `--color-border` |

- Padding: 10px vertical, `--space-md` (16px) horizontal.
- Radius: `--radius-sm`.
- Type: Body (16px / 400 / 1.6), `--font-body`.

### Search bar (jump-search — both the compact control-strip version and the
enlarged homepage hero version, doc 05)

- Same input treatment as above, plus a leading Tabler `search` glyph (20px,
  `--color-icon-muted`) inset `--space-sm` from the left edge, and left
  padding increased to accommodate it.
- The hero version (doc 05 §1) is the same component at a larger scale —
  bigger padding and Body-large sizing, not a different component.

**Suggestions dropdown — differentiated from the input by being the only
floating overlay in this system, which is the one place a shadow is used at
rest, not just on interaction:**

| Property | Spec |
|---|---|
| Panel | `--color-surface` fill, 1px `--color-border` border, `--radius-md` (larger than the input's own `--radius-sm` — it's a bigger container), drop shadow `0 8px 16px rgba(0,0,0,.12)` light / `.4` dark |
| Rows | flat, no individual border/radius; each row = 24px tool icon + name + small category badge (§4), `--space-sm` vertical padding |
| Row hover/keyboard-highlight | bg fills `--color-border`, plus a 2px vertical accent bar in `--color-accent` (Indicator Amber) along the row's left edge marking it as "the currently-selected one" |
| Row focus | suggestion rows are navigated by arrow keys within the listbox (`aria-selected`), not individually tab-stopped — the §0 ring belongs to the search input itself, not each row |

The amber accent bar on the highlighted row is a second sanctioned reuse of
the accent, same reasoning as the focus ring: it marks which single item is
"live" in that moment, consistent with what amber already means everywhere
else in the system.

---

## 4. Badges / tags

Rectangular, not pill-shaped — consistent with doc 01/04's rejection of the
generic-friendly-SaaS full-rounded default.

| Property | Spec |
|---|---|
| Shape | `--radius-sm` (6px), 3px solid left border only (not a full outline) |
| Padding | `--space-xs` (4px) vertical, `--space-sm` (8px) horizontal |
| Type | Caption (12px / 400) |
| Background | `--color-surface` — always neutral, never tinted |

**Color logic — category badges:** the 3px left border uses the category's
**raw** accent color from the doc 03 ring (tuned for 3:1 non-text use); the
label text uses that category's **darkened, text-safe variant** (doc 03's
adjustment method: deepen until ≥4.5:1), never the raw ring color as text.
This is the same two-tier color rule doc 03 already established — this
document just names where it applies.

**Color logic — semantic badges** ("New," "Beta," "Updated"): identical
shape and structure, using the semantic tokens from doc 02 (`--color-success`
/ `-warning` / `-error` / `-info`) instead of a category token. No visual
ambiguity is possible between a category badge and a status badge — doc 03's
hue-exclusion zones guarantee semantic hues and category hues never overlap.

**Focus-visible:** static badges aren't focusable. Where a badge doubles as
an interactive filter chip (e.g., category filters on a browse page), it
inherits §0 like any other interactive element.
