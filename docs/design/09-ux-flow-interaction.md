# UX Flow & Interaction Patterns — Maaruri Tools

Synthesizes all eight prior documents: navigation reuses the control strip
and jump-search (01, 04, 05, 07), empty states reuse existing components
rather than introducing illustration (01, 06), message voice matches the
"quiet, competent" personality (01), and the micro-interactions below either
cite or extend the motion moments already specified in
[08-animation-motion.md](./08-animation-motion.md) rather than duplicating
them.

---

## 1. Navigation logic

Because the jump-search and category control live in the persistent control
strip (doc 01/04), **they're available from every page, not just the
homepage** — so "shortest path to a tool" barely depends on where a visitor
lands. Three paths cover the overwhelming majority of sessions:

### Path A — "I know exactly what I want" (fastest: 1 real step)
Anywhere → type in the jump-search → select the matching suggestion (doc 06
§3, amber-highlighted row) → tool page.
One continuous action (type + select). This is the path the enlarged
homepage hero search (doc 05 §1) is built to funnel a first-time visitor
into as fast as possible.

### Path B — "I know the domain, not the tool name" (2 navigations)
Homepage → tap a category chip (hero strip) or category tile (grid, doc 05
§2) → category browse page (Template B) → scan the tile grid, tap the
target tool → tool page.
The category page's "← Category" back-link (doc 04 Template A) lets a
visitor retrace this path in reverse without re-navigating from scratch.

### Path C — "Take me back to something I already used" (1 navigation,
returning visitors only)
Homepage → Trending or Recently Used row (doc 05 §3) → tap a tool tile
directly → tool page.
This is the fastest path in the whole system, but only exists for visitors
who have either personal history (Recently Used) or are pointed at
site-wide popular tools (Trending) — it's not a substitute for Paths A/B,
which must work identically well for a visitor with zero history.

**Design implication:** because Path A is reachable from anywhere, no page
in the system should ever need a "take me home" affordance beyond the
persistent logo in the control strip — homepage is not a required waypoint.

---

## 2. Empty states

Governing rule: **an empty state always proposes the next action; it never
just reports absence.** No decorative illustration (consistent with doc 01's
rejection of anything "flashy") — the empty state reuses ordinary
components (Body text, a Secondary button, existing tool/category tiles),
the same restrained visual language as every other state.

### Search returns 0 matches (e.g. a typo)
Structure, top to bottom:
1. State the query and the fact plainly: `No tools match "convertor."`
2. If a close match exists (simple fuzzy/edit-distance check against real
   tool and category names), offer it as a tappable suggestion:
   `Did you mean converter?`
3. Always include a fallback that isn't dead-end text: either the Trending
   row (doc 05) or a "Browse all tools" secondary button — something
   genuinely clickable, not just an apology.

### Category filter/sort combination returns 0 results
Same structure, adapted: state which filter caused it (`No tools match this
filter.`), a primary action to clear it (`Clear filter` — Secondary button,
doc 06), and the full unfiltered grid remains one tap away rather than
requiring a full page reload.

Both cases live inside their existing template (Template B's content zone,
doc 04) with the tile grid replaced by this message block — no separate
"empty state template" is needed.

---

## 3. Message-writing voice

**Principles**, applied identically to inline form validation, toasts (doc
08 §4), and error pages (Phase 2 Day 11):

- Active voice, plain verbs. Say what happened, not what "has occurred."
- No apology. Never "Sorry," "Oops," or "Something went wrong" as a whole
  sentence with no information in it — the brief's "quiet competence"
  doesn't apologize for doing its job.
- Two-part structure: **what happened**, then **what to do** (or what's
  true now). Never leave the second half implicit.
- No exclamation points, ever — a confirmed action doesn't need enthusiasm
  performed at the user; the fact is already good news.
- Numbers and values in messages are always the specific value, never a
  vague "successfully" — `Copied 22.4` proves the action happened where
  `Copied successfully!` merely asserts it.

### Three worked examples

**Error** (toast, e.g. a live-rate fetch failing on a currency converter):
> Live exchange rates didn't load. Showing rates from your last visit.

States the failure plainly, states what the user is looking at right now —
no blame, no "please try again later" filler.

**Success** (toast, copy-to-clipboard on a Readout value):
> Copied 22.4 to clipboard.

The actual value, not a generic confirmation — proof, not reassurance.

**Empty state** (search, 0 matches):
> No tools match "convertor." Did you mean converter? Or browse all 31
> Converters.

States the query, offers the likely correction, and a concrete fallback
count/destination — never just "No results found."

**Consistency check — the same voice on an error page (Day 11, 404):**
> This tool doesn't exist. It may have moved — try search, or browse all
> 200 tools.

Same shape as the empty-state example on purpose: state the fact, offer two
concrete next actions. A 404 page and a 0-result search are the same kind of
moment (you asked for something that isn't here) and should not sound like
they were written by different people.

---

## 4. Micro-interactions

### Worth designing deliberately

- **The instant a calculation completes** — already fully specified as the
  Readout's acknowledgment pulse (doc 08 §5). Cited here as the flagship
  example this section is built around, not redefined.
- **Copying a Readout value** — likely the single most repeated interaction
  on the site (every tool produces one). A small copy icon (Tabler `copy`,
  `--color-icon-muted`, 16–20px) sits in the Readout bezel's corner, visible
  on hover (desktop) or always-on at reduced opacity (mobile, since there's
  no hover — consistent with doc 07's touch-affordance reasoning). Tapping
  it copies the value, swaps the icon to a checkmark for 1200ms, and fires
  the success toast above. One mechanism, reused everywhere a Readout
  exists — not a per-tool decision.
- **Unit/format toggles within a tool** (°C/°F, km/mi, etc.) — changing the
  toggle updates the Readout's value and **reuses the exact same
  acknowledgment pulse** as an input-driven update (doc 08 §5), rather than
  inventing a separate animation for "toggled" vs. "typed." A value change
  is a value change regardless of what caused it.
- **Inline form validation timing** — validates on blur or on submit, never
  on every keystroke. Flagging "18" as invalid while the visitor is still
  typing toward "180" is a common bad pattern this explicitly avoids;
  errors should only ever describe a value the user has actually finished
  entering.
- **Theme toggle (light/dark)** — not treated as a page-level transition
  (doc 08 §1 keeps those instant), but a single 150ms opacity crossfade
  (`--motion-base`, `--ease-standard` — existing tokens, nothing new) softens
  what would otherwise be a jarring full-page color snap. This is a
  perceptual aid, not decoration, which is why it's allowed despite doc 08's
  general restraint.

### Doesn't need special treatment

Named explicitly so restraint reads as a decision, matching doc 08's
pattern:

- Native browser scrolling — no custom smooth-scroll, no scroll-jacking,
  no parallax.
- Keyboard tab order — standard DOM order; no custom focus trapping outside
  genuine modal contexts (the mobile full-screen search, doc 07).
- Ordinary link/text hover states — native underline-on-hover is sufficient
  for inline text links; this system's custom hover treatment (doc 06) is
  reserved for cards, buttons, and tiles, not prose links.
- Category chip taps and other simple navigations — they're just Path A/B/C
  above resolving to the already-specified instant page transition (doc 08
  §1); no per-control transition to design.
