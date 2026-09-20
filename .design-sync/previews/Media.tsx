import { Media } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * Catalogue and editorial imagery, and the reason this storefront has no layout
 * shift waiting for photography.
 *
 * **`image.url` is nullable.** A null renders a tone-filled block with a small
 * uppercase caption at the exact aspect ratio the real photograph will occupy — so
 * dropping a file into `public/` and setting the url causes no reflow at all (CLS
 * stays 0). That is a real, shipped state, not a placeholder for the preview's
 * benefit: the shop banner is still in it.
 *
 * `sizes` is required, because a real image renders through `next/image` with
 * `fill` — pass the responsive sizes string the layout actually uses. `ratio`
 * overrides the image's own dimensions when the slot crops (the catalogue card
 * asks for `1 / 1`); `fill` makes it fill a positioned ancestor instead.
 */
const PORTRAIT = { url: null, altText: "", width: 1200, height: 1500 };

/** A real catalogue photograph at the card's square crop. */
export const Photograph = () => (
  <div className="w-56">
    <Media
      image={products[0].featuredImage}
      sizes="(min-width: 1024px) 25vw, 50vw"
      ratio="1 / 1"
    />
  </div>
);

/** The two states side by side — same slot, same size, photograph or not. */
export const BothStates = () => (
  <div className="flex gap-5">
    <div className="w-40">
      <Media image={products[3].featuredImage} sizes="25vw" ratio="1 / 1" />
    </div>
    <div className="w-40">
      <Media
        image={{ ...PORTRAIT, width: 1024, height: 1024 }}
        sizes="25vw"
        ratio="1 / 1"
        label="Product photo"
      />
    </div>
  </div>
);

/** `label` names the slot, so the block says which photograph belongs there. */
export const Labelled = () => (
  <div className="flex gap-5">
    <div className="w-40">
      <Media image={PORTRAIT} sizes="25vw" label="Product photo" />
    </div>
    <div className="w-40">
      <Media image={PORTRAIT} sizes="25vw" label="Detail" />
    </div>
  </div>
);

/** A landscape editorial slot — the ratio comes from the image's own dimensions. */
export const Landscape = () => (
  <div className="w-full max-w-xl">
    <Media
      image={{ url: null, altText: "", width: 1600, height: 900 }}
      sizes="100vw"
      label="Shop banner"
    />
  </div>
);
