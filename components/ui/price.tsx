import { Copy } from "@/components/ui/copy";
import { formatMoney, type Money } from "@/lib/shopify";

/**
 * Price. Espresso ink with tabular figures, so a column of prices does not shift
 * width. A marked-down piece shows the old price struck through beside it — never
 * the strike alone, since a line through a number is not a statement of what
 * changed.
 */
export function Price({
  price,
  compareAt = null,
  className = "",
  size = "small",
}: {
  price: Money | null;
  /** The was-price, when the piece is marked down. */
  compareAt?: Money | null;
  className?: string;
  /** `display` is the product page's Playfair treatment. */
  size?: "small" | "display";
}) {
  if (!price) {
    return <Copy value="" label="price" className={`max-w-24 ${className}`} />;
  }

  const struck = compareAt && Number(compareAt.amount) > Number(price.amount);

  return (
    <span className={`flex flex-wrap items-baseline gap-2.5 ${className}`}>
      <span
        data-numeric
        className={
          size === "display"
            ? "font-display text-h2 leading-h2 text-ink"
            : "text-small text-ink"
        }
      >
        {formatMoney(price)}
      </span>
      {struck ? (
        <s data-numeric className="text-caption text-ink-subtle">
          {formatMoney(compareAt)}
        </s>
      ) : null}
    </span>
  );
}
