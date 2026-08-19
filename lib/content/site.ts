/**
 * Site copy — DELIBERATELY EMPTY.
 *
 * Brand voice, tone and messaging have not been decided, so no copy is invented
 * here. Every string below is `""`, and components render a labelled placeholder
 * block in its place (see `components/ui/copy.tsx`). Layout is therefore already
 * final: filling this file in is the only step needed to launch real copy, and
 * no component changes.
 *
 * Later this module can be swapped for Shopify Metaobjects or a CMS — the
 * components only ever see this shape.
 *
 * Site language: English, single locale.
 */

/** Interface chrome that is not brand copy stays in English, spelled out here. */
export const ui = {
  skipToContent: "Skip to main content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  filters: "Filters",
  apply: "Apply",
  clearAll: "Clear all",
  sort: "Sort",
  category: "Category",
  size: "Size",
  availability: "Availability",
  inStockOnly: "In stock only",
  results: "results",
  home: "Home",
  shop: "Shop",
  noResults: "No products match these filters.",
  soldOut: "Sold out",
} as const;

export const brand = {
  /** The only fixed string on the site — it is the company name. */
  name: "Wear Label",
  tagline: "",
  description: "",
} as const;

export const nav = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
  ],
  account: { label: "My Account", href: "/account" },
} as const;

export const home = {
  hero: {
    eyebrow: "",
    heading: "",
    body: "",
    cta: "",
  },
  featured: {
    heading: "",
    body: "",
    cta: "",
  },
} as const;

export const shop = {
  heading: "",
  body: "",
} as const;

export const about = {
  heading: "",
  body: "",
  /** Three body paragraphs. Add or remove entries to change the page length. */
  paragraphs: ["", "", ""],
} as const;

export const account = {
  heading: "",
  body: "",
  /** Panels the account area will hold. Titles are blank until decided. */
  panels: [{ title: "", body: "" }, { title: "", body: "" }],
} as const;

export const notFound = {
  heading: "",
  body: "",
  cta: "",
} as const;

export const footer = {
  note: "",
  copyright: "",
} as const;
