import { InstagramStrip } from "wear-label";
import { home } from "@/lib/content/site";
import { products } from "@/lib/shopify/fixtures";

/**
 * The Instagram strip: one row of square crops, scrolling.
 *
 * **The loop is pure CSS** (`.wl-marquee` in `globals.css`), so this stays a
 * Server Component and costs no JavaScript. The track holds the run twice and
 * travels exactly −50%, which is what makes it seamless — the component builds the
 * second copy itself and marks it `aria-hidden`, so pass each image once.
 *
 * It runs continuously; hovering does not stop it. `prefers-reduced-motion` stops
 * it altogether, which is why the rail is `overflow-x-auto` rather than `hidden`:
 * with the animation off the strip still has to be reachable by scrolling. The
 * scrollbar itself is hidden, so that fallback costs the design nothing.
 *
 * There are no links on the crops. A post needs a permalink, and the studio's
 * posts are not wired up here — inventing one would send readers nowhere. The
 * images are the catalogue's own for the same reason.
 *
 * An empty `images` array renders nothing rather than an empty band.
 */

/** The strip as the home page ends on — the eleven catalogue photographs. */
export const Default = () => (
  <InstagramStrip
    heading={home.instagram.heading}
    images={products.map((product) => product.featuredImage)}
  />
);

/** A shorter run. The track still doubles it, so the loop stays seamless. */
export const ShortRun = () => (
  <InstagramStrip
    heading={home.instagram.heading}
    images={products.slice(0, 4).map((product) => product.featuredImage)}
  />
);
