import { CartIcon } from "wear-label";

/**
 * The bag mark in the header bar.
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
    <CartIcon className="size-5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <CartIcon className="size-4" />
    <CartIcon className="size-5" />
    <CartIcon className="size-6" />
    <CartIcon className="size-8" />
  </div>
);

/** In the header: a 44px tap target with the count announced by the link itself. */
export const InHeader = () => (
  <a
    href="/cart"
    className="relative inline-flex size-11 items-center justify-center rounded-sm text-ink-body transition-colors duration-(--duration-base) hover:text-brand"
  >
    <CartIcon className="size-5" />
    <span className="sr-only">Bag</span>
    <span
      aria-hidden="true"
      data-numeric
      className="absolute right-0.5 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-pill bg-brand px-1 text-micro leading-none text-on-brand"
    >
      2
    </span>
  </a>
);
