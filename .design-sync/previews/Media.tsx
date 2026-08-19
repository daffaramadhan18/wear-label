import { Media } from "wear-label";

/**
 * Catalogue and editorial imagery, and the reason this catalogue has no layout
 * shift waiting for photography.
 *
 * `image.url` is nullable. A null renders a tone-filled block with a small
 * uppercase caption, at the exact aspect ratio the real photograph will occupy —
 * so dropping files into public/ and setting the url causes no reflow at all
 * (CLS stays 0). Every product in the current fixtures is in this state.
 *
 * `sizes` is required because a real image renders through next/image with `fill`;
 * pass the responsive sizes string the layout actually uses.
 */

const PORTRAIT = { width: 1200, height: 1500 };

/** The placeholder — 3:4 portrait, which is the catalogue's card ratio. */
export const Placeholder = () => (
  <div className="w-56">
    <Media
      image={{ url: null, altText: "", ...PORTRAIT }}
      sizes="(min-width: 1024px) 25vw, 50vw"
    />
  </div>
);

/** `label` names the slot, so the block says what photo belongs there. */
export const Labelled = () => (
  <div className="flex gap-5">
    <div className="w-40">
      <Media
        image={{ url: null, altText: "", ...PORTRAIT }}
        sizes="25vw"
        label="Product photo"
      />
    </div>
    <div className="w-40">
      <Media
        image={{ url: null, altText: "", ...PORTRAIT }}
        sizes="25vw"
        label="Detail"
      />
    </div>
  </div>
);

/** A landscape editorial slot — the ratio comes from the image dimensions. */
export const Landscape = () => (
  <div className="w-full max-w-xl">
    <Media
      image={{ url: null, altText: "", width: 1600, height: 900 }}
      sizes="100vw"
      label="Editorial"
    />
  </div>
);
