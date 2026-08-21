# Tool Page Contract

This document defines the contract between the tool registry, the route
system, the ToolShell, and individual tool implementations. Every tool
built in Phase 2 must conform to this contract.

---

## 1. Registry

All tool metadata lives in `client/src/assets/data/tool-registry.json`.
Each entry is a `ToolMeta` object:

```json
{
  "slug": "bmi-calculator",
  "title": "BMI Calculator",
  "category": "health-fitness",
  "shortDescription": "Calculate your Body Mass Index from height and weight.",
  "componentKey": "BmiCalculator",
  "seoDescription": "Free BMI calculator — enter your height and weight...",
  "icon": "scale"
}
```

### Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | URL segment, kebab-case, unique |
| `title` | string | yes | Display name, Title Case |
| `category` | ToolCategorySegment | yes | One of the 11 category segments |
| `shortDescription` | string | yes | One-line blurb for cards and listings |
| `componentKey` | string | yes | PascalCase key matching the ToolShell component map |
| `seoDescription` | string | yes | Longer description for meta tags (120–160 chars) |
| `icon` | string | yes | Tabler Outline icon name |

### Sync requirements

When adding a tool, update ALL of these:
1. `tool-registry.json` — add the entry
2. `search-index.json` — add `{ slug, title, category }`
3. `tool-registry.ts` — add the slug to `TOOL_SLUGS_BY_CATEGORY[category]`
4. ToolShell component map — add `componentKey` → lazy import

If any of these are out of sync, the tool will not render, will not be
searchable, or will not be prerendered.

---

## 2. Route

Each tool is routed via `createToolCategoryRoutes(meta)` which creates:

```
/:locale/:categorySegment/:toolSlug → ToolShell
```

The `:toolSlug` param binds to `ToolShell` via `withComponentInputBinding()`.
ToolShell resolves the slug against the registry and either renders the tool
or shows `ToolNotFound`.

---

## 3. ToolShell responsibilities

The shell owns:
- Slug resolution against the registry
- Page title and meta description (from tool metadata)
- Breadcrumbs (Home > Category > Tool Title)
- Layout: Readout area, input area, explanation section, related tools, ad
- Desktop two-column layout (content + sidebar ad)
- Mobile single-column layout (sticky Readout, inline ad)
- CopyButton in the Readout
- Readout acknowledgment pulse on value change
- ToolNotFound rendering for invalid slugs

The shell does NOT own:
- Tool-specific input UI
- Tool-specific calculation logic
- Tool-specific validation
- Tool-specific explanation text

---

## 4. Tool component contract

Each tool component is a standalone Angular component that:

1. Is lazy-loaded by ToolShell based on `componentKey`.
2. Renders its own inputs inside the shell's input area.
3. Provides signals for the shell to render in the Readout and explanation.
4. Does NOT render its own Readout, breadcrumbs, ads, or related tools —
   the shell handles those.

### Interface

```typescript
export interface ToolPageContract {
  /** The resolved tool metadata from the registry. */
  readonly tool: ToolMeta;
  /** Primary result value for the Readout. Null = no result yet. */
  readonly readout: Signal<string | null>;
  /** Optional unit/label for the Readout value. */
  readonly readoutUnit?: Signal<string | null>;
  /** True when all inputs are valid and a result can be computed. */
  readonly inputsValid: Signal<boolean>;
  /** Plain-language explanation of the result. */
  readonly explanation: Signal<string | null>;
  /** Related tools from the same category (excluding this tool). */
  readonly relatedTools: Signal<ToolMeta[]>;
}
```

### Tool component structure

```
features/tools/<category>/<slug>/
  <slug>.ts          — component
  <slug>.html        — template (inputs only)
  <slug>.scss        — styles
  <slug>.spec.ts     — component tests
  <slug>.util.ts     — pure calculation logic
  <slug>.util.spec.ts — logic tests
```

### Rules

- All calculation/transformation logic lives in `<slug>.util.ts` as pure
  functions. The component calls these functions and binds results to signals.
- The component uses shared form controls (TextInput, SelectControl, etc.)
  — never raw HTML inputs.
- The component uses `AppButton` for actions — never raw `<button>`.
- The component does NOT inject `HttpClient`, `BaseApiService`, or any
  HTTP service. Tools are local computations only.
- The component does NOT access `window`, `document`, `localStorage`, or
  `sessionStorage` directly. If browser APIs are needed (clipboard, timers),
  guard with `isPlatformBrowser` or `afterNextRender`.
- The component does NOT use `eval`, `Function` constructors, `innerHTML`
  with untrusted input, or untrusted URL navigation.
- The component respects `prefers-reduced-motion`.

---

## 5. States

Every tool must handle these states:

| State | Readout | Inputs | Explanation |
|---|---|---|---|
| Empty (no input yet) | Placeholder or empty | Visible, no errors | Hidden or default |
| Valid input | Computed result in amber | Visible, no errors | Shown |
| Invalid input | Previous value or empty | Visible, error messages | Hidden |
| Loading | N/A (tools are synchronous) | Visible | Hidden |

Tools are synchronous — no loading spinner for calculations. The only
loading state is the registry loading before the tool renders.

---

## 6. Adding a new tool (checklist)

1. [ ] Add entry to `tool-registry.json`
2. [ ] Add entry to `search-index.json`
3. [ ] Add slug to `TOOL_SLUGS_BY_CATEGORY[category]` in `tool-registry.ts`
4. [ ] Create the tool component folder: `features/tools/<category>/<slug>/`
5. [ ] Create `<slug>.util.ts` with pure calculation functions
6. [ ] Create `<slug>.util.spec.ts` with logic tests
7. [ ] Create `<slug>.ts` component using shared form controls
8. [ ] Create `<slug>.html` template (inputs only)
9. [ ] Create `<slug>.scss` styles
10. [ ] Create `<slug>.spec.ts` component tests
11. [ ] Add `componentKey` → lazy import to ToolShell component map
12. [ ] Run type-check, lint, tests, production build
13. [ ] Verify in browser at desktop, tablet, mobile in both themes
