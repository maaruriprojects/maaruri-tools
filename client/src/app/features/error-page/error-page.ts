import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';

// Shared by two routes (see app.routes.ts): the 404 wildcard and
// GlobalErrorHandler's fatal-error redirect target. `title`/`metaDescription`
// bind from route `data` via withComponentInputBinding() in app.config.ts —
// each route supplies its own accurate text; the defaults below are the
// generic "something's wrong" fallback. Either way, this component only
// ever renders that static, friendly text — never the actual error.
@Component({
  selector: 'app-error-page',
  imports: [RouterLink],
  template: `
    <h1>{{ title() }}</h1>
    <p>{{ metaDescription() }}</p>
    <p><a [routerLink]="homeLink">Go back home</a></p>
  `,
})
export class ErrorPage {
  readonly title = input('Something Went Wrong');
  readonly metaDescription = input("We hit a snag. Let's get you back on track.");

  protected readonly homeLink = ['/', DEFAULT_LOCALE.code];
}
