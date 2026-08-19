import { Copy } from "@/components/ui/copy";
import { formatMoney, type Money } from "@/lib/shopify";

/**
 * Price. Espresso ink at 15px per the design system's product card, with tabular
 * figures so columns of prices do not shift width. Pricing and currency are not
 * decided yet, so a null price renders a placeholder rather than a made-up number.
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
    <span className={`text-ink ${className}`} data-numeric>
      {formatMoney(price)}
    </span>
  );
}
