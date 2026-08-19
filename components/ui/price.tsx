import { Copy } from "@/components/ui/copy";
import { formatMoney, type Money } from "@/lib/shopify";

/**
 * Price display. Tabular figures keep columns of prices from shifting width as
 * digits change. Pricing and currency are not decided yet, so a null price
 * renders a placeholder rather than an invented number.
 */
export function Price({
  price,
  className = "",
}: {
  price: Money | null;
  className?: string;
}) {
  if (!price) {
    return <Copy value="" label="price" className={`max-w-24 ${className}`} />;
  }

  return (
    <span className={className} data-numeric>
      {formatMoney(price)}
    </span>
  );
}
