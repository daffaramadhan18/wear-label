import { ProductGallery } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The product gallery — a column of thumbnails beside the main crop.
 *
 * Client-side only for the selection. Thumbnails are **buttons with
 * `aria-pressed`, not links**, because choosing an angle is not a navigation; and
 * the main image swaps rather than the page scrolling to it.
 *
 * The rail is a column beside the photograph from `lg` up and a scrolling row
 * beneath it below that — 92px of thumbnails alongside would leave the main crop
 * about 260px on a phone, and the main crop is the thing being bought.
 *
 * **A gallery with one entry hides the rail altogether** (see `SingleAngle`), which
 * is the storefront's current state: only the first angle of each piece has been
 * shot.
 *
 * `title` is used as the main image's alt text when the image carries none of its
 * own.
 */
const moa = products.find((p) => p.handle === "moa-pants")!;

/** Today's catalogue: one photograph per piece, so no rail. */
export const SingleAngle = () => (
  <div className="max-w-125">
    <ProductGallery images={moa.images} title={moa.title} />
  </div>
);

/**
 * With more angles shot, the rail appears and the first thumbnail reads as
 * pressed. The extra slots here are the labelled placeholder at the rail's exact
 * 4:5 ratio — which is how the gallery is already its final size and shape before
 * the photography exists.
 */
export const WithRail = () => (
  <div className="max-w-125">
    <ProductGallery
      images={[
        ...moa.images,
        { url: null, altText: "", width: 1024, height: 1280 },
        { url: null, altText: "", width: 1024, height: 1280 },
        { url: null, altText: "", width: 1024, height: 1280 },
      ]}
      title={moa.title}
    />
  </div>
);

/** Several real crops — what the rail looks like once a piece is fully shot. */
export const ManyAngles = () => (
  <div className="max-w-125">
    <ProductGallery
      images={products.slice(0, 4).map((product) => product.featuredImage)}
      title={moa.title}
    />
  </div>
);
