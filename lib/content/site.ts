/**
 * Site copy — the single content module.
 *
 * Every string the storefront shows that is not product data lives here, taken
 * from the approved storefront design (Claude Design project
 * bf11a0f4-4b1c-400b-802c-b9c9c2d66673, "Wear Label Storefront.dc.html"). Nothing
 * is invented in a component, and no component hardcodes marketing copy: a slot
 * with an empty string renders a labelled placeholder instead (see
 * `components/ui/copy.tsx`), so the layout is final either way.
 *
 * Two adjustments to the design's strings, both deliberate:
 *
 *   1. Amounts are written the way `lib/shopify/money.ts` formats them for
 *      Indonesia ("Rp 750.000", not "Rp750,000"), so prose and formatted prices
 *      match on the same screen.
 *   2. Claims about a discount depth that the catalogue does not carry were
 *      dropped rather than restated. The markdowns in the catalogue are 20%.
 *
 * Later this module can be swapped for Shopify Metaobjects or a CMS — the
 * components only ever see this shape. Site language: English, single locale.
 */

/** Interface chrome. Not brand copy, so it is spelled out rather than left blank. */
export const ui = {
  skipToContent: "Skip to main content",
  openMenu: "Open menu",
  closeMenu: "Close menu",

  /* Catalogue */
  filters: "Filters",
  category: "Category",
  allPieces: "All pieces",
  size: "Size",
  colourway: "Colourway",
  availability: "Availability",
  inStockOnly: "In stock only",
  madeToOrder: "Made to order",
  sort: "Sort",
  apply: "Apply",
  clearAll: "Clear all",
  pieces: "pieces",
  everything: "Everything",
  noResults: "No pieces match these filters.",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  page: "Page",

  /* Product */
  soldOut: "Sold out",
  new: "New",
  addToBag: "Add to bag",
  chooseSize: "Choose a size",
  quantity: "Quantity",
  increase: "Increase quantity",
  decrease: "Decrease quantity",
  addedToBag: "Added to your bag.",
  save: "Save for later",
  saved: "Saved for later",
  unavailableVariant: "This combination is sold out",
  gallery: "Product gallery",
  showImage: "Show image",
  details: "Details",
  fabricAndCare: "Fabric & care",
  shipping: "Shipping",
  relatedHeading: "You may also like",

  /* Bag */
  bag: "Bag",
  item: "Item",
  price: "Price",
  lineTotal: "Total",
  remove: "Remove",
  continueShopping: "Continue shopping",
  promoCode: "Promo code",
  bagCountOne: "piece in your bag",
  bagCountMany: "pieces in your bag",

  /* Carousel */
  heroLabel: "Featured collections",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  goToSlide: "Go to slide",

  /* The two forms whose Shopify side has to be configured first. */
  newsletterUnavailable:
    "Newsletter sign-up is not connected yet — the store's mailing list is set up in Shopify.",
  discountUnavailable:
    "Discount codes are applied at checkout once the store is connected to Shopify.",
  checkoutUnavailable:
    "Checkout runs on Shopify's own secure checkout, which opens once the store is connected.",
} as const;

export const brand = {
  name: "Wear Label",
  tagline: "Handwoven linen and cotton, sewn in small runs in Bandung.",
  description: "Handwoven linen and cotton, sewn in small runs in Bandung.",
} as const;

/** The espresso strip above the header. */
export const announcement = "Free shipping on orders over Rp 750.000";

export const nav = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About Us", href: "/about" },
  ],
  account: { label: "My Account", href: "/account" },
  bag: { label: "Bag", href: "/cart" },
} as const;

export const home = {
  /**
   * The hero rotates. Add or remove a slide and the carousel follows — the dots
   * and the arrows are derived, not listed.
   */
  hero: {
    slides: [
      {
        eyebrow: "New arrivals",
        heading: "The Dry Season Collection",
        body: "Handwoven linen and cotton poplin, cut loose and sewn in small runs.",
        cta: "Shop the collection",
        href: "/shop",
      },
      {
        eyebrow: "Made to order",
        heading: "Cut to your measurements",
        body: "Choose a colourway and we sew it for you. Ten working days, from the Bandung studio.",
        cta: "Start an order",
        href: "/shop?made-to-order=1",
      },
    ],
  },

  /**
   * The limited-run band. `endsAt` drives the countdown: set it to an ISO
   * timestamp and the blocks appear; leave it empty and the band runs without
   * them. It is empty because a run's end date is merchandising data, and a
   * countdown that is really a fixed string is worse than no countdown.
   */
  promo: {
    eyebrow: "Limited run",
    heading: "Twenty pieces per colourway",
    cta: "View collection",
    href: "/shop",
    endsAt: "",
  },

  arrivals: {
    heading: "New arrivals",
    cta: "View all",
    href: "/shop",
  },

  /**
   * The category mosaic — one tall tile and four small ones. Every destination is
   * a real catalogue filter; the design's "Tops" and "Up to 40% off" tiles are
   * not here because neither exists in this catalogue.
   */
  mosaic: {
    feature: { eyebrow: "Shop", label: "Wide leg", href: "/shop?category=Wide+leg" },
    tiles: [
      { label: "Culottes", href: "/shop?category=Culottes" },
      { label: "Straight cut", href: "/shop?category=Straight+cut" },
      { label: "Made to order", href: "/shop?made-to-order=1" },
      { label: "Everything", href: "/shop" },
    ],
  },

  /** `icon` selects a mark from `components/ui/icons.tsx`. */
  services: [
    {
      icon: "shipping",
      title: "Free shipping",
      body: "On orders over Rp 750.000",
    },
    {
      icon: "support",
      title: "Studio support",
      body: "Fit advice over WhatsApp",
    },
    {
      icon: "exchange",
      title: "Easy exchange",
      body: "One free swap in 14 days",
    },
  ],

  madeToOrder: {
    eyebrow: "Made to order",
    heading: "Cut to your measurements",
    body: "Send us your measurements and choose a colourway. The studio cuts a single piece for you and ships it within ten working days.",
    cta: "Start an order",
    href: "/shop?made-to-order=1",
    stats: [
      { value: "10 days", label: "From order to dispatch" },
      { value: "5 tones", label: "Cream, camel, taupe, sage, espresso" },
      { value: "1 tailor", label: "Every piece sewn end to end by one hand" },
    ],
  },

  instagram: {
    heading: "Follow us on Instagram",
  },
} as const;

export const shop = {
  heading: "New Arrivals",
  body: "",
  /** The two bands under the banner. */
  promos: [
    { eyebrow: "", heading: "Spring sale", cta: "", href: "/shop?sort=price-asc" },
    {
      eyebrow: "Essentials",
      heading: "For Everyday",
      cta: "View collection",
      href: "/shop?category=Straight+cut",
    },
  ],
} as const;

export const product = {
  /** Store-wide policy, so it is content rather than per-product data. */
  shipping:
    "Ships from Bandung within 1–2 working days. One free size exchange within 14 days; made-to-order pieces are final sale.",
  notes: [
    "Ships from Bandung within 1–2 working days",
    "One free size exchange within 14 days",
  ],
} as const;

export const cart = {
  heading: "Shopping bag",
  empty: {
    heading: "Your bag is empty",
    body: "Pieces you add will appear here.",
    cta: "Browse the collection",
  },
  summary: {
    heading: "Order summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    /* Indonesian couriers are quoted by a Shopify app at checkout, so the bag
       states that rather than showing a rate it cannot know. */
    shippingNote: "Calculated at checkout",
    total: "Total",
    cta: "Continue to payment",
    note: "Taxes included. Made-to-order pieces ship within 10 working days.",
  },
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

/**
 * Footer.
 *
 * The column entries are the design's information architecture in full. An entry
 * with no `href` has no page yet, and renders as plain text rather than as a link
 * that would 404 — filling in the href is the only change needed once the page
 * exists. `socials` is empty for the same reason: the handles are not known here,
 * and a social button that goes nowhere is worse than none.
 */
export const footer = {
  newsletter: {
    heading: "Letters from the studio",
    body: "New colourways, restocks and studio notes. No more than twice a month.",
    placeholder: "Enter your email",
    cta: "Subscribe",
    label: "Email address",
  },
  note: "Handwoven linen and cotton, sewn in small runs in Bandung.",
  columns: [
    {
      title: "Company",
      links: [
        { label: "What we do", href: "/about" },
        { label: "The studio", href: "" },
        { label: "Journal", href: "" },
        { label: "FAQ", href: "" },
      ],
    },
    {
      title: "My account",
      links: [
        { label: "Sign in", href: "/account" },
        { label: "View bag", href: "/cart" },
        { label: "Order tracking", href: "" },
        { label: "Wishlist", href: "" },
      ],
    },
    {
      title: "Customer care",
      links: [
        { label: "Contact us", href: "" },
        { label: "Returns & refunds", href: "" },
        { label: "Size guide", href: "" },
        { label: "Terms", href: "" },
      ],
    },
  ],
  socials: [] as { label: string; href: string }[],
  copyright: "© 2026 Wear Label. Layout structure after the Flatlogic e-commerce template.",
} as const;
