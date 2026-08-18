/**
 * Company-profile and marketing copy.
 *
 * Placeholder copy, written to be replaced. It lives in one typed module (not
 * inline in components) so it can later move to Shopify Metaobjects or a CMS by
 * swapping this module's implementation — the components stay untouched.
 *
 * Site language is English, single locale.
 */

export const brand = {
  name: "Wear Label",
  tagline: "Made slowly, worn long.",
  shortDescription:
    "A small apparel house working in natural fibres — handwoven cotton, flax linen, deadstock. Cut in limited runs in Bandung, Indonesia.",
  foundedIn: "2019",
  city: "Bandung, Indonesia",
} as const;

export const nav = {
  primary: [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Our Craft", href: "/craft" },
    { label: "About", href: "/about" },
  ],
  footer: [
    {
      title: "Shop",
      links: [
        { label: "All pieces", href: "/shop" },
        { label: "New arrivals", href: "/shop?sort=new" },
        { label: "Dry Season", href: "/collections/dry-season" },
        { label: "The Last Lot", href: "/collections/the-last-lot" },
        { label: "Gift cards", href: "/gift-cards" },
      ],
    },
    {
      title: "The House",
      links: [
        { label: "About Wear Label", href: "/about" },
        { label: "Our craft", href: "/craft" },
        { label: "Materials", href: "/materials" },
        { label: "Repair service", href: "/repair" },
        { label: "Stockists", href: "/stockists" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Size guide", href: "/size-guide" },
        { label: "Shipping", href: "/shipping" },
        { label: "Returns & exchanges", href: "/returns" },
        { label: "Care instructions", href: "/care" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
} as const;

export const announcement = {
  text: "Complimentary shipping across Indonesia on orders over Rp 750.000",
  href: "/shipping",
  linkLabel: "Shipping details",
} as const;

export const hero = {
  eyebrow: "Dry Season 2026",
  heading: "Made slowly, worn long.",
  body:
    "We cut in small runs from natural fibres, and we say plainly where every metre of cloth came from. Fewer pieces, made to stay in your rotation for years rather than a season.",
  primaryCta: { label: "Shop the collection", href: "/shop" },
  secondaryCta: { label: "How we make it", href: "/craft" },
  caption: "Handwoven tenun cotton, dyed with natural indigo in Central Java.",
} as const;

export const values = [
  {
    icon: "leaf",
    title: "Natural fibres only",
    body: "Cotton, flax linen and wool. No polyester blends, no elastane in the woven pieces.",
  },
  {
    icon: "loom",
    title: "Small-batch weaving",
    body: "Runs of 40–120 pieces, woven with partners we visit rather than only email.",
  },
  {
    icon: "needle",
    title: "Free repairs, forever",
    body: "Send a piece back for a seam, button or hem at any point in its life. We cover the work.",
  },
  {
    icon: "map",
    title: "Cut in Bandung",
    body: "One workshop, twelve people, paid above the regional minimum with published rates.",
  },
] as const;

export const story = {
  eyebrow: "The house",
  heading: "Twelve people, one workshop, no hurry.",
  paragraphs: [
    "Wear Label started in 2019 with a single linen shirt and a stubborn idea: that a garment should be able to survive being worn constantly. We were tired of clothes that looked finished on a rail and gave up after nine washes.",
    "So we work backwards from wear. Fibre first, then weave, then cut — and we only release a piece once it has been worn hard by someone in the workshop for a full season. Some designs never make it out of that stage.",
  ],
  quote: {
    text: "If it cannot be repaired, we do not put our name in the collar.",
    attribution: "Wear Label workshop, Bandung",
  },
  stats: [
    { value: "40–120", label: "Pieces per run" },
    { value: "6", label: "Weaving partners" },
    { value: "100%", label: "Natural fibre" },
  ],
  cta: { label: "Read our full story", href: "/about" },
} as const;

export const materials = {
  eyebrow: "Materials",
  heading: "Four cloths, chosen for how they age.",
  body:
    "We keep the material list short on purpose. Each of these has been through at least a year of wear testing before it reached a production run.",
  items: [
    {
      name: "Handwoven tenun cotton",
      origin: "Central Java",
      body:
        "Woven on hand looms in small workshops. The slight irregularity in the weave is the reason we use it, not a defect to be corrected.",
    },
    {
      name: "European flax linen",
      origin: "Normandy & Belgium",
      body:
        "Rain-fed flax, no irrigation. Stiff at first, then it softens to the shape of whoever is wearing it and stays there.",
    },
    {
      name: "Long-staple cotton",
      origin: "Mill-spun, knitted in Java",
      body:
        "Longer fibres mean fewer loose ends, which means far less pilling around the collar and under the arms.",
    },
    {
      name: "Deadstock & mill ends",
      origin: "Sourced by the lot",
      body:
        "Cloth that already exists, bought in single lots from mills clearing stock. Limited by definition — when a lot ends, the piece ends.",
    },
  ],
} as const;

export const process = {
  eyebrow: "Our craft",
  heading: "How a piece gets made.",
  steps: [
    {
      title: "Source the cloth",
      body:
        "We buy the fibre before we design, because the cloth decides what the garment can be. Every lot is logged with its mill and date.",
    },
    {
      title: "Cut one, wear it out",
      body:
        "A single sample gets worn daily for a season by someone in the workshop. Seams that fail here never reach production.",
    },
    {
      title: "Weave and sew in small runs",
      body:
        "Between forty and a hundred and twenty pieces. Small enough that a mistake costs a week, not a season of stock.",
    },
    {
      title: "Repair it, don't replace it",
      body:
        "The piece comes back to us for repairs for as long as you own it. We keep thread and buttons for every run we've ever made.",
    },
  ],
} as const;

export const lookbook = {
  eyebrow: "Lookbook",
  heading: "Dry Season 2026",
  body:
    "Photographed over two mornings in Bandung, on people who already owned the clothes.",
  cta: { label: "View the full lookbook", href: "/lookbook" },
  frames: [
    { alt: "Model in Tenun overshirt and wide trousers, standing in morning light" }, // → /lookbook/01.jpg
    { alt: "Detail of a handwoven cotton sleeve and cuff" }, // → /lookbook/02.jpg
    { alt: "Linen shirt drying on a line against a plaster wall" }, // → /lookbook/03.jpg
    { alt: "Model seated, wearing the Pagi cotton dress" }, // → /lookbook/04.jpg
  ],
} as const;

export const notes = {
  eyebrow: "Notes from wearers",
  heading: "What holds up after a year.",
  items: [
    {
      quote:
        "Two years of near-weekly wear and the collar still sits flat. I sent it in for a button and it came back with the hem redone too.",
      name: "Anindya R.",
      context: "Tenun Overshirt · owned since 2024",
    },
    {
      quote:
        "It creases, and I've stopped minding. The linen actually got better around the fourth month.",
      name: "Bayu S.",
      context: "Kalim Linen Shirt · owned since 2025",
    },
    {
      quote:
        "I bought one trouser to test and then replaced almost everything else in my closet with these.",
      name: "Mei L.",
      context: "Sore Wide Trouser · owned since 2023",
    },
  ],
} as const;

export const newsletter = {
  eyebrow: "Stay close",
  heading: "One letter a month. Nothing else.",
  body:
    "New runs, restocks and the occasional note from the workshop. No countdowns, no discount codes you have to act on within the hour.",
  consent: "We keep your address to send this letter and nothing else. Unsubscribe in one click.",
} as const;

export const footerNote = {
  shipping:
    "Shipped across Indonesia with JNE, J&T and SiCepat. International shipping available on request.",
  payment: "Card, bank transfer and QRIS at checkout.",
  copyright: `© ${brand.foundedIn}–present ${brand.name}. Made in ${brand.city}.`,
} as const;
