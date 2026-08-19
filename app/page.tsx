import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { Media } from "@/components/ui/media";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { ProductCard } from "@/components/shop/product-card";
import { home } from "@/lib/content/site";
import { getFeaturedProducts, type Image } from "@/lib/shopify";

/**
 * Home — two sections only: a hero at the system's Display step, and a short strip
 * of products that leads into `/shop`. Everything else a brand-led landing page
 * usually carries (lookbook, story, materials, testimonials, newsletter) is
 * deliberately not here.
 */

const HERO_IMAGE: Image = { url: null, altText: "", width: 900, height: 1200 };

const CARD_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      <section aria-labelledby="hero-heading" className="bg-canvas">
        <Container className="py-section">
          <div className="grid items-center gap-block-lg lg:grid-cols-[1fr_0.85fr]">
            {/* The hero is the one place on the site where motion runs on load
                rather than on scroll, and the only one that arrives in sequence:
                eyebrow, headline, intro, action — the order it is read in. Four
                lines at 70ms apart read as one gesture, where the same four moving
                together read as a flicker. The photograph follows a beat later. */}
            <Stagger as="div" on="mount">
              <StaggerItem as="div" on="mount">
                <Eyebrow className="block">
                  <Copy value={home.hero.eyebrow} label="eyebrow" className="max-w-40" />
                </Eyebrow>
              </StaggerItem>

              <StaggerItem as="div" on="mount" className="mt-6">
                <h1
                  id="hero-heading"
                  className="text-display leading-display tracking-display"
                >
                  <Copy value={home.hero.heading} label="headline" lines={2} />
                </h1>
              </StaggerItem>

              <StaggerItem as="div" on="mount" className="mt-7">
                <p className="wl-measure text-body leading-body text-ink-muted">
                  <Copy value={home.hero.body} label="intro" lines={3} />
                </p>
              </StaggerItem>

              <StaggerItem as="div" on="mount" className="mt-block">
                <ButtonLink href="/shop" size="lg">
                  <Copy value={home.hero.cta} label="cta" inline />
                </ButtonLink>
              </StaggerItem>
            </Stagger>

            <Reveal on="mount" delay={0.34}>
              <Media
                image={HERO_IMAGE}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                label="Hero photo"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="muted" labelledBy="featured-heading">
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

        <Stagger className="mt-block-lg grid gap-block sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} sizes={CARD_SIZES} />
            </StaggerItem>
          ))}
        </Stagger>
      </Section>
    </>
  );
}
