import { COLOURWAYS, TAGS } from "./vocabulary";
import type { Money, Product } from "./types";

/**
 * Catalogue filtering, sorting, facets and paging.
 *
 * Kept inside `lib/shopify/` on purpose: with fixtures this runs in memory, and once
 * the store is live the same functions become Storefront API query arguments. Either
 * way `/shop` passes a query in and gets a page of products back, so the page never
 * changes.
 *
 * The query is the URL. `catalogueHref` builds the link for one facet flipped and
 * every other facet preserved, which is what lets the whole filter rail be links
 * rather than a form — no JavaScript, no client state, and the back button undoes
 * exactly one choice.
 */

export { COLOURWAYS, TAGS };

export const SORT_KEYS = ["relevant", "newest", "price-asc", "price-desc"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

/** Chrome, taken from the approved screens' sort control. */
export const SORT_LABELS: Record<SortKey, string> = {
  relevant: "Most relevant",
  newest: "Newest",
  "price-asc": "Price · low to high",
  "price-desc": "Price · high to low",
};

/** URL search-param names, shared by the pages, the filters and the content module. */
export const QUERY_KEYS = {
  category: "category",
  size: "size",
  colour: "colour",
  madeToOrder: "made-to-order",
  stock: "stock",
  sort: "sort",
  page: "page",
} as const;

export interface CatalogueQuery {
  /** One category at a time — it is Shopify's `productType`, not a tag. */
  category: string | null;
  sizes: string[];
  colours: string[];
  madeToOrder: boolean;
  inStockOnly: boolean;
  sort: SortKey;
  page: number;
}

/** How many pieces one page of the 3-up grid holds. */
export const PER_PAGE = 9;

type RawSearchParams = Record<string, string | string[] | undefined>;

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

function one(value: string | string[] | undefined): string | null {
  const [first] = list(value);
  return first ?? null;
}

function isSortKey(value: unknown): value is SortKey {
  return SORT_KEYS.includes(value as SortKey);
}

/** Reads a URL query into a typed catalogue query, ignoring anything unknown. */
export function parseCatalogueQuery(searchParams: RawSearchParams): CatalogueQuery {
  const sort = one(searchParams[QUERY_KEYS.sort]);
  const page = Number(one(searchParams[QUERY_KEYS.page]) ?? 1);

  return {
    category: one(searchParams[QUERY_KEYS.category]),
    sizes: list(searchParams[QUERY_KEYS.size]),
    colours: list(searchParams[QUERY_KEYS.colour]),
    madeToOrder: one(searchParams[QUERY_KEYS.madeToOrder]) === "1",
    inStockOnly: one(searchParams[QUERY_KEYS.stock]) === "in",
    sort: isSortKey(sort) ? sort : "relevant",
    page: Number.isFinite(page) && page >= 1 ? Math.trunc(page) : 1,
  };
}

/**
 * The same query with one or more facets changed, as a `/shop` href.
 *
 * Changing any facet returns to page one — staying on page three of a result set
 * that just got smaller is how you land on an empty grid. Pass `page` explicitly to
 * page within an unchanged query.
 */
export function catalogueHref(query: CatalogueQuery, patch: Partial<CatalogueQuery> = {}): string {
  const next: CatalogueQuery = { ...query, ...patch };
  const params = new URLSearchParams();

  if (next.category) params.set(QUERY_KEYS.category, next.category);
  for (const size of next.sizes) params.append(QUERY_KEYS.size, size);
  for (const colour of next.colours) params.append(QUERY_KEYS.colour, colour);
  if (next.madeToOrder) params.set(QUERY_KEYS.madeToOrder, "1");
  if (next.inStockOnly) params.set(QUERY_KEYS.stock, "in");
  if (next.sort !== "relevant") params.set(QUERY_KEYS.sort, next.sort);

  const page = patch.page ?? 1;
  if (page > 1) params.set(QUERY_KEYS.page, String(page));

  const search = params.toString();
  return search ? `/shop?${search}` : "/shop";
}

/** Adds or removes one value from a multi-select facet. */
export function toggle(values: string[], value: string): string[] {
  return values.includes(value)
    ? values.filter((entry) => entry !== value)
    : [...values, value];
}

export function isFiltered(query: CatalogueQuery): boolean {
  return (
    query.category !== null ||
    query.sizes.length > 0 ||
    query.colours.length > 0 ||
    query.madeToOrder ||
    query.inStockOnly
  );
}

/** Option values still purchasable on a product, for one option name. */
function availableValues(product: Product, option: string): string[] {
  return (
    product.options
      .find((entry) => entry.name === option)
      ?.values.filter((value) => value.available)
      .map((value) => value.name) ?? []
  );
}

function priceOf(product: Product): number {
  return Number(product.priceRange.minVariantPrice.amount);
}

export function filterProducts(products: Product[], query: CatalogueQuery): Product[] {
  const filtered = products.filter((product) => {
    if (query.category && product.productType !== query.category) return false;
    if (query.madeToOrder && !product.tags.includes(TAGS.madeToOrder)) return false;
    if (query.inStockOnly && !product.availableForSale) return false;

    if (query.sizes.length > 0) {
      const sizes = availableValues(product, "Size");
      if (!query.sizes.some((size) => sizes.includes(size))) return false;
    }

    if (query.colours.length > 0) {
      const colours = availableValues(product, "Colourway");
      if (!query.colours.some((colour) => colours.includes(colour))) return false;
    }

    return true;
  });

  switch (query.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => priceOf(a) - priceOf(b));
    case "price-desc":
      return [...filtered].sort((a, b) => priceOf(b) - priceOf(a));
    case "newest":
      /* "Newest" is the catalogue's own new flag, not a date we do not have. */
      return [...filtered].sort(
        (a, b) => Number(b.tags.includes(TAGS.new)) - Number(a.tags.includes(TAGS.new)),
      );
    default:
      return filtered;
  }
}

/**
 * Facet values present in the catalogue, with counts — the approved screens put the
 * count beside each filter row. Counts come from the whole catalogue, never from the
 * filtered set: a count that changes as you narrow tells you nothing about what the
 * filter would do.
 */
export function catalogueFacets(products: Product[]) {
  const categories = new Map<string, number>();
  const sizes: string[] = [];
  const colours: string[] = [];
  let madeToOrderCount = 0;

  for (const product of products) {
    if (product.productType) {
      categories.set(product.productType, (categories.get(product.productType) ?? 0) + 1);
    }
    if (product.tags.includes(TAGS.madeToOrder)) madeToOrderCount += 1;

    for (const option of product.options) {
      const into = option.name === "Size" ? sizes : option.name === "Colourway" ? colours : null;
      if (!into) continue;
      for (const value of option.values) {
        if (!into.includes(value.name)) into.push(value.name);
      }
    }
  }

  return {
    total: products.length,
    /* Alphabetical, because "Culottes" before "Wide leg" is the only order the
       catalogue itself justifies. Sizes keep catalogue order: XS–XL is a sequence. */
    categories: [...categories.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    madeToOrderCount,
    sizes,
    colours: colours.map((name) => ({
      name,
      swatch: COLOURWAYS.find((colour) => colour.name === name)?.swatch ?? "transparent",
    })),
  };
}

export type CatalogueFacets = ReturnType<typeof catalogueFacets>;

/** One page of results, clamped so an out-of-range `?page=` cannot render empty. */
export function paginate<T>(items: T[], page: number, perPage = PER_PAGE) {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * perPage;

  return { items: items.slice(start, start + perPage), page: current, pageCount };
}

/** The markdown between two real prices. Null unless there is one. */
export function discountPercent(price: Money | null, compareAt: Money | null): number | null {
  if (!price || !compareAt) return null;

  const now = Number(price.amount);
  const was = Number(compareAt.amount);
  if (!Number.isFinite(now) || !Number.isFinite(was) || was <= now) return null;

  return Math.round((1 - now / was) * 100);
}
