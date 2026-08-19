import { PageHeading } from "wear-label";

/**
 * The `h1` block at the top of a page: heading at the H1 step in Playfair, with an
 * intro paragraph below at the body step, constrained to the readable measure
 * (`--measure`, 64ch).
 *
 * Both strings resolve through Copy, so an empty value renders a correctly-sized
 * placeholder instead of collapsing. `id` is required — the page's Section points
 * `labelledBy` at it, which is what gives the region its accessible name.
 */

/** With copy written. */
export const WithCopy = () => (
  <PageHeading
    id="preview-page-heading"
    heading="Shop all"
    body="The full catalogue. Filter by category, size and availability, or sort by price."
  />
);

/** The current state of the site — copy is deliberately unwritten. */
export const Placeholder = () => (
  <PageHeading id="preview-page-heading-empty" heading="" body="" />
);
