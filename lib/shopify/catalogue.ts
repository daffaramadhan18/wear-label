import type { Product } from "./types";

/**
 * Catalogue filtering, sorting and facets.
 *
 * Kept inside `lib/shopify/` on purpose: with fixtures this runs in memory, and
 * once the store is live the same functions become Storefront API query
 * arguments. Either way `/shop` passes a query in and gets products back, so the
 * page never changes.
 */

export const SORT_KEYS = ["featured", "price-asc", "price-desc"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

/** Labels are interface chrome, not brand copy, so they are spelled out. */
export const SORT_LABELS: Record<SortKey, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export interface CatalogueQuery {
  categories: string[];
  sizes: string[];
  inStockOnly: boolean;
  sort: SortKey;
}

/** URL search-param names, shared by the page and the filter form. */
export const QUERY_KEYS = {
  category: "category",
  size: "size",
  stock: "stock",
  sort: "sort",
} as const;

type RawSearchParams = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

function isSortKey(value: unknown): value is SortKey {
  return SORT_KEYS.includes(value as SortKey);
}

/** Reads a URL query into a typed catalogue query, ignoring anything unknown. */
export function parseCatalogueQuery(searchParams: RawSearchParams): CatalogueQuery {
  const sort = searchParams[QUERY_KEYS.sort];

  return {
    categories: list(searchParams[QUERY_KEYS.category]),
    sizes: list(searchParams[QUERY_KEYS.size]),
    inStockOnly: searchParams[QUERY_KEYS.stock] === "in",
    sort: isSortKey(sort) ? sort : "featured",
  };
}

/** True when the query would narrow the catalogue at all. */
export function isFiltered(query: CatalogueQuery): boolean {
  return (
    query.categories.length > 0 ||
    query.sizes.length > 0 ||
    query.inStockOnly ||
    query.sort !== "featured"
  );
}

function availableSizes(product: Product): string[] {
  return (
    product.options
      .find((option) => option.name === "Size")
      ?.values.filter((value) => value.available)
      .map((value) => value.name) ?? []
  );
}

/** Null prices (no catalogue data yet) sort last in both directions. */
function priceOf(product: Product): number {
  const amount = product.priceRange.minVariantPrice?.amount;
  const value = amount ? Number(amount) : Number.NaN;
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

export function filterProducts(products: Product[], query: CatalogueQuery): Product[] {
  const filtered = products.filter((product) => {
    if (query.inStockOnly && !product.availableForSale) return false;

    if (query.categories.length > 0 && !query.categories.includes(product.productType)) {
      return false;
    }

    if (query.sizes.length > 0) {
      const sizes = availableSizes(product);
      if (!query.sizes.some((size) => sizes.includes(size))) return false;
    }

    return true;
  });

  if (query.sort === "featured") return filtered;

  const direction = query.sort === "price-asc" ? 1 : -1;
  return filtered.sort((a, b) => (priceOf(a) - priceOf(b)) * direction);
}

/** Facet values present in the catalogue, in catalogue order. */
export function catalogueFacets(products: Product[]) {
  const categories = new Set<string>();
  const sizes = new Set<string>();

  for (const product of products) {
    if (product.productType) categories.add(product.productType);
    for (const option of product.options) {
      if (option.name !== "Size") continue;
      for (const value of option.values) sizes.add(value.name);
    }
  }

  return { categories: [...categories], sizes: [...sizes] };
}
