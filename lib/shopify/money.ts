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
