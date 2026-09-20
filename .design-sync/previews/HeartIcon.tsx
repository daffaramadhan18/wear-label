import { HeartIcon } from "wear-label";

/**
 * Save for later, on a catalogue card and the product page.
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
    <HeartIcon className="size-4.5" />
  </span>
);

/** The mark holds up across the sizes the pages use it at. */
export const Sizes = () => (
  <div className="flex items-end gap-5 text-ink">
    <HeartIcon className="size-4" />
    <HeartIcon className="size-5" />
    <HeartIcon className="size-6" />
    <HeartIcon className="size-8" />
  </div>
);

/**
 * Both states of the save control. Saved is camel, unsaved is muted ink — but the
 * colour is never carrying it alone: SaveButton puts the state on `aria-pressed`
 * and names it in an `sr-only` span.
 */
export const SavedAndUnsaved = () => (
  <div className="flex gap-3">
    <span className="wl-tap inline-flex size-9.5 items-center justify-center rounded-xs bg-canvas text-ink-muted">
      <HeartIcon className="size-4.5" />
    </span>
    <span className="wl-tap inline-flex size-9.5 items-center justify-center rounded-xs bg-canvas text-brand">
      <HeartIcon className="size-4.5" />
    </span>
  </div>
);
