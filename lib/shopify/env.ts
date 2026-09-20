/**
 * Whether a real Shopify store is configured, and the guard for the paths that
 * are not written yet. Shared by the catalogue reads and the cart, so both agree
 * on what "live" means.
 *
 * Going live is an environment change:
 *   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN=...   (public Headless-channel token)
 */

export function isLive(): boolean {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

/**
 * Fails loudly rather than quietly serving mock data from a deployment that was
 * configured to be real.
 */
export function notImplemented(operation: string): never {
  throw new Error(
    `[lib/shopify] Shopify credentials are set, but the live Storefront client is not implemented yet (${operation}). ` +
      `Implement the GraphQL client in lib/shopify/ or unset SHOPIFY_STORE_DOMAIN to fall back to fixtures.`,
  );
}
