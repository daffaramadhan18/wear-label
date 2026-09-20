import { SaveButton } from "wear-label";

/**
 * Save for later.
 *
 * **Browser-local, deliberately.** Whether the storefront has customer accounts at
 * all is still an open decision, and a wishlist that outlives the browser is a
 * customer record — which belongs in Shopify, not here. So this keeps a list of
 * product handles in `localStorage` and nothing else: no request, no account,
 * nothing to migrate but the key name if the decision goes the other way.
 *
 * The list is read with `useSyncExternalStore`, not copied into state by an
 * effect. That buys three things: the server render is defined (nothing is saved,
 * as far as the server can know), every button showing the same handle updates
 * together, and a change in another tab arrives through the `storage` event.
 *
 * `aria-pressed` carries the state and an `sr-only` span names it — the camel fill
 * is never doing that job alone. `title` is the product name, so the control's
 * accessible name says what it saves.
 *
 * The cells below render the resting state: whether a given handle reads as saved
 * depends on the browser's own storage, so a still card cannot show both at once.
 */

/** On its own, at the size the product page draws it. */
export const Default = () => (
  <SaveButton handle="moa-pants" title="Moa Pants" className="size-11" />
);

/** As it sits on a catalogue card — a cream chip over the crop. */
export const OnCard = () => (
  <div className="relative h-40 w-40 overflow-hidden rounded-xs bg-surface-muted">
    <div className="absolute bottom-3 right-3">
      <SaveButton
        handle="milly-stripe-pants"
        title="Milly Stripe Pants"
        className="wl-tap size-9.5 rounded-xs bg-canvas/95 hover:bg-canvas"
      />
    </div>
  </div>
);

/** One per piece — each button tracks its own handle. */
export const PerProduct = () => (
  <div className="flex gap-3">
    <SaveButton handle="basic-linen-cullote" title="Basic Linen Culotte" className="size-11" />
    <SaveButton handle="cerra-loose-pants" title="Cerra Loose Pants" className="size-11" />
    <SaveButton handle="taka-flare-pants" title="Taka Flare Pants" className="size-11" />
  </div>
);
