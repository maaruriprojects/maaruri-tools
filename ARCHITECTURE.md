# Architecture

This app is an Angular 22 (zoneless, standalone-only) workspace under [client/](client/) that will
eventually host ~200 tools spread across 11 categories. The folder structure under
[client/src/app/](client/src/app/) is designed to scale to that size without turning into an
unmaintainable ball of imports.

## Top-level layout

```
src/app/
  core/        singleton services, app-wide concerns, configured once
  shared/      reusable, stateless building blocks used across features
  layout/      the app shell chrome (header, footer, sidebar, shell)
  features/    routed, lazy-loaded feature areas (home, tools, about, contact, opportunities)
src/assets/
  data/        static JSON/data files
  i18n/        translation files
  images/      static images
```

## The one-way dependency rule

Dependencies only flow in one direction:

```
features/  ─┐
layout/    ─┼──▶  shared/  ──▶  core/
```

- `core/` and `shared/` **never** import from `features/` or `layout/`.
- `layout/` and `features/` may import from `core/` and `shared/`.
- `features/` may not import from `layout/` (and vice versa) — they are siblings, not
  dependents of each other.

Why this matters: `core/` and `shared/` are the stable foundation every feature is built on. If a
low-level module reached back up into a feature, it would create a circular or hidden dependency
that makes the feature impossible to lazy-load in isolation and makes `core`/`shared` impossible to
reason about without knowing every feature that consumes them. Keeping the arrow one-directional is
what lets 200 tools be added, removed, or refactored independently without ever touching `core` or
`shared`.

## Why `features/tools` is split by category

With ~200 tools, a single flat `tools/` route or module would mean every visit to the site
downloads code for tools the user never opens. Splitting `features/tools/` into one folder per
category (`time-date-tools`, `health-fitness`, `finance-money-tools`, `work-productivity`,
`converters-calculators`, `everyday-practical-tools`, `creative-design-tools`,
`development-web-tools`, `travel-transportation`, `document-language-tools`,
`personal-social-tools`) gives each category its own lazy-loaded route boundary. A user browsing
"Health & Fitness" tools only ever downloads that category's bundle, not the other ten.

`tool-shell/` holds the shared scaffolding that every individual tool page renders inside
(layout, ad slots, breadcrumb, related-tools list, etc.), so each of the ~200 individual tools
only has to supply its own logic/UI, not reimplement the surrounding page frame.

This structure also keeps the codebase navigable at the file-tree level: finding or adding a tool
means going to its category folder, not searching through a directory of 200 flat entries.

## What belongs in `core/` vs `shared/`

**`core/`** — singleton, app-wide services that are configured once and injected everywhere.
Nothing here renders UI.

- `config/` — environment and app-wide configuration
- `logging/` — the app's logging/telemetry service
- `error-handling/` — global error handler(s)
- `loading/` — global loading-state service (e.g. route-level progress indication)
- `seo/` — meta-tag/title service used by routed pages
- `i18n/` — translation loading/setup service
- `guards/` — route guards

**`shared/`** — reusable, presentational, stateless (or locally-stateful) pieces that could be
dropped into any feature. Nothing here knows about a specific feature or route.

- `components/` — generic UI components (button, card, search-bar, pagination, breadcrumb,
  loading-spinner, toast)
- `ad-components/` — ad-slot components (ad-banner, ad-rectangle, ad-in-article, ad-auto), kept
  separate from generic UI components since they have their own lifecycle/loading concerns
- `directives/` — reusable attribute/structural directives
- `pipes/` — reusable pipes
- `models/` — shared TypeScript interfaces/types

Rule of thumb: if it's a service with app-wide state or a cross-cutting concern, it's `core/`. If
it's something you'd render in a template and could reuse in any feature, it's `shared/`.
