import { Component, inject, input } from '@angular/core';
import { ToolRegistryService } from '../tools/tool-registry.service';

// Placeholder page. `title`/`metaDescription` bind from route `data` via
// withComponentInputBinding() in app.config.ts. The tool list below proves
// ToolRegistryService end-to-end: signal-driven data plus loading/error states.
@Component({
  selector: 'app-home',
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ metaDescription() }}</p>

    @if (toolRegistry.isLoading()) {
      <p>Loading tools…</p>
    } @else if (toolRegistry.error(); as error) {
      <p>Couldn't load tools: {{ error.message }}</p>
    } @else {
      <ul>
        @for (tool of toolRegistry.tools(); track tool.slug) {
          <li>{{ tool.title }}</li>
        }
      </ul>
    }
  `,
})
export class Home {
  readonly title = input('');
  readonly metaDescription = input('');

  protected readonly toolRegistry = inject(ToolRegistryService);
}
