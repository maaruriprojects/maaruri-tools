# Data and Persistence Policy

This document defines what data the application stores, where it is stored,
and when (if ever) a database should be introduced.

---

## 1. Current phase: no database

At this stage, the application uses **local JSON files only**. No database,
no Supabase, no server-side persistence.

All tool metadata lives in:
- `client/src/assets/data/tool-registry.json` — full tool metadata
- `client/src/assets/data/search-index.json` — lean search index

These files are loaded at runtime by `ToolRegistryService` and
`SearchIndexService` via `BaseApiService` / `httpResource`. The
`apiBaseUrl` in the environment files points to `/assets/data` in
development and production.

### Migration path

When a real API is needed, the only change required is updating
`apiBaseUrl` in `src/environments/environment.*.ts` from `/assets/data`
to the API origin. No service or component code changes — everything goes
through `BaseApiService`.

---

## 2. What is stored locally (browser only)

### Recently Used history

- Storage: `localStorage`, key `maaruri-recent-tools`
- Data: `[{ slug: string, category: string, timestamp: number }]`
- Max entries: 6
- Scope: device-local, never sent to a server
- Cleared by user action or by clearing browser data

### Theme preference

- Storage: `sessionStorage`, key `theme`
- Data: `'light'` or `'dark'`
- Scope: session-local, never sent to a server

---

## 3. What is NOT stored

The following must never be stored, logged, or transmitted:

- User-entered calculator values (BMI height/weight, loan amounts, etc.)
- Health data
- Financial data
- Document or text content pasted into tools
- Personal information
- IP addresses
- Authentication credentials (no auth exists at this stage)

---

## 4. When to introduce a database

A database (Supabase) is appropriate only when a feature genuinely requires
server-side state. The only identified candidate is:

### Trending tools (future, not implemented now)

- Requires: server-controlled usage recording, aggregate counts, rate
  limiting, deduplication
- Must NOT: allow client-side count manipulation, store personal data,
  retain IPs without documented legal need
- Must: use RLS, SECURITY DEFINER functions for privileged mutations,
  deny-by-default policies, generic error responses
- Before implementing: activate the `bolt-database` skill and the
  `secure-data-access` skill

No other feature in the current roadmap requires a database.

---

## 5. Rules for the AI coding tool

1. Do NOT create Supabase tables, migrations, or RLS policies unless a
   prompt explicitly requires server-side persistence.
2. Do NOT add `@supabase/supabase-js` or any database client to the project
   at this stage.
3. Do NOT store user-entered tool inputs in localStorage, sessionStorage,
   or any other storage.
4. Do NOT add authentication unless explicitly requested.
5. Use local JSON files for all tool metadata.
6. Use localStorage only for Recently Used history and theme preference.
7. Structure services so that migrating from JSON to an API requires only
   changing `apiBaseUrl` — no service or component code changes.
