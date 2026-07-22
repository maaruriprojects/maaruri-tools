# Motion Language — Maaruri Tools

Builds on [01-design-direction.md](./01-design-direction.md). This is a site
used briefly and often — the same person may trigger these transitions
dozens of times in a session. Motion here behaves like an instrument
responding, not a marketing site delighting a first-time visitor: quick,
mechanical, non-repeating. No bounce, no overshoot, no elastic/spring easing
anywhere in this system — those read as playful, and playful is exactly what
doc 01 ruled out.

## 0. Motion tokens

| Token | Value | Use |
|---|---|---|
| `--motion-instant` | 0ms | focus-visible ring, route transitions |
| `--motion-fast` | 100ms | press/active states, exits |
| `--motion-base` | 150ms | hover entrances, the Readout's update pulse |
| `--motion-slow` | 200ms | toast entrance (the single longest duration in this system) |
| `--ease-out-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` | things appearing/responding — fast deceleration, no overshoot |
| `--ease-in-snap` | `cubic-bezier(0.7, 0, 0.84, 0)` | things dismissing/exiting — fast acceleration out |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | plain state changes (color, border) |
| `--ease-linear` | `linear` | the loading spinner's rotation only |

General rule across every moment below: **exits are equal to or faster than
entrances.** Something arriving can take a beat to register; something
leaving doesn't need to be savored.

---

## 1. Page / route transitions — no animation

Route changes render **instantly**. No fade, no slide, no cross-fade between
views.

**Why:** a fade-through costs the same handful of frames whether it's a
visitor's 1st or 40th navigation this session, and on a site whose whole
premise is "get in, get your answer, get out," that cost is pure added
latency with no informational payoff — a control panel doesn't fade when you
flip your attention to a different gauge. Scroll position resets on
navigation as expected browser behavior; that's correctness, not a designed
animation.

**Reduced motion:** not applicable — already the reduced-motion-safe default.

---

## 2. Card & button hover / press (doc 06 interactive states)

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Card hover-in (lift + border color + shadow) | 150ms (`--motion-base`) | `--ease-out-snap` | doc 06's `translateY(-2px)`, border→category-color, shadow appears — all animate together |
| Card hover-out | 100ms (`--motion-fast`) | `--ease-in-snap` | faster than the entrance, per the exits-are-faster rule |
| Button press (active) | 80ms | `--ease-out-snap` | `translateY(1px)` + shadow removal — near-instant, reads as a mechanical click, not a soft depress |
| Button release | 100ms | `--ease-standard` | returns to resting state |
| Border/color-only transitions (e.g. secondary button hover) | 120ms | `--ease-standard` | color changes don't need the snap curve — a plain quick fade reads as calmer for non-spatial changes |

**Focus-visible ring: `--motion-instant` (0ms), always, no exceptions.**
A focus ring that fades in — even quickly — leaves a keyboard user uncertain
for a frame or two whether they've actually landed on the control. Focus
indication is not a place to spend any of this system's restraint budget on
"designed" motion; it must simply be there the instant it's true.

**Reduced motion:** remove the `translateY` component entirely (card lift,
button press-down) — state changes (border color, shadow presence) still
happen, just without spatial movement, at the same durations. Since these
were already short and mostly color/opacity-driven, the reduced-motion
version is barely different from the default.

---

## 3. Loading spinner (Phase 2, Day 12)

Used **only** for genuine waits — network calls (ad units, any fetch that
can plausibly exceed ~300ms). Never used for tool calculations themselves,
which must be synchronous — a spinner on a unit conversion would contradict
doc 01's "trust it to be accurate, reach for it quickly" directly.

- **Delayed appearance:** the spinner does not render at all until the wait
  has already lasted ~200ms. A wait that resolves before that never shows a
  spinner — flashing one on-screen for 80ms to cover a near-instant load
  makes the product feel slower by drawing attention to a wait that was
  barely perceptible.
- **Form:** a thin-stroke rotating arc (not a multi-dot bounce — dots
  bouncing is exactly the "playful loader" this system avoids), colored
  `--color-icon-muted` — **not** `--color-accent`. Amber stays reserved for
  a live/confirmed value (docs 02, 06); a spinner is explicitly the opposite
  state — nothing is confirmed yet — so it must never borrow that color.
- **Motion:** continuous rotation, 800ms per full turn, `--ease-linear` —
  constant speed, like a sweeping gauge needle, not an accelerating/
  decelerating "loading" flourish.
- **Mount/unmount:** 100ms opacity fade, `--ease-standard`.

**Reduced motion:** the continuous indefinite rotation is precisely the kind
of motion `prefers-reduced-motion` exists for — replace it with a static arc
that gently pulses opacity (100%→50%→100%) on a slow 1.5s cycle, no rotation
at all.

---

## 4. Toast entrance / exit (Phase 2, Day 13)

- **Entrance:** slide + fade in from its anchored edge, 200ms
  (`--motion-slow` — the one deliberately longer duration in this system,
  because a toast is new information appearing outside the user's focus and
  needs a beat to be noticed), `--ease-out-snap`. No overshoot/bounce.
- **Exit:** fade + slide out, 100ms (`--motion-fast`), `--ease-in-snap` —
  half the entrance duration, consistent with the exits-are-faster rule.
- **Auto-dismiss lifetime:** 4000ms visible before the exit begins (noted
  here so Day 13 doesn't need to re-decide it, though it's a duration
  policy, not an animation spec).

**Reduced motion:** remove the slide/transform component; keep the opacity
fade only, at the same durations. The toast still visibly appears and
disappears — it just doesn't travel.

---

## 5. The Readout value update (signature element, docs 01 & 03)

The most important moment in this document, because it's the one place doc
01's signature element actually does something.

**The number itself never counts up or animates through intermediate
values.** An odometer-style count-up is a common decorative pattern for
marketing stat counters — appropriate for a website performing for an
audience, wrong for an instrument reporting a fact. The moment an input
changes, the correct value is simply present. Anything else would mean the
Readout briefly displays a number that isn't the answer, which is a small
but real betrayal of "trust it to be accurate."

**What does animate — a single acknowledgment pulse, not a digit
transition:** the active/amber portion of the Readout does one quick
opacity flicker (100% → 60% → 100%) over 150ms (`--motion-base`),
`--ease-standard`, the instant a new value lands. This borrows the existing
"amber = live" language (doc 02 §3) rather than inventing new motion
vocabulary — it reads as an indicator light confirming "reading refreshed,"
not as a transition of the number itself. No repeat, no loop, fires once per
update.

**Reduced motion:** unaffected — this is already an opacity-only pulse with
no transform component, so it's reduced-motion-safe by construction. No
override needed, which is itself worth noting: the signature element was
designed inside the reduced-motion constraint from the start, not patched
to comply with it afterward.

---

## 6. Never animated, on purpose

Restraint as a stated decision, not an absence of one:

- **Page/route transitions** (§1) — latency cost with no payoff at this
  usage frequency.
- **The Readout's digits** (§5) — accuracy would be momentarily misrepresented.
- **Tool logos / pictograms** (doc 03) — no idle motion, no hover wiggle,
  ever. An engraved panel label doesn't move; animating it would undercut
  the entire "instrument, not illustration" reasoning behind the logo system.
- **Any background/decorative motion** — no parallax, no gradient drift, no
  floating shapes, anywhere on the site. Consistent with doc 01's rejection
  of anything "flashy."
- **Skeleton-shimmer loading placeholders** — deliberately not used, in
  favor of the spinner in §3. A shimmer implies content is still being
  assembled; this site's tool content is static and instant, so the only
  legitimate wait is a genuine network call, which gets the honest spinner
  instead of a shimmer implying more work is happening than actually is.

---

## 7. Reduced-motion summary

| Moment | Default | `prefers-reduced-motion: reduce` |
|---|---|---|
| Page transitions | none | unchanged (already none) |
| Card/button hover & press | transform + color/shadow | transform removed; color/shadow unchanged |
| Focus ring | instant | unchanged (already instant) |
| Loading spinner | continuous rotation | rotation replaced with slow opacity pulse |
| Toast enter/exit | slide + fade | slide removed; fade unchanged |
| Readout update pulse | opacity flicker | unchanged (already opacity-only) |

Implementation rule for Phase 2: every transition with a transform component
(`translateY`, `rotate`) must have an explicit override inside a
`prefers-reduced-motion: reduce` query that removes the transform while
preserving any accompanying opacity/color change at the same or a shorter
duration. Nothing in this system should simply vanish or snap with zero
feedback under reduced motion — the state change still needs to be visible,
just not spatial.
