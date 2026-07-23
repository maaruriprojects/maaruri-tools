import { Component, input } from '@angular/core';

// Placeholder page. `title`/`metaDescription` bind from route `data` via
// withComponentInputBinding() in app.config.ts.
@Component({
  selector: 'app-home',
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ metaDescription() }}</p>
  `,
})
export class Home {
  readonly title = input('');
  readonly metaDescription = input('');
}
