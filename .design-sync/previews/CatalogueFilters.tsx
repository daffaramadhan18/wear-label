import { CatalogueFilters } from "wear-label";

/**
 * The catalogue's filter rail: 11px camel field labels at 0.18em, cream-filled
 * controls with a sand rule, and pill chips — which this system reserves for
 * badges and chips exactly like these.
 *
 * It is a plain `GET` form with native controls: no client JavaScript, and the
 * resulting URL is shareable and back-button friendly. Filter state lives in the
 * query string, which /shop reads on the server, so when Shopify goes live the
 * same query becomes Storefront API arguments with no change to this UI.
 *
 * The checkbox inside each chip stays visible rather than being swapped for a
 * styled span, so state is never carried by colour alone.
 */

const facets = {
  categories: ["Category 1", "Category 2", "Category 3"],
  sizes: ["XS", "S", "M", "L", "XL"],
};

/** Nothing applied — `filtered` false, so no "Clear all" is offered. */
export const Unfiltered = () => (
  <div className="max-w-xs">
    <CatalogueFilters
      facets={facets}
      query={{ categories: [], sizes: [], inStockOnly: false, sort: "featured" }}
      filtered={false}
    />
  </div>
);

/**
 * With filters applied: chips pick up the brand border and muted fill, and
 * `filtered` reveals the "Clear all" link beside Apply.
 */
export const Filtered = () => (
  <div className="max-w-xs">
    <CatalogueFilters
      facets={facets}
      query={{
        categories: ["Category 1"],
        sizes: ["M", "L"],
        inStockOnly: true,
        sort: "price-asc",
      }}
      filtered
    />
  </div>
);
