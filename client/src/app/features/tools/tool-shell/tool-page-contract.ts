import type { Signal } from '@angular/core';
import type { ToolMeta } from '../../../shared/models/tool-meta';

// Contract every tool component implements. The shell renders the frame
// (layout, breadcrumbs, SEO, ads, related tools); the tool component owns
// the readout value, input validity, and explanation content via signals.
export interface ToolPageContract {
  readonly tool: ToolMeta;
  readonly readout: Signal<string | null>;
  readonly readoutUnit?: Signal<string | null>;
  readonly inputs: Signal<boolean>;
  readonly explanation: Signal<string | null>;
  readonly relatedTools: Signal<ToolMeta[]>;
}
