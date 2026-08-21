import { ToolCategorySegment } from '../../core/config/route-paths';

export interface CategoryMeta {
  readonly segment: ToolCategorySegment;
  readonly title: string;
  readonly breadcrumbLabel: string;
  readonly metaDescription: string;
  readonly icon: string;
  readonly toolCount: number;
}
