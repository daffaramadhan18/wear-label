import { PersonIcon } from "wear-label";

/**
 * The account mark, beside the bag in the header bar.
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
    <PersonIcon className="size-5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <PersonIcon className="size-4" />
    <PersonIcon className="size-5" />
    <PersonIcon className="size-6" />
    <PersonIcon className="size-8" />
  </div>
);

/** In the header, at the same 44px tap target as the bag. */
export const InHeader = () => (
  <a
    href="/account"
    className="inline-flex size-11 items-center justify-center rounded-sm text-ink-body transition-colors duration-(--duration-base) hover:text-brand"
  >
    <PersonIcon className="size-5" />
    <span className="sr-only">My Account</span>
  </a>
);
