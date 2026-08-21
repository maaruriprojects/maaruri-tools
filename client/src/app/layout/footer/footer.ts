import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_LOCALE } from '../../core/i18n/locale';
import {
  TOOL_CATEGORY_SEGMENT_LIST,
  ToolCategorySegment,
} from '../../core/config/route-paths';
import { TOOL_CATEGORY_META } from '../../features/tools/tool-categories';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class AppFooter {
  readonly locale = DEFAULT_LOCALE.code;
  readonly categories = TOOL_CATEGORY_SEGMENT_LIST;
  readonly categoryMeta = TOOL_CATEGORY_META;
  readonly year = new Date().getFullYear();

  categoryRoute(segment: ToolCategorySegment): (string | number)[] {
    return ['/', this.locale, segment];
  }
}
