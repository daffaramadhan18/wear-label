import { ResultsToolbar } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The row above the catalogue grid: how many pieces are showing and what is
 * narrowing them, then the sort control.
 *
 * **Sort is the one facet that stays a form** rather than becoming a set of links —
 * a `<select>` is the right control for four mutually exclusive orderings, and the
 * design draws it that way. It is a plain `GET`, so it needs no JavaScript: the
 * hidden fields carry the active filters through, and `page` is deliberately not
 * among them, because a re-sorted catalogue starts again at page one.
 *
 * `filterLabel` is what is currently narrowing the catalogue, already in words —
 * the page composes that string, so the toolbar never has to know how a facet is
 * phrased.
 */
const query = {
  category: null,
  sizes: [],
  colours: [],
  madeToOrder: false,
  inStockOnly: false,
  sort: "featured" as const,
  page: 1,
};

/** The unfiltered catalogue — all eleven pieces, default order. */
export const Default = () => (
  <ResultsToolbar query={query} count={products.length} filterLabel="Everything" />
);

/** With a category applied: the count drops and the label says what is on. */
export const Filtered = () => (
  <ResultsToolbar
    query={{ ...query, category: "Culottes", sort: "price-asc" }}
    count={2}
    filterLabel="Culottes"
  />
);

/**
 * Several facets at once. The hidden fields carry every one of them through the
 * sort submission, so re-sorting never silently drops a filter.
 */
export const ManyFacets = () => (
  <ResultsToolbar
    query={{
      ...query,
      category: "Wide leg",
      sizes: ["M", "L"],
      colours: ["Camel"],
      inStockOnly: true,
      sort: "price-desc",
    }}
    count={8}
    filterLabel="Wide leg · M, L · Camel · In stock only"
  />
);
