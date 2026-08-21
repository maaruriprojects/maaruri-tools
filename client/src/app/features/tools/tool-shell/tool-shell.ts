import {
  Component,
  EnvironmentInjector,
  computed,
  effect,
  inject,
  input,
  signal,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AppCopyButton } from '../../../shared/components/copy-button/copy-button';
import { AppAdRectangle } from '../../../shared/ad-components/ad-rectangle/ad-rectangle';
import { AppToolTile } from '../../../shared/components/tool-tile/tool-tile';
import { ToolNotFound } from './tool-not-found/tool-not-found';
import { ToolRegistryService } from '../tool-registry.service';
import { DEFAULT_LOCALE } from '../../../core/i18n/locale';
import { TestTool } from './test-tool';
import type { ToolMeta } from '../../../shared/models/tool-meta';
import type { ToolPageContract } from './tool-page-contract';

// Maps componentKey from ToolMeta to a tool component type.
// Phase 1 has only TestTool; Phase 2 replaces this with lazy imports.
const TOOL_COMPONENTS: Record<string, Type<ToolPageContract>> = {
  TestTool,
};

// Tool detail shell — Template A per docs/design/04-page-layout-system.md.
// Resolves the :toolSlug against the registry, renders the tool component
// inside a layout frame (readout, input area, explanation, related tools,
// sidebar ad), and handles SEO/breadcrumbs. Invalid slugs render ToolNotFound.
@Component({
  selector: 'app-tool-shell',
  imports: [AppCopyButton, AppAdRectangle, AppToolTile, ToolNotFound],
  templateUrl: './tool-shell.html',
  styleUrl: './tool-shell.scss',
})
export class ToolShell {
  readonly toolSlug = input<string | undefined>(undefined);
  readonly title = input('');
  readonly metaDescription = input('');
  readonly breadcrumbLabel = input('');
  readonly categorySegment = input.required<string>();

  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly toolRegistry = inject(ToolRegistryService);
  private readonly envInjector = inject(EnvironmentInjector);
  private readonly vcr = inject(ViewContainerRef);

  protected readonly locale = DEFAULT_LOCALE.code;

  protected readonly registryTools = computed<readonly ToolMeta[]>(() =>
    this.toolRegistry.error() ? [] : this.toolRegistry.tools(),
  );

  protected readonly tool = computed<ToolMeta | undefined>(() => {
    const slug = this.toolSlug();
    if (!slug) return undefined;
    return this.registryTools().find((t) => t.slug === slug);
  });

  protected readonly toolNotFound = computed(() => !this.tool());

  protected readonly relatedTools = computed<readonly ToolMeta[]>(() => {
    const current = this.tool();
    if (!current) return [];
    return this.registryTools()
      .filter((t) => t.category === current.category && t.slug !== current.slug)
      .slice(0, 4);
  });

  protected readonly toolContract = signal<ToolPageContract | null>(null);
  protected readonly componentLoading = signal(false);

  protected readonly readoutValue = computed<string | null>(() => {
    const contract = this.toolContract();
    return contract ? contract.readout() : null;
  });

  protected readonly readoutUnit = computed<string | null>(() => {
    const contract = this.toolContract();
    return contract?.readoutUnit ? contract.readoutUnit() : null;
  });

  protected readonly explanation = computed<string | null>(() => {
    const contract = this.toolContract();
    return contract ? contract.explanation() : null;
  });

  protected readonly hasRelatedTools = computed(() => this.relatedTools().length > 0);

  protected toolLink(tool: ToolMeta): string[] {
    return ['/', this.locale, tool.category, tool.slug];
  }

  constructor() {
    // Render the tool component when the resolved tool changes
    effect(() => {
      const tool = this.tool();
      if (!tool) {
        this.vcr.clear();
        this.toolContract.set(null);
        return;
      }

      const componentType = TOOL_COMPONENTS[tool.componentKey];
      if (!componentType) {
        this.vcr.clear();
        this.toolContract.set(null);
        return;
      }

      this.componentLoading.set(true);
      this.vcr.clear();
      const ref = this.vcr.createComponent(componentType, {
        environmentInjector: this.envInjector,
      });
      this.toolContract.set(ref.instance);
      this.componentLoading.set(false);
    });

    // Update SEO when the tool resolves
    effect(() => {
      const tool = this.tool();
      if (tool) {
        this.titleService.setTitle(tool.title);
        this.metaService.updateTag({ name: 'description', content: tool.seoDescription });
      } else if (this.toolNotFound()) {
        this.titleService.setTitle('Tool Not Found');
        this.metaService.updateTag({
          name: 'description',
          content: 'The requested tool could not be found.',
        });
      }
    });
  }
}
