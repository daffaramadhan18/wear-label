import { formatMoney, type Money } from "@/lib/shopify";

/**
 * Price display. Tabular figures keep columns of prices from shifting width as
 * digits change, and the strikethrough original is announced as such rather than
 * being communicated by styling alone.
 */
export function Price({
  price,
  compareAt = null,
  className = "",
}: {
  price: Money;
  compareAt?: Money | null;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`} data-numeric>
      <span className={compareAt ? "text-ink-accent" : "text-ink"}>{formatMoney(price)}</span>
      {compareAt ? (
        <>
          <span className="sr-only">, reduced from</span>
          <s className="text-caption text-ink-muted">{formatMoney(compareAt)}</s>
        </>
      ) : null}
    </span>
  );
}
