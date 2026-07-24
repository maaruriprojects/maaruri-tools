import { ToolCategorySegment } from '../../core/config/route-paths';

export interface ToolMeta {
  /** URL segment for the tool's :toolSlug route, e.g. "bmi-calculator". */
  readonly slug: string;
  readonly title: string;
  readonly category: ToolCategorySegment;
  /** Short blurb for tool cards and category listings. */
  readonly shortDescription: string;
  /** Maps to the Angular component that renders this tool (registry TBD). */
  readonly componentKey: string;
  /** Longer, SEO-oriented description for the tool detail page's meta tags. */
  readonly seoDescription: string;
  /** Tabler Outline icon name for the tool logo (see docs/design/03-iconography-logos.md). */
  readonly icon: string;
}
