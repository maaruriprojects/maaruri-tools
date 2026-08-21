import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Lightweight inline-SVG icon component using Tabler Icons outline paths.
// Only the icons actually referenced here are bundled — no icon font or
// full icon library is loaded, keeping the bundle small. The `name` input
// selects from the map below; unknown names render nothing.
//
// Per docs/design/03-iconography-logos.md: default color is
// --color-icon-muted; sizes are 16px (dense), 20px (nav/buttons), 24px
// (tool tiles), 40px (category tiles). Color is inherited from `currentColor`
// so consumers can override via CSS `color`.

const ICON_PATHS: Readonly<Record<string, string>> = {
  'clock': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'heart-rate-monitor': '<path d="M3 12h4l2-5 3 10 2-5h7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
  'coin': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 14c0 1 .8 2 3 2s3-1 3-2-1-2-3-2-3-1-3-2 .8-2 3-2 3 1 3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'briefcase': '<rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18" fill="none" stroke="currentColor" stroke-width="2"/>',
  'calculator': '<rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'backpack': '<path d="M5 9a7 7 0 0 1 14 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 4a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11h8" fill="none" stroke="currentColor" stroke-width="2"/>',
  'palette': '<path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2c0-1-1-1-1-2a2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-8z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7.5" cy="10.5" r="1.5" fill="currentColor"/><circle cx="9" cy="6.5" r="1.5" fill="currentColor"/><circle cx="14.5" cy="6.5" r="1.5" fill="currentColor"/>',
  'code': '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'plane': '<path d="M10 16v-6a2 2 0 0 1 4 0v6m-4-3h4m-2-9V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 10l-5 2v2l5-1M15 10l5 2v2l-5-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'file-text': '<path d="M14 3v5h5M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 13h8M8 17h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'users': '<circle cx="9" cy="7" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 3.5a4 4 0 0 1 0 7M17 21v-2a4 4 0 0 0-3-3.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'copy': '<rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/>',
  'check': '<path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'search': '<circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'x': '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'inbox': '<path d="M3 13l3 6h12l3-6M3 13l3-8h12l3 8M3 13h6l1 3h4l1-3h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'scale': '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7zM19 7l-3 6a3 3 0 0 0 6 0L19 7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'report-money': '<rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 9v6M18 9v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'braces': '<path d="M8 4c-2 0-2 2-2 4s0 4-2 4c2 0 2 2 2 4s0 4 2 4M16 4c2 0 2 2 2 4s0 4 2 4c-2 0-2 2-2 4s0 4-2 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'trash': '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};

@Component({
  selector: 'app-icon',
  template: `
    @if (safeSvg(); as svg) {
      <svg
        class="app-icon"
        viewBox="0 0 24 24"
        [attr.width]="size()"
        [attr.height]="size()"
        [attr.aria-label]="label() || null"
        [attr.role]="label() ? 'img' : null"
        [attr.aria-hidden]="label() ? null : 'true'"
        [innerHTML]="svg"
      ></svg>
    }
  `,
  styles: `
    :host { display: inline-flex; align-items: center; }
    .app-icon { color: inherit; }
  `,
})
export class AppIcon {
  private readonly sanitizer = inject(DomSanitizer);

  readonly name = input.required<string>();
  readonly size = input(20);
  readonly label = input<string | undefined>(undefined);

  protected readonly safeSvg = computed<SafeHtml | null>(() => {
    const raw = ICON_PATHS[this.name()] ?? null;
    return raw ? this.sanitizer.bypassSecurityTrustHtml(raw) : null;
  });
}
