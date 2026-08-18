/**
 * Shopify Storefront API domain types.
 *
 * These deliberately mirror the shapes the Storefront API returns (Money with a
 * string `amount` + `currencyCode`, `priceRange.minVariantPrice`, `handle`
 * instead of slug, ...) so that swapping fixtures for live GraphQL is a change
 * inside `lib/shopify/` and nothing else.
 *
 * One local deviation: `Image.url` is nullable, because the storefront is being
 * built before real photography exists. A null url renders a token-styled
 * placeholder of the correct aspect ratio (no layout shift). Once photos land in
 * `public/`, set the url in `fixtures.ts` — no component changes.
 */

export type CurrencyCode = "IDR" | "USD";

export interface Money {
  amount: string;
  currencyCode: CurrencyCode;
}

export interface Image {
  url: string | null;
  altText: string;
  width: number;
  height: number;
}

export interface ProductOptionValue {
  name: string;
  available: boolean;
}

export interface ProductOption {
  name: string;
  values: ProductOptionValue[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  /** Short one-line descriptor shown on cards. */
  subtitle: string;
  description: string;
  featuredImage: Image;
  priceRange: { minVariantPrice: Money };
  compareAtPrice: Money | null;
  options: ProductOption[];
  variants: ProductVariant[];
  tags: string[];
  availableForSale: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: Image;
  productCount: number;
}
