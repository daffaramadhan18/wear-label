import { HeroCarousel } from "@/components/home/hero-carousel";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { MadeToOrder } from "@/components/home/made-to-order";
import { TestimonialWall } from "@/components/home/testimonial-wall";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { home, ui } from "@/lib/content/site";
import { getFeaturedProducts } from "@/lib/shopify";

/**
 * Home, top to bottom: hero, new arrivals, customer voices, made-to-order,
 * Instagram strip.
 *
 * Shorter than the design's sequence: the limited-run band, the category mosaic
 * and the service band were cut from the page. All three components are still in
 * `components/home/` and their copy is still in `lib/content/site.ts`, so putting
 * any of them back is an edit to this file alone.
 *
 * Every photograph on the page comes out of the catalogue rather than being art
 * directed separately, so the page cannot drift out of step with what is in stock.
 *
 * Only the hero animates on load. Everything below it reveals on scroll, which is
 * the design system's rule for a page this long.
 *
 * Each block below carries its own top spacing (`pt-section` / `mt-section`), so
 * the vertical rhythm holds whichever of them are present.
 */

const CARD_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

export default async function HomePage() {
  const products = await getFeaturedProducts(11);

  return (
    <>
      <HeroCarousel slides={home.hero.slides} label={ui.heroLabel} />

      <section aria-labelledby="arrivals-heading" className="pt-section">
        <Container className="flex flex-col gap-10">
          <Reveal className="flex flex-col items-center gap-3">
            <h2 id="arrivals-heading" className="text-center text-h1 leading-h1">
              {home.arrivals.heading}
            </h2>
            {/* The design's short rule under a centred heading. Decorative, so it
                is a div rather than an <hr>: there is no section break here. */}
            <div aria-hidden="true" className="h-0.75 w-16 rounded-pill bg-brand" />
          </Reveal>

          <Stagger className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} sizes={CARD_SIZES} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="flex justify-center">
            <ButtonLink href={home.arrivals.href} variant="outline" size="lg">
              {home.arrivals.cta}
              <ArrowRightIcon className="size-5" />
            </ButtonLink>
          </Reveal>
        </Container>
      </section>

      <Reveal>
        <TestimonialWall heading={home.voices.heading} reviews={home.voices.reviews} />
      </Reveal>

      <Reveal>
        <MadeToOrder
          id="made-to-order-heading"
          eyebrow={home.madeToOrder.eyebrow}
          heading={home.madeToOrder.heading}
          body={home.madeToOrder.body}
          cta={home.madeToOrder.cta}
          href={home.madeToOrder.href}
          stats={home.madeToOrder.stats}
        />
      </Reveal>

      <Reveal>
        <InstagramStrip
          heading={home.instagram.heading}
          images={products.map((product) => product.featuredImage)}
        />
      </Reveal>
    </>
  );
}
