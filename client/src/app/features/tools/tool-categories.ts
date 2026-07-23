import { TOOL_CATEGORY_SEGMENTS, ToolCategorySegment } from '../../core/config/route-paths';

export interface ToolCategoryMeta {
  readonly title: string;
  readonly breadcrumbLabel: string;
  readonly metaDescription: string;
}

// Display metadata per category, keyed by the same path segments used for
// routing. Feeds route `data` (title/breadcrumbLabel/metaDescription) for
// every category route.
export const TOOL_CATEGORY_META: Readonly<Record<ToolCategorySegment, ToolCategoryMeta>> = {
  [TOOL_CATEGORY_SEGMENTS.timeDateTools]: {
    title: 'Time & Date Tools',
    breadcrumbLabel: 'Time & Date',
    metaDescription: 'Countdown timers, timezone converters, and other time and date utilities.',
  },
  [TOOL_CATEGORY_SEGMENTS.healthFitness]: {
    title: 'Health & Fitness Tools',
    breadcrumbLabel: 'Health & Fitness',
    metaDescription: 'BMI, calorie, and other health and fitness calculators.',
  },
  [TOOL_CATEGORY_SEGMENTS.financeMoneyTools]: {
    title: 'Finance & Money Tools',
    breadcrumbLabel: 'Finance & Money',
    metaDescription: 'Loan, currency, and other finance and money calculators.',
  },
  [TOOL_CATEGORY_SEGMENTS.workProductivity]: {
    title: 'Work & Productivity Tools',
    breadcrumbLabel: 'Work & Productivity',
    metaDescription: 'Pomodoro timers, word counters, and other work and productivity tools.',
  },
  [TOOL_CATEGORY_SEGMENTS.convertersCalculators]: {
    title: 'Converters & Calculators',
    breadcrumbLabel: 'Converters & Calculators',
    metaDescription: 'Unit converters, percentage calculators, and other general converters.',
  },
  [TOOL_CATEGORY_SEGMENTS.everydayPracticalTools]: {
    title: 'Everyday & Practical Tools',
    breadcrumbLabel: 'Everyday & Practical',
    metaDescription: 'Tip calculators, random pickers, and other everyday practical tools.',
  },
  [TOOL_CATEGORY_SEGMENTS.creativeDesignTools]: {
    title: 'Creative & Design Tools',
    breadcrumbLabel: 'Creative & Design',
    metaDescription: 'Color pickers, gradient generators, and other creative and design tools.',
  },
  [TOOL_CATEGORY_SEGMENTS.developmentWebTools]: {
    title: 'Development & Web Tools',
    breadcrumbLabel: 'Development & Web',
    metaDescription: 'JSON formatters, regex testers, and other development and web tools.',
  },
  [TOOL_CATEGORY_SEGMENTS.travelTransportation]: {
    title: 'Travel & Transportation Tools',
    breadcrumbLabel: 'Travel & Transportation',
    metaDescription: 'Distance calculators, flight time calculators, and other travel tools.',
  },
  [TOOL_CATEGORY_SEGMENTS.documentLanguageTools]: {
    title: 'Document & Language Tools',
    breadcrumbLabel: 'Document & Language',
    metaDescription: 'Word counters, text case converters, and other document and language tools.',
  },
  [TOOL_CATEGORY_SEGMENTS.personalSocialTools]: {
    title: 'Personal & Social Tools',
    breadcrumbLabel: 'Personal & Social',
    metaDescription:
      'Name generators, compatibility calculators, and other personal and social tools.',
  },
};
