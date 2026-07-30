import { Component, computed, effect, inject, input } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { AppLoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { DigitalClock } from '../time-date-tools/digital-clock/digital-clock';
import { ToolRegistryService } from '../tool-registry.service';
import { ToolComingSoon } from './tool-coming-soon';

// The `:toolSlug` route target for every category (see
// create-tool-category-routes.ts) — the shared scaffolding ARCHITECTURE.md
// describes: "each of the ~200 individual tools only has to supply its own
// logic/UI, not reimplement the surrounding page frame." `title`/
// `metaDescription` bind from route `data` via withComponentInputBinding()
// in app.config.ts, same as ToolComingSoon; `toolSlug` from the route param.
//
// Resolves the real ToolMeta by slug and, per its componentKey, renders the
// matching real tool component — or falls back to ToolComingSoon for every
// slug that doesn't have one yet (the other ~199 tools, and any slug not in
// the registry at all).
//
// One @switch @case per real tool is the right amount of machinery for tool
// #1 (DigitalClock) — a generic string-keyed dynamic-component registry
// would be over-engineering until there are enough real tools (~10+) to
// make a flat @switch unwieldy. Whoever adds tool #2 adds a second @case.
//
// Each @case's component is a plain eager import in `imports` below, not
// wrapped in `@defer`: @defer only renders its placeholder during SSR by
// default (real content is deferred to client-side hydration), which would
// mean the prerendered HTML for every tool page — the thing 40+ prerendered
// routes in this app exist for — has no actual tool content in it. That
// costs DigitalClock's chunk being bundled with ToolShell's shared chunk
// (loaded for all 11 categories) instead of its own lazy chunk — a fine
// tradeoff at tool #1, worth revisiting once that shared chunk's size
// actually matters.
@Component({
  selector: 'app-tool-shell',
  imports: [AppLoadingSpinner, ToolComingSoon, DigitalClock],
  templateUrl: './tool-shell.html',
  styleUrl: './tool-shell.scss',
})
export class ToolShell {
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  readonly toolSlug = input<string>();
  readonly title = input('');
  readonly metaDescription = input('');

  protected readonly isLoading = this.toolRegistry.isLoading;

  protected readonly tool = computed(() =>
    this.toolRegistry.tools().find((candidate) => candidate.slug === this.toolSlug()),
  );

  constructor() {
    // Route `data.title`/`data.metaDescription` are a category-level
    // placeholder (see create-tool-category-routes.ts's own comment) — once
    // the real ToolMeta resolves, these override them with the actual
    // per-tool values, the same Title/Meta primitives RouteDataTitleStrategy
    // already uses for static route data.
    effect(() => {
      const resolved = this.tool();
      if (resolved) {
        this.titleService.setTitle(resolved.title);
        this.meta.updateTag({ name: 'description', content: resolved.seoDescription });
      }
    });
  }
}
