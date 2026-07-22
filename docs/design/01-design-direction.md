# Design Direction — Maaruri Tools

## Context

Maaruri Tools is a utility-tools platform — nearly 200 small, focused tools (clocks,
calculators, converters, generators) across 11 categories, used briefly and often,
monetized by ads, built to feel trustworthy and precise rather than flashy.

## Design Brief

### Mood / personality

Maaruri Tools should feel like a well-kept drawer of hand instruments — a kitchen scale, a
tape measure, a good calculator, a multimeter — objects picked up quickly, trusted without a
second thought, and put back down the moment the reading is taken. Not a laboratory (too
expert, too cold) and not a dashboard (too much status-tracking, too "SaaS") — closer to
everyday hand tools: unglamorous, exact, faintly tactile, usable by a student and a
contractor alike with zero learning curve. The personality is competent and quiet — it
doesn't need to convince you it's precise, because how fast you get an answer and how the
number is displayed already proves it.

### Palette

Each color has a functional job, named after instrument parts rather than generic brand roles.

| Name | Hex | Role |
|---|---|---|
| Bezel Gray | `#E6E8EA` | page background — brushed-aluminum cool, not warm |
| Casing White | `#F8F9F9` | tool-module surface |
| Engraved Ink | `#262B2E` | primary text — graphite, not pure black |
| Steel | `#5B6B74` | secondary text, borders, inactive icons |
| Indicator Amber | `#E8A33D` | the *one* functional accent — marks a live/active value |
| Confirm Green | `#3F9C6D` | copy/success confirmation only — never decorative |

### Typefaces

- **Display** (restrained — titles, category legends only): **IBM Plex Sans Condensed** —
  chosen for its literal engineering-identity backstory, not just its look.
- **Body**: **Public Sans** — designed for the U.S. Web Design System explicitly to maximize
  clarity and trust-at-a-glance in civic interfaces; a defensible pick for a "get in, get
  your answer, get out" product.
- Numbers get their own treatment, not a third "role" — see the signature element below.

### Layout concept

Every page — home, category, and each of the ~200 tools — sits on the same dense,
evenly-spaced module grid of a breaker panel: small rectangular units with a monochrome
engraved-line icon, a name, and a one-line function, grouped under category legends, with a
persistent top-bar jump-search so anyone can go straight to tool #147 without ever browsing
categories.

### Signature element

**The Readout** — every tool's output sits in a slightly recessed panel (inset shadow,
hairline top edge like a machined bezel catching light), set in tabular-figure monospace,
with Indicator Amber used *exclusively* to mark the live digit or unit toggle. It's the one
piece of color on an otherwise near-monochrome interface, so it reads instantly as "this is
your answer" across all 200 tools regardless of category.

## Self-Critique

For each choice: would this happen for almost any similar brief, or is it specific to a
utility-tools platform used by people who want to get in, get their answer, and get out?

**Mood.** The first instinct was "lab/engineering precision" — that's genericizable to almost
any technical product and risks feeling cold or expert-only for a consumer, ad-monetized
site anyone might land on. *Changed:* shifted the metaphor from lab equipment to
household/workshop hand tools (kitchen scale, tape measure) — grounds trust in everyday
familiarity instead of scientific authority.

**Palette.** "Neutral gray + one accent" is arguably as common a default now as the banned
cream/terracotta combo — it's the current dev-tool cliché. *Changed:* gave every color a
named functional job (bezel/casing/ink/steel/indicator/confirm) and hard-restricted amber and
green to specific signaling states only, never decorative use in buttons or headers — that
restriction is what stops it collapsing into generic "SaaS gray with an accent" the moment
someone applies it broadly.

**Typography.** Grotesque-sans-plus-mono is close to the current "technical site" default
(Space Grotesk fatigue is real). *Changed:* picked Plex and Public Sans for specific,
checkable justifications (IBM's engineering heritage, USWDS's trust mandate) rather than
"looks clean and modern," and explicitly banned mono from body copy — reserving it only for
computed numbers, since over-applying mono everywhere is the generic-tech-site tell.

**Layout.** A card grid with categories is what almost anyone would produce for 200 items —
not specific on its own. *Changed:* icons must be monochrome engraved linework, never the
colorful gradient-blob icons typical of SaaS card grids; and jump-search is treated as
load-bearing navigation, not a nice-to-have, because at 200 tools, forcing people to browse
categories is a failure mode for the "get in, get out" user. Also rejected both zero-radius
(banned) and full-pill-rounded (generic-friendly-SaaS) corners in favor of a small consistent
chamfer evoking a machined bezel edge.

**Signature element.** This is the least generic piece — a recessed monospace readout only
makes sense because the product's core content is always a computed number. Kept as the
anchor, and sharpened by making amber exclusively tied to it, so the accent can't get diluted
into ordinary buttons/links elsewhere.
