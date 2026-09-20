import { CatalogueFilters } from "wear-label";

/**
 * The catalogue's filter rail: 11px camel field labels at 0.18em, cream-filled
 * controls with a sand rule, and pill chips — which this system reserves for
 * badges and chips exactly like these.
 *
 * Every control is a LINK, not a form field: each one is the current URL with a
 * single facet flipped. Filtering therefore needs no client JavaScript and no
 * submit step, the URL is shareable, and the back button undoes exactly one
 * choice. When Shopify goes live the same query becomes Storefront API arguments
 * with no change to this UI.
 *
 * A link cannot be `aria-pressed`, so an applied filter carries `aria-current`
 * and never leans on its fill alone. Colourways carry their name as well as
 * their swatch, for the same reason.
 */

const facets = {
  categories: [
    { name: "Culottes", count: 2 },
    { name: "Wide leg", count: 5 },
    { name: "Straight cut", count: 4 },
  ],
  sizes: ["XS", "S", "M", "L", "XL"],
  colours: [
    { name: "Cream", swatch: "var(--wl-rule-card)" },
    { name: "Camel", swatch: "var(--wl-taupe-300)" },
    { name: "Taupe", swatch: "var(--wl-taupe-600)" },
    { name: "Sage", swatch: "var(--wl-sage-300)" },
    { name: "Espresso", swatch: "var(--wl-taupe-900)" },
  ],
  madeToOrderCount: 4,
  total: 11,
};

/** Nothing applied: "All pieces" is current and no "Clear all" is offered. */
export const Unfiltered = () => (
  <div className="max-w-xs">
    <CatalogueFilters
      facets={facets}
      query={{
        category: null,
        sizes: [],
        colours: [],
        madeToOrder: false,
        inStockOnly: false,
        sort: "featured",
        page: 1,
      }}
    />
  </div>
);

/**
 * With filters applied: the category row and the chips pick up the brand fill,
 * the chosen colourway takes the focus ring, and "Clear all" appears.
 */
export const Filtered = () => (
  <div className="max-w-xs">
    <CatalogueFilters
      facets={facets}
      query={{
        category: "Wide leg",
        sizes: ["M", "L"],
        colours: ["Camel"],
        madeToOrder: false,
        inStockOnly: true,
        sort: "price-asc",
        page: 1,
      }}
    />
  </div>
);
