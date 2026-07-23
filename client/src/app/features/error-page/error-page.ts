import { Component, input } from '@angular/core';

// Placeholder 404 / catch-all page. `title`/`metaDescription` are bound from
// route `data` via withComponentInputBinding() in app.config.ts.
@Component({
  selector: 'app-error-page',
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ metaDescription() }}</p>
  `,
})
export class ErrorPage {
  readonly title = input('Page not found');
  readonly metaDescription = input('The page you requested could not be found.');
}
