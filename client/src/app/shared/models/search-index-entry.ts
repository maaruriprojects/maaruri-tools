import { ToolCategorySegment } from '../../core/config/route-paths';

// Intentionally lean — slug, title, category, nothing else — so the whole
// index stays small enough to filter client-side against ~200 entries
// without a per-keystroke network round trip. Full tool detail (icon,
// descriptions, ...) is ToolMeta's job, not this one.
export interface SearchIndexEntry {
  readonly slug: string;
  readonly title: string;
  readonly category: ToolCategorySegment;
}
