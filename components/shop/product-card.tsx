import Link from "next/link";
import { CardHover, CardMedia } from "@/components/shop/card-hover";
import { Badge } from "@/components/ui/badge";
import { BagIcon } from "@/components/ui/icons";
import { Copy } from "@/components/ui/copy";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { SaveButton } from "@/components/ui/save-button";
import { ui } from "@/lib/content/site";
import { discountPercent, TAGS, type Product } from "@/lib/shopify";

/**
 * Catalogue card, per the design: a square crop of the garment with the flag badge
 * at the top left and two actions at the bottom right, then the material line in
 * camel, the name in Playfair, and the price.
 *
 * The card is one stretched link — the name's anchor covers the whole card — so
 * there is one tab stop per product and no nested interactive elements. The two
 * actions sit above that overlay and are their own stops.
 *
 * The bag action goes to the product page rather than adding straight to the bag.
 * Every piece has five sizes and five colourways, so a one-click add would have to
 * guess a variant; for apparel that is a return, not a conversion. It is labelled
 * as what it does.
 *
 * `<CardHover>` supplies the article element and the hover/focus state; the image
 * inside `<CardMedia>` scales with it. That is the only client code in the card
 * besides the save button — everything else stays server-rendered.
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
  const price = product.priceRange.minVariantPrice;
  const discount = discountPercent(price, product.compareAtPrice);
  const isNew = product.tags.includes(TAGS.new);

  return (
    <CardHover className="relative flex flex-col gap-3">
      <div className="relative">
        <CardMedia>
          <Media image={product.featuredImage} sizes={sizes} ratio="1 / 1" />
        </CardMedia>

        {discount !== null ? (
          <Badge tone="sale" className="absolute left-3 top-3">
            −{discount}%
          </Badge>
        ) : isNew ? (
          <Badge tone="invert" className="absolute left-3 top-3">
            {ui.new}
          </Badge>
        ) : null}

        {/* Above the stretched link, so both actions stay clickable. */}
        <div className="absolute bottom-3 right-3 z-1 flex gap-2">
          <SaveButton
            handle={product.handle}
            title={product.title}
            className="size-9.5 rounded-xs bg-canvas/95 hover:bg-canvas"
          />
          <Link
            href={`/shop/${product.handle}#options`}
            className="inline-flex size-9.5 items-center justify-center rounded-xs bg-brand text-on-brand transition-colors duration-(--duration-base) hover:bg-invert"
          >
            <BagIcon className="size-4.5" />
            <span className="sr-only">
              {ui.chooseSize}: {product.title}
            </span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-caption text-ink-subtle">
          <Copy value={product.material} label="material" />
        </p>

        <Heading className="font-display text-card leading-card text-ink">
          <Link
            href={`/shop/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-brand"
          >
            <Copy value={product.title} label="product name" />
          </Link>
        </Heading>

        <Price price={price} compareAt={product.compareAtPrice} className="mt-0.5" />
      </div>

      {!product.availableForSale ? (
        <Badge tone="inert" className="self-start">
          {ui.soldOut}
        </Badge>
      ) : null}
    </CardHover>
  );
}
