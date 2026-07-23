import { Component, input } from '@angular/core';

// Placeholder for both a category's index route and its `:toolSlug` child.
// Day 6 replaces this with the real registry-resolved tool component; this
// exists to prove the routing (locale > category > toolSlug) resolves
// end-to-end, including that route `data` and the `toolSlug` param reach
// the rendered page. `title`/`breadcrumbLabel`/`metaDescription` are bound
// from route `data`, `toolSlug` from the route param, via
// withComponentInputBinding() in app.config.ts.
@Component({
  selector: 'app-tool-coming-soon',
  template: `
    <p>{{ breadcrumbLabel() }}</p>
    <h1>{{ title() }}</h1>
    <p>{{ metaDescription() }}</p>
    @if (toolSlug(); as slug) {
      <p>The "{{ slug }}" tool is coming soon.</p>
    } @else {
      <p>Tools in this category are coming soon.</p>
    }
  `,
})
export class ToolComingSoon {
  readonly title = input('');
  readonly breadcrumbLabel = input('');
  readonly metaDescription = input('');
  readonly toolSlug = input<string>();
}
