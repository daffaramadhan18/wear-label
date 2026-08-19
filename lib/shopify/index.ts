/**
 * The only module the app imports Shopify data from.
 *
 * Components never call the Storefront API and never import GraphQL documents —
 * they call these functions. Today they resolve from typed fixtures; when real
 * credentials exist, only this file gains a GraphQL client. Every function is
 * async so that swap needs no call-site changes.
 *
 * Going live is an environment change:
 *   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...   (public Headless-channel token)
 */

import { products as productFixtures } from "./fixtures";
import type { Product } from "./types";

export type { Image, Money, Product, ProductOption, ProductVariant } from "./types";
export { formatMoney } from "./money";
export {
  catalogueFacets,
  filterProducts,
  isFiltered,
  parseCatalogueQuery,
  QUERY_KEYS,
  SORT_KEYS,
  SORT_LABELS,
  type CatalogueQuery,
  type SortKey,
} from "./catalogue";

function isLive(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

/**
 * Guard for the not-yet-written live path. It fails loudly rather than quietly
 * serving mock data from a deployment that was configured to be real.
 */
function notImplemented(operation: string): never {
  throw new Error(
    `[lib/shopify] Shopify credentials are set, but the live Storefront client is not implemented yet (${operation}). ` +
      `Implement the GraphQL client in lib/shopify/ or unset SHOPIFY_STORE_DOMAIN to fall back to fixtures.`,
  );
}

export async function getAllProducts(): Promise<Product[]> {
  if (isLive()) notImplemented("getAllProducts");
  return productFixtures;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (isLive()) notImplemented("getFeaturedProducts");
  return productFixtures.slice(0, limit);
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (isLive()) notImplemented("getProductByHandle");
  return productFixtures.find((product) => product.handle === handle) ?? null;
}
