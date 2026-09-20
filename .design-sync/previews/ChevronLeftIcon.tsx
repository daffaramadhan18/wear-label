import { ChevronLeftIcon } from "wear-label";

/**
 * Previous — the hero carousel\u2019s backward arrow.
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
    <ChevronLeftIcon className="size-5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <ChevronLeftIcon className="size-4" />
    <ChevronLeftIcon className="size-5" />
    <ChevronLeftIcon className="size-6" />
    <ChevronLeftIcon className="size-8" />
  </div>
);

/** As the hero draws it: a cream disc parked on the band's left edge. */
export const CarouselArrow = () => (
  <span className="inline-flex size-11 items-center justify-center rounded-pill bg-canvas text-ink shadow-sm">
    <ChevronLeftIcon className="size-5" />
  </span>
);
