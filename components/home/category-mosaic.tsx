import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Media } from "@/components/ui/media";
import type { Image } from "@/lib/shopify";

/**
 * The category mosaic — one tall tile and four small ones, each a real catalogue
 * filter. The label sits on the photograph, so it carries its own surface (a solid
 * chip on the small tiles, a heavier weight on the tall one) rather than relying on
 * the crop staying dark enough to read against.
 *
 * The photographs are the leading piece from each category, passed in by the page,
 * so the mosaic never needs its own art direction to stay in step with the
 * catalogue.
 */
interface Tile {
  label: string;
  href: string;
}

export function CategoryMosaic({
  feature,
  tiles,
  images,
  label,
}: {
  feature: { eyebrow: string; label: string; href: string };
  tiles: readonly Tile[];
  /** One per tile, feature first. */
  images: Image[];
  /** Names the region — it is a set of links, not a heading. */
  label: string;
}) {
  return (
    <Container className="pt-section">
      <nav aria-label={label} className="grid gap-7 md:grid-cols-2">
        <Link
          href={feature.href}
          className="group relative flex h-112 items-start overflow-hidden rounded-sm"
        >
          <Media
            image={images[0] ?? { url: null, altText: "", width: 900, height: 900 }}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            label="Category photo"
            className="rounded-none"
          />
          <span className="relative flex flex-col gap-2 bg-invert/85 px-8 py-6 text-ink-invert transition-colors duration-(--duration-base) group-hover:bg-invert">
            <span className="text-micro uppercase tracking-label">{feature.eyebrow}</span>
            <span className="font-display text-h2 leading-h2">{feature.label}</span>
          </span>
        </Link>

        <ul className="grid gap-7 sm:grid-cols-2">
          {tiles.map((tile, index) => (
            <li key={tile.href}>
              <Link
                href={tile.href}
                className="group relative flex h-52 items-end justify-end overflow-hidden rounded-sm"
              >
                <Media
                  image={images[index + 1] ?? { url: null, altText: "", width: 900, height: 900 }}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  label="Category photo"
                  className="rounded-none"
                />
                <span
                  className={`relative px-5 py-3.5 text-micro uppercase tracking-label transition-colors duration-(--duration-base) ${
                    index % 2 === 0
                      ? "bg-invert text-ink-invert group-hover:bg-invert-hover"
                      : "bg-brand text-on-brand group-hover:bg-brand-hover"
                  }`}
                >
                  {tile.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
