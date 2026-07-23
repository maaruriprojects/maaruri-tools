import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, DefaultTitleStrategy, RouterStateSnapshot } from '@angular/router';

// Every route attaches `data: { title, breadcrumbLabel, metaDescription }`
// (see app.routes.ts) rather than the router's native `title` property, so
// the same route data can drive breadcrumbs too. This strategy reads title
// from `data.title` instead, and additionally syncs the meta description tag.
// Registered as the TitleStrategy in app.config.ts — not providedIn: 'root',
// since it must be provided under the TitleStrategy token specifically.
@Injectable()
export class RouteDataTitleStrategy extends DefaultTitleStrategy {
  private readonly meta = inject(Meta);

  override buildTitle(snapshot: RouterStateSnapshot): string | undefined {
    const title = this.deepestPrimaryRoute(snapshot)?.data['title'];
    return typeof title === 'string' ? title : undefined;
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    super.updateTitle(snapshot);

    const metaDescription = this.deepestPrimaryRoute(snapshot)?.data['metaDescription'];
    if (typeof metaDescription === 'string') {
      this.meta.updateTag({ name: 'description', content: metaDescription });
    }
  }

  private deepestPrimaryRoute(snapshot: RouterStateSnapshot): ActivatedRouteSnapshot | undefined {
    let route: ActivatedRouteSnapshot | undefined = snapshot.root;
    while (route?.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
