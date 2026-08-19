import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { Section, SectionHeading } from "@/components/ui/section";
import { ProductCard } from "@/components/shop/product-card";
import { home } from "@/lib/content/site";
import { getFeaturedProducts, type Image } from "@/lib/shopify";

/**
 * Home — two sections only: a hero and a short strip of products that leads into
 * `/shop`. Everything else a brand-led landing page usually carries (lookbook,
 * story, materials, testimonials, newsletter) is deliberately not here.
 */

const HERO_IMAGE: Image = { url: null, altText: "", width: 1200, height: 1400 };

const CARD_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      <section aria-labelledby="hero-heading" className="bg-canvas">
        <Container className="py-section">
          <div className="grid items-center gap-block-lg lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-accent">
                <Copy value={home.hero.eyebrow} label="eyebrow" className="max-w-40" />
              </p>
              <h1 id="hero-heading" className="mt-6 text-h1 leading-tight">
                <Copy value={home.hero.heading} label="headline" lines={2} />
              </h1>
              <p className="mt-7 wl-measure text-lead leading-relaxed text-ink-muted">
                <Copy value={home.hero.body} label="intro" lines={3} />
              </p>
              <div className="mt-block">
                <ButtonLink href="/shop" size="lg">
                  <Copy value={home.hero.cta} label="cta" inline />
                  <ArrowRightIcon className="size-5" />
                </ButtonLink>
              </div>
            </div>

            <Media
              image={HERO_IMAGE}
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              label="hero image"
            />
          </div>
        </Container>
      </section>

      <Section tone="sand" labelledBy="featured-heading">
        <SectionHeading
          id="featured-heading"
          heading={home.featured.heading}
          body={home.featured.body}
          action={
            <ButtonLink href="/shop" variant="outline">
              <Copy value={home.featured.cta} label="cta" inline />
            </ButtonLink>
          }
        />

        <ul className="mt-block-lg grid gap-block sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} sizes={CARD_SIZES} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
