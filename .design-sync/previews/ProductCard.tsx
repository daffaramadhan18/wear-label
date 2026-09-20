import { ProductCard } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The catalogue card: a square crop of the garment, the flag badge at the top
 * left, save and choose-size at the bottom right, then the material line in
 * camel, the name in Playfair and the price.
 *
 * The whole card is one stretched link — the name's anchor covers the media — so
 * a grid gives one tab stop per product and never nests interactive elements. The
 * two corner actions sit above that overlay and are their own stops.
 *
 * The bag mark goes to the product page, not straight into the bag: every piece
 * has five sizes and five colourways, so a one-click add would have to guess a
 * variant.
 *
 * Only one flag shows at a time and a markdown outranks New — see `MarkedDown`,
 * which is both in the catalogue and renders −20%. Sold out is stated in words,
 * never by colour alone.
 *
 * `headingLevel` keeps the page's heading order intact: "h3" under a section
 * heading (the default), "h2" when the card is the top level. `sizes` is the
 * responsive sizes string the grid actually uses.
 *
 * These are the real eleven pieces from the catalogue, with their own
 * photography — never a stand-in, so what the card shows here is what it shows
 * on /shop.
 */
const byHandle = (handle: string) => products.find((p) => p.handle === handle)!;

/** A piece at its list price — no flag, no was-price. */
export const Default = () => (
  <div className="w-60">
    <ProductCard product={byHandle("basic-linen-cullote")} sizes="25vw" />
  </div>
);

/** Marked down. The −20% flag replaces New, and the was-price is struck through. */
export const MarkedDown = () => (
  <div className="w-60">
    <ProductCard product={byHandle("milly-stripe-pants")} sizes="25vw" />
  </div>
);

/** Out of stock. The badge says so in words, under the price. */
export const SoldOut = () => (
  <div className="w-60">
    <ProductCard
      product={{ ...byHandle("taka-flare-pants"), availableForSale: false }}
      sizes="25vw"
    />
  </div>
);

/**
 * How they sit on /shop — the three-up grid the card is designed for. Held at
 * three columns rather than the page's responsive `grid-cols-2 lg:grid-cols-3`,
 * because the card is what this cell is showing: at the card's width the
 * responsive rule would wrap to a second row and crop the third piece.
 */
export const Grid = () => (
  <div className="grid grid-cols-3 gap-x-6 gap-y-10">
    {products.slice(0, 3).map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        sizes="(min-width: 1024px) 25vw, 50vw"
      />
    ))}
  </div>
);
