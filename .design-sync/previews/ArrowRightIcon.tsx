import { ArrowRightIcon, ButtonLink } from "wear-label";

/**
 * The trailing arrow on a section\u2019s view-all action.
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
    <ArrowRightIcon className="size-5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <ArrowRightIcon className="size-4" />
    <ArrowRightIcon className="size-5" />
    <ArrowRightIcon className="size-6" />
    <ArrowRightIcon className="size-8" />
  </div>
);

/** Where the home page uses it: after the label inside an outline button. */
export const InButton = () => (
  <ButtonLink href="/shop" variant="outline" size="lg">
    View all
    <ArrowRightIcon className="size-5" />
  </ButtonLink>
);
