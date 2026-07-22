# Homepage Design — Maaruri Tools

Builds on all four prior documents: the control-strip/jump-search and
breaker-panel grid ([01](./01-design-direction.md)), tokens and type scale
([02](./02-color-typography.md)), the tool-tile/logo formula
([03](./03-iconography-logos.md)), and the page templates and spacing scale
([04](./04-page-layout-system.md)). It introduces no new components — the
homepage is a specific arrangement of pieces already specified, plus one new
zone (the category-tile grid) defined here.

> Same caveat as doc 03: the real 11 category names aren't finalized in the
> repo yet. The wireframe below uses 11 plausible placeholder names, listed
> alphabetically, purely to make the layout concrete.

---

## 1. Above the fold

**In two seconds, a first-time visitor should understand: this is a large,
organized set of quick tools, and they can either type what they want or tap
a category — right now, without scrolling.** That's proven by what's
literally on screen, not asserted by a headline:

- The control strip's jump-search (already specified in doc 04) is
  **reused, not reinvented** — but on the homepage only, it's enlarged to be
  the visual focus of the fold: a wide search field, placeholder text that
  rotates through real tool names ("Try: BMI Calculator… EMI Calculator…
  Countdown Timer…") so breadth is demonstrated by example, not claimed in
  prose.
- Directly beneath it, a **single-row strip of category chips** (name + small
  icon, no counts here — counts belong to the full grid further down), all
  11 visible without scrolling on desktop, horizontally scrollable on
  mobile. This is the taxonomy made visible in the same glance as the
  search box.
- One line of small, Caption-styled text under the search field —
  "200 tools · 11 categories · zero sign-up" — functional, not a marketing
  tagline, and deliberately subordinate in size to the search field itself.
- **No hero illustration, no headline paragraph, no CTA button.** The search
  field is the CTA. Anything competing with it for attention above the fold
  works against the "get in, get your answer, get out" mandate from doc 01.

## 2. Category browse — handling the size imbalance

Finance & Currency (39 tools) and Personal & Social (2 tools) cannot be
allowed to visually read as "thriving" vs. "abandoned." Two decisions
address this directly:

- **Category tiles are uniform-sized navigation buttons, not content
  previews.** Each of the 11 tiles shows only: category icon (from the
  Category Color Ring, doc 03), category name, and a small Caption-weight
  tool count. Tile *size* never scales with tool count, and the tile never
  shows a preview grid of the category's actual tools — a 2-tool category
  previewing "2 tools + empty space" is exactly the broken-looking pattern
  this avoids. The tile represents "this entire domain exists," not "here's
  a sample of what's inside."
- **Order is alphabetical, not by size.** Sorting by tool count would turn
  the grid into an implicit leaderboard (Finance first and biggest-feeling,
  Personal & Social last and smallest-feeling) — exactly the hierarchy this
  needs to avoid. Alphabetical is neutral, predictable, and scannable
  ("I know roughly where to look for the one I want") without editorializing
  on which categories matter more.
- The tool-count badge is intentionally small and low-contrast
  (`--color-text-secondary`, Caption size) — present for honesty and
  filtering purposes, not styled to draw the eye or invite comparison
  between tiles.

## 3. Trending & Recently Used — different from category browse, and from
   each other

Both live in a **compact horizontal row** between the hero and the full
category grid, using the actual **tool-tile component** (icon + name, doc 03)
rather than the category-tile component — a deliberate visual distinction:
tool tiles say "jump straight to this exact tool," category tiles say
"browse this whole domain." Putting them in different components, not just
different sections, is what keeps a first-time visitor from confusing "here
are some tools" with "here is the taxonomy."

- **Trending** — site-wide aggregate usage (not personalized), recalculated
  periodically (e.g., daily). Shown to *every* visitor, including first-time
  ones with no history — it's the site's social proof / "here's what people
  actually use" row, and it's the reason it's placed **above** Recently Used.
- **Recently Used** — personal, sourced from local device history (e.g.
  localStorage of the last visited tools), last 4–6 tools. **This row does
  not render at all for a first-time visitor** — no empty state, no "no
  recent tools yet" placeholder. It only appears once there's real history,
  which keeps the homepage from showing an obviously-empty section to every
  new arrival.
- Neither row is the category grid's business: Trending/Recently Used answer
  "take me back to something I've used or others use often"; the category
  grid below answers "let me see everything that exists." Different intents,
  different components, different position on the page.

## 4. Ad placement

Homepage is the highest-traffic, first-impression page on the site — the
brief's "trustworthy, not flashy" mandate applies here more than almost
anywhere else, so ad density is deliberately **low**:

- **No ad embedded in the 11-tile category grid.** Doc 04's Template B
  embeds an ad tile in the tool grid at a fixed interval (every 12th tile) —
  that rule doesn't apply here because there are only 11 category tiles
  total; inserting an ad would either never trigger or would masquerade as a
  12th "category," corrupting the taxonomy.
- **One ad unit**, placed after the category grid and before the footer — a
  low-priority position the visitor reaches only after they've already been
  served the thing they came for (search, trending, categories). No ad
  appears in or near the hero.

## 5. Template mapping

The homepage is **not** a new, fourth template — it reuses Template B's
(Browse/Category Grid) core DNA: control strip → tile grid → footer, no
persistent sidebar, ads placed sparingly rather than sidebared. What's new is
a **hero zone** (search + category chips) and two **horizontal tool-tile
rows** (Trending, Recently Used) stacked above Template B's grid — components
that don't exist on the actual category-listing pages themselves.

Call it **Template B, extended with a homepage-exclusive hero stack**, not a
new Template D: the grid rules (uniform tiles, alphabetical-not-size-ranked
ordering, sparse ad placement, no fixed sidebar) are identical to Template B,
and nothing here should leak onto real category pages, which stay exactly as
specified in doc 04.

---

## 6. Wireframe

```
┌────────────────────────────────────────────────────────────────────┐
│ CONTROL STRIP    [Logo]   [Category ▾]   [Jump-search…]      [☾]    │
├────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                 ┌──────────────────────────────────────┐             │
│                 │ 🔍  Search 200 tools…                 │  ← hero,    │
│                 └──────────────────────────────────────┘    enlarged  │
│                     200 tools · 11 categories · zero sign-up          │
│                                                                        │
│   [Calculators][Converters][Time & Date][Finance][Health][Text][+5]   │ ← category
│                                                                        │   chip strip
├────────────────────────────────────────────────────────────────────┤
│ TRENDING                                                                │
│   [ tile ] [ tile ] [ tile ] [ tile ] [ tile ] [ tile ]                 │
├────────────────────────────────────────────────────────────────────┤
│ RECENTLY USED   — renders only if local history exists —                │
│   [ tile ] [ tile ] [ tile ] [ tile ]                                   │
├────────────────────────────────────────────────────────────────────┤
│ BROWSE ALL CATEGORIES                            (alphabetical, uniform)│
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐               │
│  │Calculators│ │Color&Design│ │Converters │ │ Developer │               │
│  │   icon    │ │   icon     │ │   icon    │ │   icon    │               │
│  │ 22 tools  │ │  8 tools   │ │ 31 tools  │ │ 15 tools  │               │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐               │
│  │  Finance  │ │ Generators │ │  Health & │ │   Misc /  │               │
│  │   icon    │ │   icon     │ │  Fitness  │ │   Other   │               │
│  │ 39 tools  │ │  9 tools   │ │ 17 tools  │ │  6 tools  │               │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘               │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                            │
│  │ Personal &│ │   Text    │ │ Time &    │                            │
│  │  Social   │ │   Tools   │ │  Date     │                            │
│  │  2 tools  │ │ 12 tools  │ │ 14 tools  │                            │
│  └───────────┘ └───────────┘ └───────────┘                            │
├────────────────────────────────────────────────────────────────────┤
│                    [  AD — single banner unit  ]                        │
├────────────────────────────────────────────────────────────────────┤
│ FOOTER — category index, legal, sitemap                                 │
└────────────────────────────────────────────────────────────────────┘
```

Note the 2-tool "Personal & Social" tile is visually identical in size,
border weight, and treatment to the 39-tool "Finance" tile — same footprint,
different number in the same small caption slot. That's the whole mechanism
for defusing the imbalance: the grid communicates "11 domains exist," and the
count is a footnote, not the headline.
