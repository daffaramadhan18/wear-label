import { Price } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * Espresso ink at the 15px step with tabular figures, so a column of prices never
 * shifts width as the digits change.
 *
 * A marked-down piece shows the old price struck through beside the new one —
 * never the strike on its own, since a line through a number does not say what
 * changed. `size="display"` is the product page's Playfair treatment.
 *
 * `price` is nullable, because a catalogue can reach this UI before it is priced,
 * and a null renders a placeholder rather than a made-up number.
 *
 * IDR formatting comes from `lib/shopify/money.ts`, which writes Indonesian
 * grouping and no minor units ("Rp 165.000") even on an English-language site.
 */
const price = (handle: string) => products.find((p) => p.handle === handle)!;

/** Real catalogue amounts, in both currencies the formatter handles. */
export const Formatted = () => (
  <div className="flex flex-col gap-3 text-small">
    <Price price={price("basic-linen-cullote").priceRange.minVariantPrice} />
    <Price price={price("taka-flare-pants").priceRange.minVariantPrice} />
    <Price price={{ amount: "89.00", currencyCode: "USD" }} />
  </div>
);

/** Marked down: both prices, in the order they are read. Milly Stripe Pants. */
export const MarkedDown = () => (
  <div className="flex flex-col gap-3">
    <Price
      price={price("milly-stripe-pants").priceRange.minVariantPrice}
      compareAt={price("milly-stripe-pants").compareAtPrice}
    />
    <Price
      price={price("milly-stripe-pants").priceRange.minVariantPrice}
      compareAt={price("milly-stripe-pants").compareAtPrice}
      size="display"
    />
  </div>
);

/** No price yet — the placeholder, and the honest default. */
export const Unpriced = () => (
  <div className="text-small">
    <Price price={null} />
  </div>
);

/** Tabular figures: the column edge stays put across different digit widths. */
export const Column = () => (
  <div className="flex w-40 flex-col items-end gap-2 text-small">
    {["cerra-loose-pants", "dalia-wide-pants", "basic-pants"].map((handle) => (
      <Price key={handle} price={price(handle).priceRange.minVariantPrice} />
    ))}
  </div>
);
