import type { Collection, Image, Product } from "./types";

/**
 * Typed mock data standing in for the Shopify Storefront API.
 *
 * Prices are IDR in minor-unit-free string form, exactly as the Storefront API
 * returns them. Product copy is placeholder — replace with real catalogue copy
 * from Shopify admin, not here, once the store exists.
 *
 * Photography: every `url` is null, which renders a token-styled placeholder at
 * the right aspect ratio. To go live with imagery, drop the file into `public/`
 * and set the url. The commented path next to each one is the filename the
 * README's asset manifest expects.
 */

const PORTRAIT = { width: 1200, height: 1500 } as const;
const LANDSCAPE = { width: 1600, height: 1067 } as const;

function idr(amount: string) {
  return { amount, currencyCode: "IDR" } as const;
}

function image(altText: string, ratio: { width: number; height: number }): Image {
  return { url: null, altText, ...ratio };
}

const SIZES = ["XS", "S", "M", "L", "XL"];

function sizeOption(soldOut: string[] = []) {
  return {
    name: "Size",
    values: SIZES.map((name) => ({ name, available: !soldOut.includes(name) })),
  };
}

function variants(handle: string, price: string, soldOut: string[] = []) {
  return SIZES.map((size) => ({
    id: `gid://shopify/ProductVariant/${handle}-${size.toLowerCase()}`,
    title: size,
    availableForSale: !soldOut.includes(size),
    price: idr(price),
  }));
}

export const products: Product[] = [
  {
    id: "gid://shopify/Product/1",
    handle: "tenun-overshirt",
    title: "Tenun Overshirt",
    subtitle: "Handwoven cotton · natural indigo",
    description:
      "Cut from cotton woven on a hand loom in Central Java, then washed twice so it falls soft from the first wear. The weave is slightly uneven by nature — no two panels read exactly alike.",
    featuredImage: image(
      "Tenun overshirt in natural indigo, worn open over a cream tee",
      PORTRAIT,
    ), // → /products/tenun-overshirt.jpg
    priceRange: { minVariantPrice: idr("1450000") },
    compareAtPrice: null,
    options: [sizeOption(["XS"])],
    variants: variants("tenun-overshirt", "1450000", ["XS"]),
    tags: ["Handwoven", "Natural dye"],
    availableForSale: true,
  },
  {
    id: "gid://shopify/Product/2",
    handle: "kalim-linen-shirt",
    title: "Kalim Linen Shirt",
    subtitle: "European flax · relaxed fit",
    description:
      "A long-sleeve shirt in mid-weight flax linen with a low, soft collar. Breathes in humidity and creases the way linen should — we do not treat it to stop that.",
    featuredImage: image(
      "Kalim linen shirt in undyed flax, sleeves rolled",
      PORTRAIT,
    ), // → /products/kalim-linen-shirt.jpg
    priceRange: { minVariantPrice: idr("890000") },
    compareAtPrice: null,
    options: [sizeOption()],
    variants: variants("kalim-linen-shirt", "890000"),
    tags: ["Linen", "Year-round"],
    availableForSale: true,
  },
  {
    id: "gid://shopify/Product/3",
    handle: "sore-wide-trouser",
    title: "Sore Wide Trouser",
    subtitle: "Washed cotton twill · high rise",
    description:
      "A wide, straight-falling trouser in heavy cotton twill, garment-washed to take the stiffness out. Deep front pockets, single back patch pocket, no branding anywhere on it.",
    featuredImage: image(
      "Sore wide trouser in clay-washed cotton twill",
      PORTRAIT,
    ), // → /products/sore-wide-trouser.jpg
    priceRange: { minVariantPrice: idr("1150000") },
    compareAtPrice: idr("1350000"),
    options: [sizeOption(["XL"])],
    variants: variants("sore-wide-trouser", "1150000", ["XL"]),
    tags: ["Cotton twill"],
    availableForSale: true,
  },
  {
    id: "gid://shopify/Product/4",
    handle: "ombak-knit-tee",
    title: "Ombak Knit Tee",
    subtitle: "Long-staple cotton · loop-knit",
    description:
      "Loop-knit on vintage circular machines at low speed, which keeps the yarn under less tension and the fabric more stable after washing. Ribbed neck, straight body.",
    featuredImage: image("Ombak knit tee in soft ecru", PORTRAIT), // → /products/ombak-knit-tee.jpg
    priceRange: { minVariantPrice: idr("520000") },
    compareAtPrice: null,
    options: [sizeOption()],
    variants: variants("ombak-knit-tee", "520000"),
    tags: ["Everyday"],
    availableForSale: true,
  },
  {
    id: "gid://shopify/Product/5",
    handle: "rimba-field-jacket",
    title: "Rimba Field Jacket",
    subtitle: "Waxed cotton · deadstock lining",
    description:
      "An unlined-shoulder field jacket in lightly waxed cotton, lined at the body with deadstock shirting we bought as a single lot. When that lot is gone, this jacket changes.",
    featuredImage: image(
      "Rimba field jacket in olive waxed cotton",
      PORTRAIT,
    ), // → /products/rimba-field-jacket.jpg
    priceRange: { minVariantPrice: idr("2350000") },
    compareAtPrice: null,
    options: [sizeOption(["XS", "S"])],
    variants: variants("rimba-field-jacket", "2350000", ["XS", "S"]),
    tags: ["Limited lot", "Deadstock"],
    availableForSale: true,
  },
  {
    id: "gid://shopify/Product/6",
    handle: "pagi-cotton-dress",
    title: "Pagi Cotton Dress",
    subtitle: "Airy cotton voile · tie back",
    description:
      "A long dress in double-layered cotton voile with a tie at the back so it holds its shape without elastic. Opaque in daylight, which is the point of the second layer.",
    featuredImage: image("Pagi cotton dress in warm sand", PORTRAIT), // → /products/pagi-cotton-dress.jpg
    priceRange: { minVariantPrice: idr("1280000") },
    compareAtPrice: null,
    options: [sizeOption(["XS"])],
    variants: variants("pagi-cotton-dress", "1280000", ["XS"]),
    tags: ["Cotton voile"],
    availableForSale: true,
  },
];

export const collections: Collection[] = [
  {
    id: "gid://shopify/Collection/1",
    handle: "dry-season",
    title: "Dry Season",
    description:
      "Light weaves for the months when the rain holds off — linen, voile, open-knit cotton.",
    image: image("Dry season collection, linen pieces on a line", LANDSCAPE), // → /collections/dry-season.jpg
    productCount: 14,
  },
  {
    id: "gid://shopify/Collection/2",
    handle: "everyday-weave",
    title: "Everyday Weave",
    description:
      "The pieces we remake every year because they keep selling out. Cut once, refined slowly.",
    image: image("Everyday weave collection, folded cotton shirts", LANDSCAPE), // → /collections/everyday-weave.jpg
    productCount: 9,
  },
  {
    id: "gid://shopify/Collection/3",
    handle: "the-last-lot",
    title: "The Last Lot",
    description:
      "Made from deadstock and mill ends. Once a lot runs out, the piece does not come back.",
    image: image("The last lot collection, deadstock fabric rolls", LANDSCAPE), // → /collections/the-last-lot.jpg
    productCount: 6,
  },
];
