import { Component, input } from '@angular/core';

// Placeholder page. `title`/`metaDescription` bind from route `data` via
// withComponentInputBinding() in app.config.ts. Real legal copy is a
// business decision outside this task's scope — same placeholder framing
// as About/Contact.
@Component({
  selector: 'app-privacy',
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ metaDescription() }}</p>
  `,
})
export class Privacy {
  readonly title = input('');
  readonly metaDescription = input('');
}
