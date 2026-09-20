import { BagIcon } from "wear-label";

/**
 * The choose-size action on a catalogue card.
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
    <BagIcon className="size-4.5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <BagIcon className="size-4" />
    <BagIcon className="size-5" />
    <BagIcon className="size-6" />
    <BagIcon className="size-8" />
  </div>
);

/**
 * On the card: a brand-filled square at the bottom right of the crop. It goes to
 * the product page rather than adding straight to the bag — every piece has five
 * sizes and five colourways, so a one-click add would have to guess a variant.
 */
export const OnCard = () => (
  <a
    href="/shop/moa-pants#options"
    className="wl-tap inline-flex size-9.5 items-center justify-center rounded-xs bg-brand text-on-brand transition-colors duration-(--duration-base) hover:bg-invert"
  >
    <BagIcon className="size-4.5" />
    <span className="sr-only">Choose a size: Moa Pants</span>
  </a>
);
