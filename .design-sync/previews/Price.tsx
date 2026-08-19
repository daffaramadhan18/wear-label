import { Price } from "wear-label";

/**
 * Espresso ink at the 15px step with tabular figures, so a column of prices never
 * shifts width as the digits change.
 *
 * Currency and pricing are not decided for this storefront, so `price` is
 * nullable and a null renders a placeholder rather than a made-up number. IDR
 * formatting below follows lib/shopify/money.ts, which writes Indonesian
 * grouping and no minor units ("Rp 1.250.000") even on an English-language site.
 */

/** A real Money value, formatted for the market. */
export const Formatted = () => (
  <div className="flex flex-col gap-3 text-small">
    <Price price={{ amount: "1250000", currencyCode: "IDR" }} />
    <Price price={{ amount: "89.00", currencyCode: "USD" }} />
  </div>
);

/** Null price — the current state of this catalogue, and the honest default. */
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
