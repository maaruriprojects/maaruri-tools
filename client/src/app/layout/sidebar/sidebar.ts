import { Component } from '@angular/core';

// Generic ad-zone region for Template A (tool detail pages, doc04 §2/§4):
// a 300px column, sticky within its scroll range, desktop-only. No current
// consumer — individual tool pages and the ad system (shared/ad-components)
// aren't built yet — so this stays a pure structural region with no
// ad-specific logic, exactly like AppCard has no opinion on its own layout
// context. Whoever places it supplies the content via projection.
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class AppSidebar {}
