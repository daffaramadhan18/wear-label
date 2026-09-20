import { ChevronRightIcon } from "wear-label";

/**
 * Next \u2014 the hero\u2019s forward arrow, and the filter rail\u2019s disclosure marker.
 *
 * Icons are decorative — every one renders `aria-hidden`, so when a mark is the
 * only content of a control the CONTROL carries the accessible name (an `sr-only`
 * span, an `aria-label`). Colour is `currentColor` and size comes from the
 * caller's className, never from a prop: `text-brand` + `size-5` on the parent is
 * the whole styling contract.
 */

/** At the size the storefront actually draws it. */
export const Default = () => (
  <span className="text-ink">
    <ChevronRightIcon className="size-5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <ChevronRightIcon className="size-4" />
    <ChevronRightIcon className="size-5" />
    <ChevronRightIcon className="size-6" />
    <ChevronRightIcon className="size-8" />
  </div>
);

/** As the hero draws it, and as the filter rail uses it to mark a group. */
export const CarouselArrow = () => (
  <span className="inline-flex size-11 items-center justify-center rounded-pill bg-canvas text-ink shadow-sm">
    <ChevronRightIcon className="size-5" />
  </span>
);
