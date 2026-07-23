import { TOOL_CATEGORY_SEGMENTS, ToolCategorySegment } from '../../core/config/route-paths';

/**
 * Placeholder tool registry (Day 6 replaces this with the real registry that
 * resolves tool components by slug). It exists now purely to give the
 * `:toolSlug` route and the SSR prerender config concrete slugs to work with,
 * so both can be proven end-to-end before the real registry lands.
 */
export const TOOL_SLUGS_BY_CATEGORY: Readonly<Record<ToolCategorySegment, readonly string[]>> = {
  [TOOL_CATEGORY_SEGMENTS.timeDateTools]: ['countdown-timer', 'timezone-converter'],
  [TOOL_CATEGORY_SEGMENTS.healthFitness]: ['bmi-calculator', 'calorie-counter'],
  [TOOL_CATEGORY_SEGMENTS.financeMoneyTools]: ['loan-calculator', 'currency-converter'],
  [TOOL_CATEGORY_SEGMENTS.workProductivity]: ['pomodoro-timer', 'word-counter'],
  [TOOL_CATEGORY_SEGMENTS.convertersCalculators]: ['unit-converter', 'percentage-calculator'],
  [TOOL_CATEGORY_SEGMENTS.everydayPracticalTools]: ['tip-calculator', 'random-picker'],
  [TOOL_CATEGORY_SEGMENTS.creativeDesignTools]: ['color-picker', 'gradient-generator'],
  [TOOL_CATEGORY_SEGMENTS.developmentWebTools]: ['json-formatter', 'regex-tester'],
  [TOOL_CATEGORY_SEGMENTS.travelTransportation]: ['distance-calculator', 'flight-time-calculator'],
  [TOOL_CATEGORY_SEGMENTS.documentLanguageTools]: ['word-counter-pro', 'text-case-converter'],
  [TOOL_CATEGORY_SEGMENTS.personalSocialTools]: ['name-generator', 'compatibility-calculator'],
};
