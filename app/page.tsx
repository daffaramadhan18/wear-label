import { HeroCarousel } from "@/components/home/hero-carousel";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { MadeToOrder } from "@/components/home/made-to-order";
import { TestimonialWall } from "@/components/home/testimonial-wall";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";
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
 * Three things then keep moving: the floating-paths wash behind New arrivals, the
 * voices wall, and the Instagram strip. They are placed so that no single viewport
 * holds more than one of them — a page with several continuous loops in view at once
 * reads as restless rather than alive, and the wash is the one that had to be given
 * a home rather than the whole white stretch to sit under.
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

      {/* The wash sits behind New arrivals and nowhere else on this page. Two
          reasons, both of them limits rather than taste: the strands must not run
          under the voices wall or the Instagram strip, which are already the one
          thing moving in their own viewport, and the artwork is landscape — it
          reads as line work across a band and as steep verticals down a page. */}
      <FloatingPathsBackground position={-1} tone="subtle">
        <section aria-labelledby="arrivals-heading" className="pt-section">
          <Container className="flex flex-col gap-10">
            <Reveal className="flex flex-col items-center gap-3">
              <h2 id="arrivals-heading" className="text-center text-h1 leading-h1">
                {home.arrivals.heading}
              </h2>
              {/* The design's short rule under a centred heading. Decorative, so
                  it is a div rather than an <hr>: there is no section break. */}
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
      </FloatingPathsBackground>

      {/*
        The three blocks below are NOT wrapped in <Reveal>, and that is the fix for
        two bugs rather than a preference.

        <Reveal> animates opacity, which makes its wrapper a stacking context and
        promotes it to its own layer. Around the voices wall that flattens the
        wall's `preserve-3d` scene: the plane's `translateZ(-100px)` stops pushing
        the cards behind the stage's fades, so the cards paint over them and the top
        of the wall ends in a hard edge instead of dissolving into the page. Around
        an <AuroraBand> it does the same damage to `mix-blend-mode: soft-light`,
        which then blends against the wrapper instead of the page and shows up as a
        visible rectangle.

        None of the three needs an entrance anyway — each one is already the only
        thing moving in its own viewport.
      */}
      <TestimonialWall heading={home.voices.heading} reviews={home.voices.reviews} />

      <MadeToOrder
        id="made-to-order-heading"
        eyebrow={home.madeToOrder.eyebrow}
        heading={home.madeToOrder.heading}
        body={home.madeToOrder.body}
        cta={home.madeToOrder.cta}
        href={home.madeToOrder.href}
        stats={home.madeToOrder.stats}
      />

      <InstagramStrip
        heading={home.instagram.heading}
        images={products.map((product) => product.featuredImage)}
      />
    </>
  );
}
