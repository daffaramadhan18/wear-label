/**
 * Shopify Storefront API domain types.
 *
 * These mirror the shapes the Storefront API returns (`Money` with a string
 * `amount` + `currencyCode`, `priceRange.minVariantPrice`, `handle` instead of
 * slug, `productType` for the category facet) so that swapping fixtures for live
 * GraphQL is a change inside `lib/shopify/` and nothing else.
 *
 * Two deliberate local deviations, both because the storefront is being built
 * before the catalogue exists:
 *
 *   1. `Image.url` is nullable — a null url renders a labelled placeholder at the
 *      right aspect ratio, so there is no layout shift once photos land.
 *   2. Prices are nullable — currency and pricing are not decided yet, and a
 *      nullable price renders a placeholder instead of inventing a number.
 *
 * Both narrow to non-null when real data arrives; components already handle the
 * non-null case.
 */

export type CurrencyCode = "IDR" | "USD";

export interface Money {
  amount: string;
  currencyCode: CurrencyCode;
}

export interface Image {
  url: string | null;
  /** Empty until real photography exists; the placeholder is labelled instead. */
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
  price: Money | null;
}

export interface Product {
  id: string;
  handle: string;
  /** Blank until catalogue copy exists. */
  title: string;
  description: string;
  /** Category facet — Shopify's `productType`. */
  productType: string;
  featuredImage: Image;
  priceRange: { minVariantPrice: Money | null };
  options: ProductOption[];
  variants: ProductVariant[];
  availableForSale: boolean;
}
