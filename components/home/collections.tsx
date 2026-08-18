import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Collection } from "@/lib/shopify";

const CARD_SIZES = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw";

export function Collections({ collections }: { collections: Collection[] }) {
  return (
    <Section labelledBy="collections-heading">
      <SectionHeading
        id="collections-heading"
        eyebrow="Collections"
        heading="Three ways we work."
        body="Every piece belongs to one of these, and each is limited by a different constraint — the season, the pattern, or the cloth we could find."
      />

      <ul className="mt-block-lg grid gap-block md:grid-cols-3">
        {collections.map((collection) => (
          <li key={collection.id}>
            <article className="wl-reveal group relative flex flex-col">
              <Media
                image={collection.image}
                sizes={CARD_SIZES}
                className="rounded-md transition-transform duration-[var(--duration-slow)] ease-out motion-safe:group-hover:scale-[1.015]"
              />
              <h3 className="mt-6 font-display text-h3">
                <Link
                  href={`/collections/${collection.handle}`}
                  className="after:absolute after:inset-0 after:content-[''] hover:text-ink-accent"
                >
                  {collection.title}
                </Link>
              </h3>
              <p className="mt-3 text-caption leading-relaxed text-ink-muted">
                {collection.description}
              </p>
              <p className="mt-5 inline-flex items-center gap-2 text-caption font-medium text-ink-accent">
                <span data-numeric>{collection.productCount}</span> pieces
                <ArrowRightIcon className="size-4 transition-transform duration-[var(--duration-base)] ease-out motion-safe:group-hover:translate-x-1" />
              </p>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
