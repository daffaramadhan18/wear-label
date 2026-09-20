import { PageHeading } from "wear-label";
import { shop, cart } from "@/lib/content/site";

/**
 * The `h1` block at the top of a page: heading at the H1 step in Playfair, with an
 * intro paragraph below at the body step, constrained to the readable measure
 * (`--measure`, 64ch).
 *
 * Both strings resolve through `Copy`, so an empty value renders a correctly-sized
 * placeholder instead of collapsing — which is why the layout is already final on
 * the pages whose copy has not been written.
 *
 * `id` is required: the page's `Section` points `labelledBy` at it, and that is
 * what gives the region its accessible name.
 */

/** The catalogue's own heading. Its intro paragraph is not written yet. */
export const Catalogue = () => (
  <PageHeading id="preview-page-shop" heading={shop.heading} body={shop.body} />
);

/** The bag, where the heading stands alone by design. */
export const Bag = () => (
  <PageHeading id="preview-page-cart" heading={cart.heading} body="" />
);

/** With both written — what an About or Journal page will look like. */
export const WithBody = () => (
  <PageHeading
    id="preview-page-body"
    heading="Cut to your measurements"
    body="Send us your measurements and choose a colourway. The studio cuts a single piece for you and ships it within ten working days."
  />
);

/** Neither written — the placeholder pair, at heading and body size. */
export const Placeholder = () => (
  <PageHeading id="preview-page-empty" heading="" body="" />
);
