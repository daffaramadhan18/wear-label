/**
 * Catalogue vocabulary — the handful of strings both the data layer and the UI have
 * to agree on, kept out of `./catalogue` so `./fixtures` can use them without a
 * cycle.
 */

/** Tags the UI reads. Everything else Shopify carries is ignored here. */
export const TAGS = {
  new: "New",
  madeToOrder: "Made to order",
} as const;

/**
 * The five colourways, with the swatch each one paints. Names and hexes are the
 * design system's Colourway row — Cream, Camel, Taupe, Sage, Espresso.
 */
export const COLOURWAYS = [
  { name: "Cream", swatch: "#EDDFD6" },
  { name: "Camel", swatch: "#C9AF97" },
  { name: "Taupe", swatch: "#725E4C" },
  { name: "Sage", swatch: "#8F948E" },
  { name: "Espresso", swatch: "#1E1A16" },
] as const;
