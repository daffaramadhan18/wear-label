/**
 * Shopify Storefront API domain types.
 *
 * These mirror the shapes the Storefront API returns (`Money` with a string
 * `amount` + `currencyCode`, `priceRange.minVariantPrice`, `handle` instead of
 * slug, `productType`, `tags`, variants carrying `selectedOptions`) so that
 * swapping fixtures for live GraphQL is a change inside `lib/shopify/` and nothing
 * else.
 *
 * One deliberate local deviation: `Image.url` is nullable. The catalogue's garment
 * shots are real, but the hero, the shop banner and the editorial slots still have
 * no photography — a null url renders a labelled placeholder at the exact ratio the
 * real photo will have, so there is no layout shift when those land.
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
  /** Set on colourway values only: the hex the swatch paints. */
  swatch?: string;
}

export interface ProductOption {
  name: string;
  values: ProductOptionValue[];
}

/** One variant's position in the option matrix, e.g. Size M / Colourway Camel. */
export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: SelectedOption[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  /** The material line above the name on a card, e.g. "Handwoven linen". */
  material: string;
  /** Details copy. Blank — per-product descriptions are not written yet. */
  description: string;
  /** Fabric & care copy. Blank for the same reason. */
  care: string;
  /** Category facet — Shopify's `productType`. */
  productType: string;
  /** Catalogue flags. See `TAGS` in ./catalogue for the ones the UI reads. */
  tags: string[];
  featuredImage: Image;
  /** Gallery. One real shot per piece today, so this holds a single image. */
  images: Image[];
  priceRange: { minVariantPrice: Money };
  /** Was-price. Non-null only where the catalogue actually discounts. */
  compareAtPrice: Money | null;
  options: ProductOption[];
  variants: ProductVariant[];
  availableForSale: boolean;
}
