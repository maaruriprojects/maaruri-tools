import { Routes } from '@angular/router';
import { TOOL_CATEGORY_SEGMENTS } from '../../../core/config/route-paths';
import { createToolCategoryRoutes } from '../create-tool-category-routes';
import { TOOL_CATEGORY_META } from '../tool-categories';

export const FINANCE_MONEY_TOOLS_ROUTES: Routes = createToolCategoryRoutes(
  TOOL_CATEGORY_META[TOOL_CATEGORY_SEGMENTS.financeMoneyTools],
);
