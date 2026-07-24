// One crumb in a trail: a display label and the absolute path it links to.
// The last item in a trail represents the current page — AppBreadcrumb
// renders it as plain text (aria-current="page"), not a link.
export interface BreadcrumbItem {
  readonly label: string;
  readonly url: string;
}
