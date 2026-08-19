import Link from "next/link";
import { Copy } from "@/components/ui/copy";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { ui } from "@/lib/content/site";
import type { Product } from "@/lib/shopify";

/**
 * Catalogue card.
 *
 * The whole card is one link (the title anchor stretched over the media) so there
 * is a single tab stop per product and no nested interactive elements. Sold-out
 * state is stated in words, never by colour alone.
 */
export function ProductCard({
  product,
  sizes,
  headingLevel: Heading = "h3",
}: {
  product: Product;
  sizes: string;
  /** Set so the card's name never skips a heading level on the page it sits on. */
  headingLevel?: "h2" | "h3";
}) {
  return (
    <article className="group relative flex flex-col">
      <Media image={product.featuredImage} sizes={sizes} label="product image" />

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <Heading className="min-w-0 flex-1 font-body text-body font-medium">
          <Link
            href={`/shop/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-ink-accent"
          >
            <Copy value={product.title} label="product name" />
          </Link>
        </Heading>
        <Price price={product.priceRange.minVariantPrice} className="shrink-0 text-caption" />
      </div>

      {!product.availableForSale ? (
        <p className="mt-2 text-caption text-ink-muted">{ui.soldOut}</p>
      ) : null}
    </article>
  );
}
