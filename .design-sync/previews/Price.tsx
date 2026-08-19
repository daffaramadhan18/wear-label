import { Price } from "wear-label";

/**
 * Espresso ink at the 15px step with tabular figures, so a column of prices never
 * shifts width as the digits change.
 *
 * A marked-down piece shows the old price struck through beside the new one —
 * never the strike on its own, since a line through a number does not say what
 * changed. `size="display"` is the product page's Playfair treatment.
 *
 * `price` is nullable, because a catalogue can reach this UI before it is priced,
 * and a null renders a placeholder rather than a made-up number. IDR formatting
 * follows lib/shopify/money.ts, which writes Indonesian grouping and no minor
 * units ("Rp 1.250.000") even on an English-language site.
 */

/** A real Money value, formatted for the market. */
export const Formatted = () => (
  <div className="flex flex-col gap-3 text-small">
    <Price price={{ amount: "1250000", currencyCode: "IDR" }} />
    <Price price={{ amount: "89.00", currencyCode: "USD" }} />
  </div>
);

/** Marked down: both prices, in the order they are read. */
export const MarkedDown = () => (
  <div className="flex flex-col gap-3">
    <Price
      price={{ amount: "159200", currencyCode: "IDR" }}
      compareAt={{ amount: "199000", currencyCode: "IDR" }}
    />
    <Price
      price={{ amount: "159200", currencyCode: "IDR" }}
      compareAt={{ amount: "199000", currencyCode: "IDR" }}
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
    <Price price={{ amount: "1250000", currencyCode: "IDR" }} />
    <Price price={{ amount: "890000", currencyCode: "IDR" }} />
    <Price price={{ amount: "11100000", currencyCode: "IDR" }} />
  </div>
);
