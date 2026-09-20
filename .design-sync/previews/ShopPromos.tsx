import { ShopPromos } from "wear-label";
import { shop } from "@/lib/content/site";
import { products } from "@/lib/shopify/fixtures";

/**
 * The two bands under the catalogue banner: a photograph with a label plate, and a
 * copy block with the garment filling its right edge.
 *
 * **Both are single links** — the whole band is the target, not just the words on
 * it. The two positions are styled differently on purpose: the first is a plate
 * over a full-bleed crop, the second a copy block on the muted surface with the
 * garment at its edge, so the pair reads as a composition rather than two of the
 * same tile.
 *
 * `promos` is positional — index 0 gets the plate treatment, index 1 the copy
 * block. An empty array renders nothing.
 *
 * A band whose `eyebrow` or `cta` is empty simply renders without it; the layout
 * is the same either way, which is why the storefront's first band (heading only)
 * sits happily beside its second (eyebrow, heading and CTA).
 */

/** The storefront's own pair — the first band has heading only, the second is full. */
export const Default = () => (
  <ShopPromos
    promos={shop.promos}
    images={[
      products.find((p) => p.handle === "lilo-pants")!.featuredImage,
      products.find((p) => p.handle === "basic-pants")!.featuredImage,
    ]}
  />
);

/** One band. The grid gives it the full width rather than leaving a gap. */
export const Single = () => (
  <ShopPromos
    promos={shop.promos.slice(0, 1)}
    images={[products.find((p) => p.handle === "lilo-pants")!.featuredImage]}
  />
);

/** Without photography, each band falls back to the labelled placeholder. */
export const AwaitingPhotography = () => (
  <ShopPromos promos={shop.promos} images={[]} />
);
