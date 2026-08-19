/**
 * The only module the app imports Shopify catalogue data from.
 *
 * Components never call the Storefront API and never import GraphQL documents — they
 * call these functions. Today they resolve from typed fixtures; when real credentials
 * exist, only this file gains a GraphQL client. Every read is async so that swap needs
 * no call-site changes.
 *
 * The bag is NOT re-exported here as a value: `./cart` reads a cookie, so it is
 * server-only and is imported directly by the few server components that need it.
 * Routing it through this barrel would drag `next/headers` into any Client Component
 * that just wanted `formatMoney`. Its types are safe to re-export — a type import is
 * erased before it can reach the client.
 */

import { isLive, notImplemented } from "./env";
import { products as productFixtures } from "./fixtures";
import { TAGS } from "./vocabulary";
import type { Product } from "./types";

export type {
  CurrencyCode,
  Image,
  Money,
  Product,
  ProductOption,
  ProductOptionValue,
  ProductVariant,
  SelectedOption,
} from "./types";
export type { Cart, CartLine } from "./cart";
export type { FormNotice } from "./form-state";
export { formatMoney } from "./money";
export {
  catalogueFacets,
  catalogueHref,
  COLOURWAYS,
  discountPercent,
  filterProducts,
  isFiltered,
  paginate,
  parseCatalogueQuery,
  PER_PAGE,
  QUERY_KEYS,
  SORT_KEYS,
  SORT_LABELS,
  TAGS,
  toggle,
  type CatalogueFacets,
  type CatalogueQuery,
  type SortKey,
} from "./catalogue";

export async function getAllProducts(): Promise<Product[]> {
  if (isLive()) notImplemented("getAllProducts");
  return productFixtures;
}

/** New arrivals first, then the rest of the catalogue in its own order. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (isLive()) notImplemented("getFeaturedProducts");

  const flagged = productFixtures.filter((product) => product.tags.includes(TAGS.new));
  const rest = productFixtures.filter((product) => !product.tags.includes(TAGS.new));

  return [...flagged, ...rest].slice(0, limit);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isLive()) notImplemented("getProductByHandle");
  return productFixtures.find((product) => product.handle === handle) ?? null;
}

/**
 * Pieces to show under a product: same category first, then the rest of the
 * catalogue, never the piece itself.
 */
export async function getRelatedProducts(handle: string, limit = 4): Promise<Product[]> {
  if (isLive()) notImplemented("getRelatedProducts");

  const product = productFixtures.find((entry) => entry.handle === handle);
  if (!product) return productFixtures.slice(0, limit);

  const others = productFixtures.filter((entry) => entry.handle !== handle);
  const sameType = others.filter((entry) => entry.productType === product.productType);
  const rest = others.filter((entry) => entry.productType !== product.productType);

  return [...sameType, ...rest].slice(0, limit);
}
