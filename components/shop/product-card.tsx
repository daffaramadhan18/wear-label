import Link from "next/link";
import { CardHover, CardMedia } from "@/components/shop/card-hover";
import { Badge } from "@/components/ui/badge";
import { Copy } from "@/components/ui/copy";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { ui } from "@/lib/content/site";
import type { Product } from "@/lib/shopify";

/**
 * Catalogue card, per the design system's Product cards section: a 3:4 image
 * block, then the name in Playfair, the material line in camel, then the price.
 *
 * The system's card carries an add-to-bag button. There is no cart in this build,
 * so the card is a link to the product instead — the whole card is one link (the
 * name anchor stretched over the media), giving one tab stop per product and no
 * nested interactive elements. Sold-out state is stated in words, never by colour
 * alone.
 *
 * `<CardHover>` supplies the article element and the hover/focus state; the image
 * inside `<CardMedia>` scales with it. That is the only client code in the card —
 * everything below stays server-rendered.
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
    <CardHover className="relative flex flex-col gap-3.5">
      <CardMedia>
        <Media image={product.featuredImage} sizes={sizes} />
      </CardMedia>

      <div className="flex flex-col gap-1.5">
        <Heading className="font-display text-card leading-card text-ink">
          <Link
            href={`/shop/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand"
          >
            <Copy value={product.title} label="product name" />
          </Link>
        </Heading>

        <p className="text-caption text-ink-subtle">
          <Copy value={product.material} label="material" />
        </p>

        <Price price={product.priceRange.minVariantPrice} className="mt-0.5 text-small" />
      </div>

      {!product.availableForSale ? (
        <Badge tone="inert" className="self-start">
          {ui.soldOut}
        </Badge>
      ) : null}
    </CardHover>
  );
}
