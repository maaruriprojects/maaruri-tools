# Responsive Strategy — Maaruri Tools

Builds on [01](./01-design-direction.md), [04](./04-page-layout-system.md), and
[06](./06-component-visual-design.md). Breakpoint numbers (mobile <768px,
tablet 768–1024px, desktop >1024px) are fixed elsewhere and implemented in
Phase 2, Day 7 — this document is about what genuinely *changes* in kind at
each tier, not the pixel values themselves. "Grid becomes 1 column" is treated
as the *uninteresting* default everywhere it applies, and called out
separately from the changes that are actually interaction-level, not just
visual reflow.

---

## 1. Touch-target sizing

Two different sizing regimes, not one scaled down:

| | Desktop (mouse/hover) | Mobile & tablet (touch) |
|---|---|---|
| Minimum tap/click area | ~32×32px effective (icon + modest padding) | **44×44px minimum**, per WCAG 2.5.5 / Apple HIG — non-negotiable |
| How it's achieved | Visible padding around the icon glyph itself | Hit area frequently **exceeds** the visible element — an icon rendered at 20–24px still gets a 44×44px invisible tap zone via padding, not a larger icon |
| Spacing between adjacent targets | Doc 06's existing gaps are sufficient | Minimum `--space-sm` (8px) gap enforced between any two separately-tappable elements, even where desktop packs them tighter |
| Rationale | Desktop can stay dense — pointer precision is high, and density is part of the "instrument panel" character the site wants at desktop width | Touch precision is much lower; undersized targets are the single most common mobile usability failure |

Buttons (doc 06) already land at ~44px height by design, so they need no
change. **Category chips and any icon-only control (theme toggle, hamburger,
the collapsed search trigger) need mobile-specific padding bumps** to reach
44×44px — their desktop sizing is deliberately tighter and should not be
reused as-is on touch.

**Caveat for implementation:** this is really a hover-capability distinction,
not strictly a width distinction — a touchscreen laptop can be "desktop
width" with no hover. Where feasible, gate the tighter desktop sizing behind
`(hover: hover) and (pointer: fine)` rather than the width breakpoint alone,
so hybrid devices get the correct target size regardless of viewport.

---

## 2. Hide, not shrink

Beyond the rectangle ad (already hidden below tablet per the ad spec), four
more candidates should disappear entirely on mobile rather than resize:

1. **The homepage's post-grid banner ad** (doc 05 §4). It's already the
   lowest-priority ad slot on the site; mobile is the most attention- and
   data-scarce context and the one where a lean, ad-light first impression
   matters most. Hide below tablet rather than reflowing it to a mobile ad
   format.
2. **Card bezel-highlight micro-detail** (the 1px inset top-edge "light
   catching a machined edge" from doc 03/06). At the smaller rendered sizes
   mobile lists actually use, it's imperceptible — it should be omitted
   below a size threshold, not scaled down to a sub-pixel line that adds
   render cost for zero visible effect.
3. **Rotating placeholder text in the hero search** (doc 05 §1). The
   rotation is a discovery/delight detail that costs attention on a small
   screen where the search field is competing with much less surrounding
   space. Mobile shows one static example string instead of a rotating one.
4. **Category dropdown's inline mega-menu behavior** (doc 01/04 control
   strip). On desktop this can render inline; on mobile there usually isn't
   room to render 11 categories as an overlay without covering the entire
   screen anyway — see §3 below, where it's replaced by navigation instead
   of hidden-and-shrunk.

Everything else in the system (grid columns, sidebar↔inline ad placement,
card counts per row) is a genuine "shrink," not a hide, and is covered by the
breakpoint sections below.

---

## 3. Mobile (<768px)

### Control strip (shared by all three page types)
- Category dropdown is not attempted as an overlay — tapping it **navigates**
  to the category grid section (homepage) or a dedicated categories index,
  a change in kind from desktop's in-place dropdown, not a shrunk version of
  it.
- The persistent search input collapses to a search **icon**. Tapping it
  opens a full-screen search mode (not a narrow inline field with a cramped
  suggestions dropdown underneath) — dedicated back/cancel affordance,
  suggestions rendered as a full-height list. This is a genuine behavior
  change: mobile search is a distinct mode, not a smaller input.

### Homepage
- Hero search stays the primary, prominent entry point (arguably *more*
  important here, since the control strip's own search is now icon-only) —
  see §2 for the static-placeholder change.
- Category chip strip: rather than relying on horizontal scroll to expose
  all 11 chips (easy to miss on a first visit, poor discoverability), show a
  curated subset (4–5) plus an explicit "View all categories ↓" link that
  jumps straight to the full grid further down the page.
- Trending / Recently Used rows: horizontal swipe/carousel, but the tile
  *count actually fetched and rendered* drops (e.g. 4 instead of 6–8) — a
  payload/scroll-fatigue change, not just a CSS reflow.
- Category grid: cards switch from vertical square tiles to **horizontal
  list rows** (icon left, name + count stacked right). Eleven full-width
  square tiles stacked vertically is a long, wasteful scroll; a compact list
  lets a mobile visitor scan all 11 in far less vertical space — this is a
  topology change, not a narrower version of the desktop tile.
- Tool-card and category-card hover-reveal (doc 06: category-color border
  only appears on hover): touch has no hover, so that cue would never be
  seen by a mobile visitor at all unless something changes. Fix: on
  touch/mobile, tool cards render a **thin (1px) category-color border at
  rest** — a permanently-visible, subtler version of what desktop only
  reveals on hover — so the cue isn't silently lost for the entire mobile
  audience.

### Tool-detail page
- Input controls stack full-width vertically (expected), **and** switch
  input mode — numeric fields trigger the mobile numeric keypad
  (`inputmode="decimal"` etc.) rather than the default text keyboard. This
  is a genuine input-method change doc 04 didn't need to specify because it
  doesn't exist on desktop.
- The Readout becomes **sticky** once the visitor scrolls past it while
  adjusting inputs further down the page — pinned just below the collapsed
  control strip so the answer stays visible while typing. This matters more
  on mobile specifically because vertical stacking puts more physical
  distance between inputs and the Readout than the wider layouts do.
- Sidebar ad (desktop) becomes a single inline block below the Readout, and
  switches to a **mobile-appropriate ad format** (e.g. a fluid or
  320-wide unit) rather than reflowing the same 300×250 desktop creative —
  a format change, not a resize.
- Related-tools row becomes a swipe/carousel, same treatment and reduced
  count as the homepage's Trending row, for consistency.
- The reading-column explanation text: genuinely just reflows to full width.
  Not every element needs a kind-change — this is the correct place for the
  boring default.

### Category browse page
- Grid: single column (the boring, correct default).
- The embedded ad tile's interval **changes from every 12th tile to roughly
  every 16–20th**. On desktop a grid ad tile occupies one cell out of a
  multi-column row (a small fraction of visual weight); on mobile's single
  column it's a full-width row like every other item, so the same
  frequency would read as far more ad-heavy. Frequency is tuned per layout,
  not held constant.
- Sort/filter control switches from an inline dropdown to a **bottom-sheet
  panel** — a standard touch pattern, and a kind-change from desktop's
  inline overlay, not a smaller dropdown fighting for precise touch
  targeting near page content.

---

## 4. Tablet (768–1024px)

### Control strip
- Category dropdown can return to an in-place overlay (there's now room),
  but the search input stays in its icon-collapsed mobile form rather than
  the full desktop inline field — tablet width is enough for a dropdown but
  often not enough to keep a full search bar, a category control, and a
  logo comfortably inline without crowding.

### Homepage
- Category chip strip returns to a single visible row (11 fit, or close to
  it, without the mobile curation step).
- Trending/Recently Used rows show more tiles per view than mobile but may
  still allow horizontal swipe rather than guaranteeing all tiles fit
  unscrolled.
- Category grid returns to the tile-card layout (not the mobile list-row
  layout) at 2–3 tiles per row.

### Tool-detail page
- Ad zone stays **inline**, not sidebared — per doc 04, the sidebar only
  activates at the top of the desktop tier. A 300px fixed column at tablet
  widths would squeeze the 720px reading column below a comfortable
  measure, so tablet keeps the mobile-style inline ad placement even though
  everything else about the layout has otherwise "grown up" to a wider
  format.
- Readout sticky behavior (mobile) is no longer necessary and turns off —
  tablet's layout keeps inputs and Readout close enough together that
  pinning adds no value and would just be visual noise.
- Input controls can begin laying out in a partial row (e.g. two fields
  side by side) instead of full mobile stacking.

### Category browse page
- Grid at 3–4 tiles per row.
- Ad interval reverts toward the desktop default (every ~12 tiles) once
  multiple tiles share a row again, per the same per-row-visual-weight
  reasoning as §3.
- Sort/filter: judgment call between the mobile bottom-sheet and desktop's
  inline dropdown depending on final tablet target-size testing — default
  to the inline dropdown once tiles are multi-column, since there's
  meaningfully more room to place it precisely.

---

## 5. Desktop (>1024px)

### Control strip
- Full inline treatment: logo, category dropdown, persistent visible
  search field with inline suggestions dropdown, theme toggle — nothing
  collapsed, nothing behind an icon.

### Homepage
- Hero search shows the full rotating-placeholder treatment.
- All 11 category chips inline, no scrolling or curation needed.
- Trending/Recently Used rows show their full tile count without requiring
  swipe interaction, space permitting.
- Category grid at up to 4 tile-cards per row (doc 05 wireframe default).
- Tool-card/category-card hover-reveal behaviors (border color on hover)
  work exactly as doc 06 specified — this is the tier they were designed
  for.

### Tool-detail page
- Two-column layout activates: content column + sticky 300px sidebar ad
  (doc 04). Readout is never sticky here — there's enough vertical room
  that inputs and the answer stay comfortably co-visible.
- Input controls lay out in a full horizontal row where the fields allow it.

### Category browse page
- Grid scales from 4 tiles/row up through 6–7 as viewport widens toward the
  1440px outer frame (doc 04 §3), where it caps — width beyond that becomes
  margin, not more columns.
- Sort/filter stays an inline dropdown.
- Embedded ad tile holds at the standard every-12th-tile interval.
