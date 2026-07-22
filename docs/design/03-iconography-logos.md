# Iconography & Tool-Logo System — Maaruri Tools

Builds on [`01-design-direction.md`](./01-design-direction.md) (mood, palette,
signature element) and [`02-color-typography.md`](./02-color-typography.md)
(exact tokens). This document covers two related but distinct systems:

1. **UI chrome icons** — navigation, buttons, status indicators.
2. **Tool logos** — a repeatable formula, not 200 hand-drawn marks.

> Note on categories: the repo doesn't define the final 11 category names yet,
> so the three worked examples below use plausible placeholder categories
> (Time & Date, Health & Fitness, Finance & Currency). What's canonical here is
> the **formula**, not these specific names — when the real 11 are finalized,
> they slot into the Category Color Ring in §3 the same way.

---

## 1. UI chrome icon style

**Library: [Tabler Icons](https://tabler.io/icons), Outline set only.**

Reasoning, not just preference: at ~200 tools spanning clocks, converters,
calculators, and generators, icon *coverage* is a functional requirement, not
a nice-to-have — most utility-specific glyphs (currency, ruler, hash, QR,
gauge, timer, clipboard) already exist pre-drawn. Tabler has ~5,000 icons on a
single consistent 24×24 grid with a matched Outline/Filled pair for nearly
every glyph, which is what makes the "outline by default, filled = active
state" rule below mechanically possible without hand-editing icons.

| Property | Spec |
|---|---|
| Style | Outline only for default/inactive states |
| Grid | 24×24, native Tabler proportions |
| Stroke weight | 2px at 24×24 (scale proportionally, never re-drawn at other weights) |
| Line caps/joins | Round (Tabler default) — kept for legibility at small sizes |
| Corner radius (within glyphs) | Tabler's native ~2px on rectangular elements — left as-is; it already lands close to the chamfer language used for cards/buttons |
| Filled variant | Reserved **exclusively** for the active/selected/toggled state (current nav item, pressed toggle) — an on/off distinction, not decoration |
| Color | `--color-icon-muted` (Steel / Haze) by default; `--color-text-primary` when paired directly with active text; never `--color-accent` (amber stays reserved for the Readout per doc 02 §3) |
| Chrome sizes | 20px in nav/buttons, 16px in dense inline contexts (badges, table rows) |

Outline-only-by-default (filled reserved for "on") mirrors the brief's own
vocabulary — a switch is either open or closed, not partially lit.

---

## 2. Tool-logo formula

Every tool logo is built from the same three layers. Nothing about an
individual tool changes the *structure* — only which category ring color and
which single pictogram get slotted in.

### Layer 1 — Container (constant across all 200 tools)

| Property | Spec |
|---|---|
| Canvas | 64×64 design size (export at 32/48/96/etc., scaled) |
| Shape | Square, corner radius **12px** (≈18.75% of side) |
| Fill | `--color-surface` (Casing White / Panel) — matches the module it sits inside, so the logo doesn't fight its own card |
| Border | 1.5px stroke, category accent color (see §3) |
| Bezel highlight | 1px inset arc along the top-left edge, `--color-surface`-on-Mist at 80% opacity — the same "light catching a machined edge" detail as the Readout in doc 01, scaled down |

This is the concrete radius value doc 01 left as "a small consistent chamfer"
— 12px at 64px canvas is now the fixed number for every future logo, badge,
and card corner that wants to match.

### Layer 2 — Category accent (one of 11, fixed per category)

The border color is the *only* place category identity lives — like a
color-coded wire on a patch bay. It never fills the container and never
colors the pictogram.

**Formula:** `hsl(H, 42%, 42%)` light theme / `hsl(H, 38%, 62%)` dark theme,
where `H` is a hue assigned once per category, at least 25° from every other
category hue, and outside four exclusion zones reserved for colors that
already mean something else (doc 02):

| Exclusion zone | Reserved for |
|---|---|
| 15°–50° | Indicator Amber / Warning Rust |
| 135°–165° | Success |
| 195°–225° | Info |
| 345°–15° (wraps) | Error |

This keeps a category color from ever being mistaken for a system state
(you'd never see a "Converters" tool logo that reads as an error state).

**Contrast rule:** this formula guarantees ≥3:1 against Surface (non-text use
— border, ring, icon stroke), which is all it's used for here. If a category
color is ever needed as *text* (e.g., a colored category-name chip), darken it
using the same method doc 02 used on the semantic colors (deepen until ≥4.5:1)
before treating it as a text token — don't assume the ring color is text-safe
as-is.

### Layer 3 — Pictogram (one Tabler Outline glyph, chosen per tool)

| Property | Spec |
|---|---|
| Source | One existing Tabler Outline glyph — same visual family as UI chrome, so logos and chrome read as the same drafting hand |
| Placement | Centered, bounding box ≈38×38 within the 64×64 canvas (~60%) |
| Stroke weight | 2.5px (slightly heavier than the 2px chrome icons — logos get viewed smaller and scaled down more) |
| Color | `--color-text-primary` (Engraved Ink / Mist) — **never** the category color, **never** amber |
| Complexity | One glyph. If no single Tabler icon fits, combine at most two simple primitives (e.g., a circle + a small corner mark) — never an illustrative scene |

Keeping the pictogram monochrome (ink, not category color) is what keeps 200
logos legible as a set — color sorts categories at the border; the glyph
itself stays as neutral as an engraved panel label.

### Favicon / browser-tab mode (≤32px)

Below ~32px the border, bezel highlight, and fine pictogram strokes stop
surviving. Switch to a **solid mode**: same 12px-equivalent rounded-square
silhouette, filled solid with the category accent color, pictogram rendered
as a light silhouette (`--color-readout-text` / Casing White) directly on top
— no outline, no bezel. Same shape grammar, collapsed to two flat layers for
legibility at 16–32px.

---

## 3. Category Color Ring — worked examples

Three categories, three tools, fully specified end to end.

| Category | Hue | Light accent | Dark accent |
|---|---|---|---|
| Time & Date | 175° | `#3E9891` | `#79C3BD` |
| Health & Fitness | 320° | `#983E7A` | `#C379AA` |
| Finance & Currency | 255° | `#553E98` | `#8C79C3` |

*(Remaining 8 slots: assign hues ≥25° from these three and from each other,
outside the exclusion zones in §2, once the real category list is final —
usable arcs are roughly 50°–135°, 165°–195°, and 225°–345°.)*

### Example A — Digital Clock (Time & Date)

- **Container:** 64×64, 12px radius, Casing White fill, 1.5px `#3E9891` border, top-left bezel highlight.
- **Pictogram:** *not* an analog clock face — since the tool is specifically digital, the glyph is a miniature version of the Readout itself: a small rounded rectangle (mini LCD module, 2.5px stroke, Engraved Ink) with two short vertical strokes centered inside it standing in for a time-separator colon. This deliberately echoes the site's own signature element at logo scale.
- **Color use:** ink pictogram, teal border only. No amber anywhere (amber is reserved for the live Readout on the tool page itself, not its logo).
- **Favicon mode:** solid `#3E9891` rounded square, mini-LCD glyph silhouette in Casing White.

### Example B — BMI Calculator (Health & Fitness)

- **Container:** identical structure, 1.5px `#983E7A` border.
- **Pictogram:** Tabler's `gauge` glyph (semicircular dial with a needle) — chosen because it reads as "a measurement instrument producing a reading," which is literally what a BMI calculator is, without illustrating a body or person (keeps the mark universal and avoids anything that reads as editorial/flashy rather than trustworthy).
- **Category-family note:** `gauge` becomes the default pictogram for any tool in Health & Fitness that outputs a single scored/rated value (BMI, body-fat estimate, calorie-need score); tools that instead output a plain number without a "rating" connotation (e.g., a pregnancy-due-date calculator) use a different, tool-specific glyph instead — the family glyph is a starting default, not a mandatory reuse.
- **Favicon mode:** solid `#983E7A` rounded square, gauge silhouette in Casing White.

### Example C — Currency Converter (Finance & Currency)

- **Container:** identical structure, 1.5px `#553E98` border.
- **Pictogram:** Tabler's `arrows-exchange` glyph (two opposing horizontal arrows) — this is the **family glyph** for every tool across every category whose core action is "convert A to B" (unit converters, currency converters, timezone converters all start here).
- **Disambiguation mark:** because Finance & Currency will contain more than one converter, a small secondary mark is added at ~25% scale in the lower-right corner — here, a plain circle with a horizontal tick (a generic coin/currency mark) distinguishes this from, say, a generic "Length Converter" in a different category, which would instead get a small ruler-tick mark. The rule: **add a disambiguating corner mark only when the family glyph alone would be ambiguous within its own category**; don't add one pre-emptively.
- **Favicon mode:** solid `#553E98` rounded square, arrows-exchange silhouette only (the corner mark is dropped below 32px — too small to survive).

---

## 4. Generating tool #150 from the formula alone

A contributor (or an AI prompt) with only this document and zero visibility
into the other 149 logos follows this exact sequence:

1. **Look up the tool's category** in the Category Color Ring table (§3) →
   read off its fixed light/dark accent hex. If the category has no assigned
   hue yet, assign one per the §2 formula (≥25° from every hue already in the
   table, outside the four exclusion zones) and add it to the table — this
   only happens once per *category*, never per tool.
2. **Draw the container**: 64×64 canvas, 12px corner radius, Surface fill,
   1.5px border in the category's accent hex, 1px bezel highlight top-left.
3. **Name the tool's core action** in one verb (converts / calculates /
   generates / counts down / displays / measures). Check whether its
   category already has a **family glyph** for that verb (Time & Date → mini
   Readout module; any "convert X to Y" tool → `arrows-exchange`; Health &
   Fitness scored tools → `gauge`, etc.). If yes, reuse it. If no family glyph
   exists yet for that action within the category, pick the single closest
   match from Tabler Outline and record it as the new family default for that
   verb+category pairing.
4. **Check for ambiguity**: if another tool already in the same category uses
   the same glyph, add one small (~25% scale) disambiguating mark in the
   lower-right corner. Otherwise leave the glyph unmodified.
5. **Render the pictogram** centered at ~60% of canvas, 2.5px stroke, round
   caps, in `--color-text-primary` — never the category color, never amber.
6. **Export**: full container+border+pictogram for card/hero sizes (≥48px);
   collapse to Favicon mode (solid category-color fill, light silhouette
   pictogram, no border) for anything ≤32px.

Because every decision point above resolves to either "look up a fixed value"
or "pick one existing Tabler glyph for one verb," the process is
deterministic enough that two different people — or a person and a model —
generating logo #150 independently should converge on visually consistent
results without ever having seen logos #1–149.
