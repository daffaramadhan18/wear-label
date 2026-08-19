import type { Product } from "./types";

/**
 * Typed mock catalogue standing in for the Shopify Storefront API.
 *
 * Everything a copywriter or merchandiser owns is EMPTY: titles, descriptions,
 * prices and image alt text. Components render labelled placeholders in their
 * place, so the catalogue layout is final before any real product exists.
 *
 * Two fields do carry values, because the filter UI is unusable without them and
 * neither is brand copy:
 *
 *   - `productType` — numbered stand-ins ("Category 1"...). Replace with the real
 *     Shopify product types.
 *   - `Size` option values — XS–XL is universal apparel sizing.
 *
 * Going live: this file is deleted and `index.ts` gains a GraphQL client. Nothing
 * outside `lib/shopify/` changes.
 */

const PORTRAIT = { width: 1200, height: 1500 } as const;

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

/** Placeholder category facet values — replace with Shopify product types. */
const CATEGORIES = ["Category 1", "Category 2", "Category 3"] as const;

function product(index: number, soldOut: readonly string[] = []): Product {
  const handle = `product-${index}`;

  return {
    id: `gid://shopify/Product/${index}`,
    handle,
    title: "",
    material: "",
    description: "",
    productType: CATEGORIES[(index - 1) % CATEGORIES.length],
    featuredImage: { url: null, altText: "", ...PORTRAIT },
    priceRange: { minVariantPrice: null },
    options: [
      {
        name: "Size",
        values: SIZES.map((name) => ({ name, available: !soldOut.includes(name) })),
      },
    ],
    variants: SIZES.map((size) => ({
      id: `gid://shopify/ProductVariant/${handle}-${size.toLowerCase()}`,
      title: size,
      availableForSale: !soldOut.includes(size),
      price: null,
    })),
    availableForSale: soldOut.length < SIZES.length,
  };
}

export const products: Product[] = [
  product(1),
  product(2, ["XS"]),
  product(3),
  product(4, SIZES),
  product(5, ["L", "XL"]),
  product(6),
  product(7, ["S"]),
  product(8),
];
