import { Breadcrumbs } from "wear-label";

/**
 * The breadcrumb trail, above a product's name.
 *
 * Ancestors first, current page last. **Only the last entry may omit `href`** —
 * that is what marks it as the current page, and it renders as plain espresso text
 * carrying `aria-current="page"` rather than as a link. So the trail reads as a
 * position, not as a set of destinations, and the separator is `aria-hidden`
 * because a slash is not a word.
 */

/** The product page's trail — the real one, from /shop to a piece. */
export const Default = () => (
  <Breadcrumbs
    trail={[
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Moa Pants" },
    ]}
  />
);

/** A category in the middle — every level is a real catalogue filter. */
export const Deep = () => (
  <Breadcrumbs
    trail={[
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Wide leg", href: "/shop?category=Wide+leg" },
      { label: "Milly Stripe Pants" },
    ]}
  />
);

/** Two levels — the shortest trail that still says where you are. */
export const Shallow = () => (
  <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Shopping bag" }]} />
);
