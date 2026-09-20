import Link from "next/link";
import { Media } from "@/components/ui/media";
import { Eyebrow } from "@/components/ui/section";
import type { Image } from "@/lib/shopify";

/**
 * The two bands under the catalogue banner: a photograph with a label plate, and a
 * copy block with the garment filling its right edge. Both are single links, so the
 * whole band is the target rather than just the words on it.
 *
 * A band whose heading is empty renders a placeholder-free plate; the layout is the
 * same either way.
 */
export interface Promo {
  eyebrow: string;
  heading: string;
  cta: string;
  href: string;
}

export function ShopPromos({ promos, images }: { promos: readonly Promo[]; images: Image[] }) {
  if (promos.length === 0) return null;

  return (
    <ul className="grid gap-block md:grid-cols-2">
      {promos.map((promo, index) => (
        <li key={promo.href}>
          {index === 0 ? (
            <Link
              href={promo.href}
              className="group relative flex h-52 items-center justify-end overflow-hidden rounded-sm"
            >
              <Media
                image={images[index] ?? { url: null, altText: "", width: 1200, height: 600 }}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                label="Campaign photo"
                className="rounded-none"
              />
              <span className="relative bg-invert px-5 py-4 text-label font-medium uppercase tracking-label text-ink-invert transition-colors duration-(--duration-base) group-hover:bg-invert-hover">
                {promo.heading}
              </span>
            </Link>
          ) : (
            <Link
              href={promo.href}
              className="group relative flex h-52 items-center overflow-hidden rounded-sm bg-surface-muted pl-7"
            >
              <span className="pointer-events-none absolute inset-y-0 right-0 hidden w-[45%] sm:block">
                <Media
                  image={images[index] ?? { url: null, altText: "", width: 900, height: 900 }}
                  fill
                  sizes="25vw"
                  label="Campaign photo"
                  className="rounded-none"
                />
              </span>
              <span className="relative flex flex-col gap-1">
                <Eyebrow className="font-medium tracking-label text-ink">{promo.eyebrow}</Eyebrow>
                <strong className="font-display text-h2 font-medium leading-h2 text-ink">
                  {promo.heading}
                </strong>
                <span className="mt-3 text-caption font-medium uppercase tracking-wide text-brand transition-colors duration-(--duration-base) group-hover:text-brand-hover">
                  {promo.cta}
                </span>
              </span>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
