import { Component } from '@angular/core';

// Visual placeholder only — does not connect to an ad network. Per
// docs/design/06-component-visual-design.md (ad system). Full-width banner,
// 90px on desktop, hidden on mobile. Uses the ad-system's fixed
// theme-invariant tokens from _tokens.scss.
@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.html',
  styleUrl: './ad-banner.scss',
})
export class AppAdBanner {}
