import Link from "next/link";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import type { Product } from "@/lib/shopify";

/**
 * Catalogue card.
 *
 * The whole card is one link (the title anchor stretched over the media) so
 * there is a single tab stop per product and no nested interactive elements.
 * Sold-out sizes are listed as text rather than by colour alone.
 */
export function ProductCard({
  product,
  sizes,
}: {
  product: Product;
  sizes: string;
}) {
  const soldOut = product.options
    .find((option) => option.name === "Size")
    ?.values.filter((value) => !value.available)
    .map((value) => value.name);

  return (
    <article className="wl-reveal group relative flex flex-col">
      <Media
        image={product.featuredImage}
        sizes={sizes}
        className="rounded-md transition-transform duration-[var(--duration-slow)] ease-out motion-safe:group-hover:scale-[1.015]"
      />

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h3 className="font-body text-body font-medium">
          <Link
            href={`/shop/${product.handle}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-ink-accent"
          >
            {product.title}
          </Link>
        </h3>
        <Price
          price={product.priceRange.minVariantPrice}
          compareAt={product.compareAtPrice}
          className="shrink-0 text-caption"
        />
      </div>

      <p className="mt-1.5 text-caption text-ink-muted">{product.subtitle}</p>

      {soldOut && soldOut.length > 0 ? (
        <p className="mt-2 text-caption text-ink-muted">
          Sold out in {soldOut.join(", ")}
        </p>
      ) : null}

      {product.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-pill bg-sand px-3 py-1 text-eyebrow uppercase tracking-eyebrow text-ink"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
