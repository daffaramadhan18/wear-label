import { PromoBand } from "wear-label";
import { home } from "@/lib/content/site";
import { products } from "@/lib/shopify/fixtures";

/**
 * The limited-run band: copy on the inert aurora, the garment filling the
 * right-hand edge.
 *
 * The photograph sits behind the copy and **only from `md` up** — at narrow widths
 * the crop would be a sliver and the text would be reading against a garment, so
 * below that the band is the wash alone.
 *
 * The countdown appears only when `endsAt` is a parseable future date. The
 * storefront passes an empty string (a run's end date is merchandising data, and a
 * countdown that is really a fixed string is worse than no countdown), so the band
 * renders without blocks — that is `Default` below.
 *
 * The band is currently OFF the home page; the component and its copy both stay,
 * so restoring it is one block in `app/page.tsx`.
 */
const image = products.find((p) => p.handle === "pallo-pants")!.featuredImage;

/** The storefront's own copy — no end date, so no countdown blocks. */
export const Default = () => (
  <PromoBand
    eyebrow={home.promo.eyebrow}
    heading={home.promo.heading}
    cta={home.promo.cta}
    href={home.promo.href}
    endsAt={home.promo.endsAt}
    image={image}
  />
);

/** With a run that ends in four days, the countdown appears under the heading. */
export const WithCountdown = () => (
  <PromoBand
    eyebrow={home.promo.eyebrow}
    heading={home.promo.heading}
    cta={home.promo.cta}
    href={home.promo.href}
    endsAt={new Date(Date.now() + 4 * 86_400_000).toISOString()}
    image={image}
  />
);
