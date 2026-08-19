import { ProductCard } from "wear-label";

/**
 * The catalogue card: a 3:4 image block, then the name in Playfair, the material
 * line in camel, then the price.
 *
 * The whole card is one link — the name's anchor is stretched over the media — so
 * a grid gives one tab stop per product and never nests interactive elements.
 * The design system's card carries an add-to-bag button; there is no cart in this
 * build, so the card links to the product page instead. Sold-out state is stated
 * in words ("Sold out"), never by colour alone.
 *
 * Set `headingLevel` to whatever keeps the page's heading order intact — "h3"
 * under a section heading (the default), "h2" when the card is the top level.
 * `sizes` is the responsive sizes string the grid actually uses.
 *
 * The literal below is the full Product shape the card reads.
 */

const SIZES = ["XS", "S", "M", "L", "XL"];

const product = (over: Record<string, unknown> = {}) => ({
  id: "gid://shopify/Product/1",
  handle: "product-1",
  title: "",
  material: "",
  description: "",
  productType: "Category 1",
  featuredImage: { url: null, altText: "", width: 1200, height: 1500 },
  priceRange: { minVariantPrice: null },
  options: [{ name: "Size", values: SIZES.map((name) => ({ name, available: true })) }],
  variants: SIZES.map((size) => ({
    id: `gid://shopify/ProductVariant/product-1-${size.toLowerCase()}`,
    title: size,
    availableForSale: true,
    price: null,
  })),
  availableForSale: true,
  ...over,
});

/** The current catalogue state: no photography, no copy, no pricing yet. */
export const Placeholder = () => (
  <div className="w-60">
    <ProductCard product={product() as never} sizes="25vw" />
  </div>
);

/** The same card once copy, pricing and a category exist. */
export const Populated = () => (
  <div className="w-60">
    <ProductCard
      product={
        product({
          title: "Linen shirt",
          material: "Handwoven linen",
          priceRange: { minVariantPrice: { amount: "1250000", currencyCode: "IDR" } },
        }) as never
      }
      sizes="25vw"
    />
  </div>
);

/** Sold out — the badge states it in words. */
export const SoldOut = () => (
  <div className="w-60">
    <ProductCard
      product={
        product({
          title: "Linen shirt",
          material: "Handwoven linen",
          availableForSale: false,
          priceRange: { minVariantPrice: { amount: "1250000", currencyCode: "IDR" } },
        }) as never
      }
      sizes="25vw"
    />
  </div>
);

/** How they sit in the catalogue grid — the layout the card is designed for. */
export const Grid = () => (
  <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
    {[1, 2, 3].map((n) => (
      <ProductCard
        key={n}
        product={product({ id: `p${n}`, handle: `product-${n}` }) as never}
        sizes="(min-width: 1024px) 25vw, 50vw"
      />
    ))}
  </div>
);
