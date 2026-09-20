import { ProductTabs } from "wear-label";
import { product, ui } from "@/lib/content/site";

/**
 * The product page's Details / Fabric & care / Shipping tabs.
 *
 * **Real ARIA tabs, which means the keyboard contract is real too**: arrow keys
 * move between tabs, Home and End jump to the ends, and the strip is a single tab
 * stop with Tab moving on to the panel. A row of buttons that only answers clicks
 * looks like this and is not this.
 *
 * Each tab takes a `placeholder` alongside its `body`: a panel whose copy has not
 * been written renders the labelled placeholder at body size, so the block keeps
 * its height either way. That is the storefront's current state for two of the
 * three panels — per-product Details and Fabric & care copy has not been written,
 * and the design's one generic paragraph would state a wrong inseam and a wrong
 * fabric on most of the eleven pieces.
 *
 * Shipping is store-wide policy, so it is content rather than product data and is
 * filled in.
 */

/** The real product page: shipping written, the two per-product panels awaiting copy. */
export const Default = () => (
  <ProductTabs
    tabs={[
      { id: "details", label: ui.details, body: "", placeholder: "product details" },
      { id: "care", label: ui.fabricAndCare, body: "", placeholder: "fabric & care" },
      { id: "shipping", label: ui.shipping, body: product.shipping, placeholder: "shipping" },
    ]}
  />
);

/** Once the per-product copy exists, the same block with every panel written. */
export const Written = () => (
  <ProductTabs
    tabs={[
      {
        id: "details",
        label: ui.details,
        body: "A high-waisted wide leg cut in cotton twill, with a side zip, two deep front pockets and a stepped hem that falls just past the ankle.",
        placeholder: "product details",
      },
      {
        id: "care",
        label: ui.fabricAndCare,
        body: "Cotton twill. Machine wash cold on a gentle cycle, line dry in shade, warm iron on the reverse. Wash with like colours for the first two washes.",
        placeholder: "fabric & care",
      },
      { id: "shipping", label: ui.shipping, body: product.shipping, placeholder: "shipping" },
    ]}
  />
);

/** Two tabs. The strip is built from the array, so the count is a content decision. */
export const TwoTabs = () => (
  <ProductTabs
    tabs={[
      { id: "details", label: ui.details, body: "", placeholder: "product details" },
      { id: "shipping", label: ui.shipping, body: product.shipping, placeholder: "shipping" },
    ]}
  />
);
