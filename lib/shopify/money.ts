import type { Money } from "./types";

const FORMATTERS: Record<string, Intl.NumberFormat> = {};

/**
 * Formats a Storefront API Money value.
 *
 * IDR is formatted with the Indonesian grouping the market expects
 * ("Rp 1.250.000") and no minor units, which is how prices are written in
 * Indonesia even on an English-language site.
 */
export function formatMoney({ amount, currencyCode }: Money): string {
  const locale = currencyCode === "IDR" ? "id-ID" : "en-US";
  const key = `${locale}:${currencyCode}`;

  FORMATTERS[key] ??= new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: currencyCode === "IDR" ? 0 : 2,
    minimumFractionDigits: currencyCode === "IDR" ? 0 : 2,
  });

  return FORMATTERS[key].format(Number(amount));
}

/**
 * The markdown depth, as a whole percentage, or null when the piece is not on
 * sale. Kept here rather than in a badge component: it is arithmetic over two
 * Money values, and Shopify is the authority on both.
 */
export function discountPercent(price: Money | null, compareAt: Money | null): number | null {
  if (!price || !compareAt) return null;

  const now = Number(price.amount);
  const was = Number(compareAt.amount);
  if (!Number.isFinite(now) || !Number.isFinite(was) || was <= now) return null;

  return Math.round((1 - now / was) * 100);
}
