import { CategoryMosaic } from "wear-label";
import { home } from "@/lib/content/site";
import { products } from "@/lib/shopify/fixtures";

/**
 * The category mosaic — one tall tile and four small ones, each a real catalogue
 * filter.
 *
 * The label sits ON the photograph, so it carries its own surface: a solid chip on
 * the small tiles, a heavier plate on the tall one. It never relies on the crop
 * staying dark enough to read against, and the small tiles alternate espresso and
 * camel so two adjacent chips never merge.
 *
 * It is a `nav`, not a heading block — `label` names the region, because a set of
 * links is not a section with a title.
 *
 * The photographs are passed in by the page (feature first, then one per tile), so
 * the mosaic never needs its own art direction to stay in step with the catalogue.
 * A missing entry falls back to the labelled placeholder at the right ratio.
 *
 * The band is currently OFF the home page; the component and its copy both stay,
 * so restoring it is one block in `app/page.tsx`.
 */

/** Every destination here is a live catalogue filter. */
export const Default = () => (
  <CategoryMosaic
    label="Shop by category"
    feature={home.mosaic.feature}
    tiles={home.mosaic.tiles}
    images={products.slice(0, 5).map((product) => product.featuredImage)}
  />
);

/**
 * Fewer photographs than tiles. Each missing slot renders the labelled placeholder
 * at the tile's own size, so the mosaic keeps its shape while shots are outstanding.
 */
export const AwaitingPhotography = () => (
  <CategoryMosaic
    label="Shop by category"
    feature={home.mosaic.feature}
    tiles={home.mosaic.tiles}
    images={products.slice(0, 2).map((product) => product.featuredImage)}
  />
);
