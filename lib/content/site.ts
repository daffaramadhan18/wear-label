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
   * "From our customers" — the voices wall between New arrivals and the mosaic.
   *
   * These are real Shopee reviews, reproduced verbatim from the storefront
   * design: no rewriting, no tidying of the spelling, no translation. That is the
   * whole reason this section is allowed to exist where a star rating is not —
   * it quotes customers rather than manufacturing a score. Long ones are clamped
   * to six lines by the card, never edited down.
   *
   * They are in Indonesian while the rest of the site is English. Quoting a
   * customer in the language they wrote in is the point; translating them would
   * make them paraphrases.
   *
   * Twenty of them, four columns of five. Change the count and the component
   * re-slices, but keep it a multiple of four or the last column runs short.
   */
  voices: {
    heading: "From our customers",
    reviews: [
      { user: "r*****a", body: "My 2nd and 3rd yora pants.. Bagus cutting dan bahannya.. Super pewe dan ringan.. I know my photos are not doing the pants justice, but trust me, its worth to buy!" },
      { user: "r*****a", body: "yayy makasii bgtt celananya udah nyampe, pengemasan sm sellernya juga cepet bgtt langsung dikirim. sumph si celananya se pw itu, sebelum2nya kalo beli celana gapernah ga dikecilin(always) kali ini celananya bnr2 fit di aku dan se pw itu celananya kao dipake." },
      { user: "y*****p", body: "bagusss banget tolong, selama ini susah cari celana ukuran oke, seneng banget nemu brand ini. Bahan jg bagus dan harganya murah. Langsung pengen beli warna lain😍" },
      { user: "r*****a", body: "warna putih nya bagus ga terlalu nerawang, sehari langsung nyampe pake same day 🥰😍" },
      { user: "r*****u", body: "WORTH IT BANGET!🥰🥰😍 Mau repurchase lagi nunggu yang warna putih restock, ini bener2 bagus ga panas, aku udah langsung try on jalan-jalan soalnya tadi siang di tempat panas, linennya ga gatel sama sekali, buat ibu hamil 6 bulan muat uk L , bb ku 55,7 kg tinggi 160cm." },
      { user: "s*****b", body: "keren bgt, UK nya juga pas biasanya kalo dari toko sebelumnya itu terlalu gede kalo ini tuh pas bgt, sukak, next time order lagi!" },
      { user: "p*****_", body: "packingan bagus aman dan rapih. celananya pas banget size nya, ga kegedean atau kekecilan, bahannya juga adem. adminnya baik responsif, btw maaf ya videonya ini tp paket nyampe dengan selamat dan barangnya bagus" },
      { user: "r*****u", body: "Bahan linen produk lokal yang bagus! Udh 2x order ~ hamil 8 bulan masi muat dan suka bgt !!! ✨😍❤️ ga sesak sama sekali" },
      { user: "nadonaddd", body: "Satisfying! Bahannya halus, ringan, lingkar pinggang pas sama panjang ukuran M juga passs buat aku TB 155 / BB 47, plus respon seller oke banget dan bantu bangettt awalnya keabisan choco yg M pas chat seller lgsg dibales dan ternyata masih ada 1! Aaaa pas banget lagi cari celana gini, thanks a lot!" },
      { user: "ruthfelisa", body: "Bahannya bagus dan cuttingan nya pas, ga yg terlalu lebar. Ini celana ke 2 aku beli di wear label. Biar ga nerawang pakai daleman warna netral atau short pants" },
      { user: "g*****i", body: "Cakepp bangettt pliss!!! Ga nyesel beli di sini, worth it banget dengan harga segitu, kualitasnya beneran bagus. Sempet ragu karna takut kebesaran dipinggang (BB 38/155), tapi ternyata pas bangettt huhu🥺 senangggg. Pengemasan dan pengirimannya juga cepat sekali. Kmrn checkout, hari ini udah nyampe." },
      { user: "l*****l", body: "celananya realpict, bagus, panjang pas di aku tb 167 cm, BB 60. puas sih. cuma kalo aku pake agak jdi keliatan gendut hehe. tpi keseluruhan mantap bahannya sesuai deskripsi. penting buat lihat detail produk, sebelum membeli gaiss..❤️❤️" },
      { user: "k*****_", body: "bagusss bangettt uu😍 realpict, no minus, cuttingnya rapii, packingnya cakep, buat bb/tb 43/162 cocok bgt pake uk M panjang n bagian pinggangnya pas👍 recommended banget sih ini🥰" },
      { user: "satyairada", body: "Produk ini oke bgt, aku pesen wrna white dan gak nerawang, oke si buat hijabers2 yg pengen pake kulot putih n ga nerawang, kesan hw jg bikin kt terlihat lbh jenjang, good job kak! Produknya oke bgt ❤️" },
      { user: "d*****a", body: "Aku suka celananya tipis tapi ga nerawang gitu bahannya juga lembut nyaman dipakai beraktifitas seharian bahkan dipake buat liburan pun oke banget sih ini" },
      { user: "a*****0", body: "Sumpah ini tipe celana yg udh lama aku cari 🥺😢 Akhirnya menemukan merk ini. Mantap banget pokoknya. Suka bgttt 🫰🫰 Admin super ramah, informatif. Celananya oke, panjang nya pas, bahan bagus. Bakalan repurchaseeee😍🥰" },
      { user: "j*****y", body: "Pertama kali beli dan langsung suka sama produknya wear label❤️ bahannya jatuh dan adem, jahitan super rapih, packingnya jg super rapih per produk pakai kardus sendiri-sendiri👍👍👍" },
      { user: "tinnayumiko05", body: "Masya Allah ini keren banget...BB aq 57 TB 155 masih muat dong...sebagus itu dan nyaman di pake.next aq mau order lagi ..packing nya juga super rapi banget dan cepet sampai nya ..makasih ya,sumpah gak nyesel beli disini ..🤩🤩🥳" },
      { user: "y*****1", body: "bagussss bangettt sukaaaa udah repeat order 3x selalu puas beli di wear labell , untuk cewe tinggi kea aku gini ga ngantung sama sekali celana nyaa😭👍 buat tb 165 aman bgtt pake yora loose panta size L😭😍 tcakeuppppp bgtt!!!! bakal order lagii yora loose pants ketagihan bahannya enakk jatuh😍" },
      { user: "e*****i", body: "Proses packing cepat, packaging juga aman tebal gak worry produk cacat karna pengiriman. Pengiriman juga cepet. Total dah punya 5 koleksi cerra pants ku saking love nya, thankyou" },
    ],
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
