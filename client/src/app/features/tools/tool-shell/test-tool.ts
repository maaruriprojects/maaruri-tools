import { Component, computed, inject, signal } from '@angular/core';
import { ToolRegistryService } from '../tool-registry.service';
import type { ToolMeta } from '../../../shared/models/tool-meta';
import type { ToolPageContract } from './tool-page-contract';

// Minimal test tool that proves the ToolShell frame works end-to-end.
// Outputs a fixed value with a unit, has valid inputs, and provides a
// simple explanation. Removed in Phase 2 when real tools replace it.
@Component({
  selector: 'app-test-tool',
  template: `
    <div class="test-tool">
      <p class="test-tool__label">Test tool is active.</p>
    </div>
  `,
})
export class TestTool implements ToolPageContract {
  private readonly registry = inject(ToolRegistryService);

  readonly tool: ToolMeta = {
    slug: 'test-tool',
    title: 'Test Tool',
    category: 'time-date-tools',
    shortDescription: 'A minimal test tool.',
    componentKey: 'TestTool',
    seoDescription: 'A test tool for verifying the tool shell.',
    icon: 'clock',
  };

  readonly readout = signal<string | null>('42');
  readonly readoutUnit = signal<string | null>('units');
  readonly inputs = signal<boolean>(true);
  readonly explanation = signal<string | null>(
    'This is a test tool. It outputs a fixed value of 42 units.',
  );

  readonly relatedTools = computed<ToolMeta[]>(() =>
    this.registry
      .tools()
      .filter((t) => t.category === this.tool.category && t.slug !== this.tool.slug)
      .slice(0, 4),
  );
}
