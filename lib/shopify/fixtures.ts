import { COLOURWAYS, TAGS } from "./vocabulary";
import type { Image, Money, Product, ProductVariant } from "./types";

/**
 * The Wear Label catalogue.
 *
 * Names, materials, prices, was-prices, the new flags and the photography all come
 * from the approved storefront screens in the Claude Design project
 * (bf11a0f4-4b1c-400b-802c-b9c9c2d66673, `Wear Label Storefront.dc.html` and its
 * `CATALOG` constant). The photographs were pulled from that project into
 * `public/products/`; every one is a 1024 square.
 *
 * Deliberately still blank or absent, because the catalogue does not state it:
 *
 *   - `description` and `care` — per-product copy nobody has written.
 *   - Stock. Every size and colourway reads as available rather than inventing
 *     sold-out runs. The UI's sold-out states are implemented and will light up the
 *     moment Shopify reports inventory.
 *   - The `Made to order` tag. The design shows the filter, but nothing in the
 *     catalogue says which pieces are cut to order, so no piece carries the tag and
 *     the facet reports zero rather than guessing.
 *
 * `productType` is derived from evidence, not guessed: the piece's own name where the
 * name states the cut (Culotte, Wide, Loose, Flare), and the garment shot where it
 * does not. That gives Wide leg 8, Culottes 2, Straight cut 1. The design's sidebar
 * mock counted 5 / 2 / 3 with a "Made to order" row, but those were placeholder
 * numbers in a static mock, not catalogue data. Replace all of this with Shopify
 * product types once the store exists.
 *
 * Going live: this file is deleted and `index.ts` gains a GraphQL client. Nothing
 * outside `lib/shopify/` changes.
 */

/** Every catalogue photograph is square. */
const PHOTO = { width: 1024, height: 1024 } as const;

const SIZES = ["XS", "S", "M", "L", "XL"] as const;

function idr(amount: number): Money {
  return { amount: String(amount), currencyCode: "IDR" };
}

interface Entry {
  handle: string;
  title: string;
  material: string;
  productType: string;
  price: number;
  was?: number;
  isNew?: boolean;
}

const CATALOGUE: Entry[] = [
  { handle: "basic-linen-cullote", title: "Basic Linen Culotte", material: "Handwoven linen", productType: "Culottes", price: 165000 },
  { handle: "cerra-loose-pants", title: "Cerra Loose Pants", material: "Cotton twill", productType: "Wide leg", price: 159000 },
  { handle: "dalia-wide-pants", title: "Dalia Wide Pants", material: "Tencel", productType: "Wide leg", price: 175000 },
  { handle: "milly-stripe-pants", title: "Milly Stripe Pants", material: "Linen blend", productType: "Wide leg", price: 159200, was: 199000, isNew: true },
  { handle: "basic-pants", title: "Basic Pants", material: "Cotton poplin", productType: "Straight cut", price: 165000 },
  { handle: "casual-culotte-zipper", title: "Casual Culotte Zipper", material: "Washed linen", productType: "Culottes", price: 165000 },
  { handle: "lilo-pants", title: "Lilo Pants", material: "Viscose blend", productType: "Wide leg", price: 159200, was: 199000, isNew: true },
  { handle: "moa-pants", title: "Moa Pants", material: "Cotton twill", productType: "Wide leg", price: 159200, was: 199000, isNew: true },
  { handle: "pallo-pants", title: "Pallo Pants", material: "Pinstripe linen", productType: "Wide leg", price: 159200, was: 199000 },
  { handle: "taka-flare-pants", title: "Taka Flare Pants", material: "Cupro", productType: "Wide leg", price: 199000 },
  { handle: "yora-loose-pants", title: "Yora Loose Pants", material: "Cotton twill", productType: "Wide leg", price: 165000 },
];

function photo(entry: Entry): Image {
  return {
    url: `/products/${entry.handle}.webp`,
    altText: `${entry.title} in ${entry.material.toLowerCase()}`,
    ...PHOTO,
  };
}

/**
 * Size × colourway, the matrix the design's product page selects from. Every
 * combination is available: inventory is Shopify's to report, and a fabricated
 * sold-out variant is exactly the kind of commerce data this repo does not invent.
 */
function variants(entry: Entry): ProductVariant[] {
  return SIZES.flatMap((size) =>
    COLOURWAYS.map((colour) => ({
      id: `gid://shopify/ProductVariant/${entry.handle}-${size.toLowerCase()}-${colour.name.toLowerCase()}`,
      title: `${size} / ${colour.name}`,
      availableForSale: true,
      price: idr(entry.price),
      selectedOptions: [
        { name: "Size", value: size },
        { name: "Colourway", value: colour.name },
      ],
    })),
  );
}

export const products: Product[] = CATALOGUE.map((entry, index) => ({
  id: `gid://shopify/Product/${index + 1}`,
  handle: entry.handle,
  title: entry.title,
  material: entry.material,
  description: "",
  care: "",
  productType: entry.productType,
  tags: entry.isNew ? [TAGS.new] : [],
  featuredImage: photo(entry),
  images: [photo(entry)],
  priceRange: { minVariantPrice: idr(entry.price) },
  compareAtPrice: entry.was ? idr(entry.was) : null,
  options: [
    { name: "Size", values: SIZES.map((name) => ({ name, available: true })) },
    {
      name: "Colourway",
      values: COLOURWAYS.map((colour) => ({
        name: colour.name,
        available: true,
        swatch: colour.swatch,
      })),
    },
  ],
  variants: variants(entry),
  availableForSale: true,
}));
