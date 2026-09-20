import { ExchangeIcon } from "wear-label";

/**
 * The easy-exchange mark in the service band.
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
    <ExchangeIcon className="size-7.5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <ExchangeIcon className="size-4" />
    <ExchangeIcon className="size-5" />
    <ExchangeIcon className="size-6" />
    <ExchangeIcon className="size-8" />
  </div>
);

/** In the band: camel on an inert disc, beside the promise and its detail. */
export const InServiceBand = () => (
  <span className="flex items-center gap-4.5">
    <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-pill bg-inert text-brand">
      <ExchangeIcon className="size-7.5" />
    </span>
    <span className="flex flex-col gap-1.5">
      <span className="text-label font-medium uppercase tracking-nav text-ink">Easy exchange</span>
      <span className="text-caption text-ink-muted">One free swap in 14 days</span>
    </span>
  </span>
);
