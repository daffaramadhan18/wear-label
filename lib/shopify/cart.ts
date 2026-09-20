import { cookies } from "next/headers";
import { isLive, notImplemented } from "./env";
import { products as productFixtures } from "./fixtures";
import type { Image, Money, Product, ProductVariant } from "./types";

/**
 * The bag.
 *
 * WHERE CART STATE LIVES. In Shopify, always. This app is presentation only: it
 * holds a single cookie and asks this module for the rest, and no component
 * anywhere computes a price, a total or an availability. When the store is live,
 * `wl_cart` holds the Shopify `cartId` and every function here becomes a Cart API
 * call; the components do not change.
 *
 * Until then the same cookie holds the mock bag itself — lines and quantities —
 * so the bag, the header count and the add-to-bag actions are all real and
 * clickable before a store exists. That is the same fixtures-until-live rule the
 * catalogue follows, and it is why the arithmetic below is here rather than in a
 * page: it is the part that Shopify's `cart.cost` replaces.
 *
 * Cookie mutation is only legal inside a Server Function, so the write paths are
 * exported through `./actions`, never called during render.
 */

const COOKIE = "wl_cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 14;
const MAX_LINE_QUANTITY = 10;

export interface CartLine {
  /** Shopify's line id. One line per variant, so the variant id serves as it. */
  id: string;
  variantId: string;
  quantity: number;
  /** The variant's own option values, e.g. "M / Camel". */
  variantTitle: string;
  available: boolean;
  unitPrice: Money | null;
  lineTotal: Money | null;
  product: {
    handle: string;
    title: string;
    material: string;
    featuredImage: Image;
  };
}

export interface Cart {
  id: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money | null;
    /** Shipping and tax are added by Shopify's checkout, never here. */
    totalAmount: Money | null;
  };
  /**
   * Where checkout happens. Checkout is Shopify-hosted on every plan below Plus,
   * so this is a redirect target and not a page in this app. Null until the store
   * is connected, which is why the bag's action is inert rather than fake.
   */
  checkoutUrl: string | null;
}

interface StoredLine {
  v: string;
  q: number;
}

/* --- the cookie ---------------------------------------------------------- */

function encode(lines: StoredLine[]): string {
  return Buffer.from(JSON.stringify(lines), "utf8").toString("base64url");
}

function decode(value: string | undefined): StoredLine[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((entry) => {
      if (typeof entry !== "object" || entry === null) return [];
      const { v, q } = entry as Record<string, unknown>;
      if (typeof v !== "string" || typeof q !== "number") return [];
      return [{ v, q: clampQuantity(q) }];
    });
  } catch {
    /* A malformed cookie is treated as an empty bag rather than an error page —
       it can only come from a hand-edited or truncated value. */
    return [];
  }
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(MAX_LINE_QUANTITY, Math.max(1, Math.trunc(quantity)));
}

async function readStored(): Promise<StoredLine[]> {
  const store = await cookies();
  return decode(store.get(COOKIE)?.value);
}

/** Only ever called from a Server Function — see `./actions`. */
async function writeStored(lines: StoredLine[]): Promise<void> {
  const store = await cookies();

  if (lines.length === 0) {
    store.delete(COOKIE);
    return;
  }

  store.set(COOKIE, encode(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/* --- resolving lines against the catalogue -------------------------------- */

interface Resolved {
  product: Product;
  variant: ProductVariant;
}

function resolve(variantId: string): Resolved | null {
  for (const product of productFixtures) {
    const variant = product.variants.find((entry) => entry.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}

function multiply(price: Money | null, quantity: number): Money | null {
  if (!price) return null;
  return { amount: String(Number(price.amount) * quantity), currencyCode: price.currencyCode };
}

function sum(lines: CartLine[]): Money | null {
  const priced = lines.filter((line) => line.lineTotal !== null);
  if (priced.length === 0) return null;

  const currencyCode = priced[0].lineTotal!.currencyCode;
  const amount = priced.reduce((total, line) => total + Number(line.lineTotal!.amount), 0);

  return { amount: String(amount), currencyCode };
}

function toLine({ product, variant }: Resolved, quantity: number): CartLine {
  return {
    id: variant.id,
    variantId: variant.id,
    quantity,
    variantTitle: variant.title,
    available: variant.availableForSale,
    unitPrice: variant.price,
    lineTotal: multiply(variant.price, quantity),
    product: {
      handle: product.handle,
      title: product.title,
      material: product.material,
      featuredImage: product.featuredImage,
    },
  };
}

/* --- reads ---------------------------------------------------------------- */

/**
 * The current bag, or null when there is none. A line whose variant has vanished
 * from the catalogue is dropped from the view rather than erroring; the cookie is
 * left alone, because render cannot write one.
 */
export async function getCart(): Promise<Cart | null> {
  if (isLive()) notImplemented("getCart");

  const stored = await readStored();
  if (stored.length === 0) return null;

  const lines = stored.flatMap((entry) => {
    const resolved = resolve(entry.v);
    return resolved ? [toLine(resolved, entry.q)] : [];
  });

  const subtotal = sum(lines);

  return {
    id: "fixture-cart",
    totalQuantity: lines.reduce((total, line) => total + line.quantity, 0),
    lines,
    /* Subtotal only. Shipping is quoted by the courier app at checkout and tax is
       Shopify's to add, so `totalAmount` deliberately equals the subtotal here
       instead of inventing a shipping figure. */
    cost: { subtotalAmount: subtotal, totalAmount: subtotal },
    checkoutUrl: null,
  };
}

/** Just the badge number, so the header does not resolve the whole bag. */
export async function getCartCount(): Promise<number> {
  if (isLive()) notImplemented("getCartCount");

  const stored = await readStored();
  return stored.reduce((total, entry) => total + entry.q, 0);
}

/* --- writes (Server Functions only) --------------------------------------- */

export async function addCartLine(variantId: string, quantity = 1): Promise<void> {
  if (isLive()) notImplemented("addCartLine");
  if (!resolve(variantId)) return;

  const stored = await readStored();
  const existing = stored.find((entry) => entry.v === variantId);

  if (existing) existing.q = clampQuantity(existing.q + quantity);
  else stored.push({ v: variantId, q: clampQuantity(quantity) });

  await writeStored(stored);
}

export async function setCartLineQuantity(
  variantId: string,
  quantity: number,
): Promise<void> {
  if (isLive()) notImplemented("setCartLineQuantity");

  const stored = await readStored();

  if (quantity < 1) {
    await writeStored(stored.filter((entry) => entry.v !== variantId));
    return;
  }

  const existing = stored.find((entry) => entry.v === variantId);
  if (!existing) return;

  existing.q = clampQuantity(quantity);
  await writeStored(stored);
}

export async function removeCartLine(variantId: string): Promise<void> {
  if (isLive()) notImplemented("removeCartLine");

  const stored = await readStored();
  await writeStored(stored.filter((entry) => entry.v !== variantId));
}
