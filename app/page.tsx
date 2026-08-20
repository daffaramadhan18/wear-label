import { CategoryMosaic } from "@/components/home/category-mosaic";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { ServiceBand } from "@/components/home/service-band";
import { TestimonialWall } from "@/components/home/testimonial-wall";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { home, ui } from "@/lib/content/site";
import { getFeaturedProducts, QUERY_KEYS, TAGS } from "@/lib/shopify";
import type { Image, Product } from "@/lib/shopify";

/**
 * Home, top to bottom: hero, new arrivals, customer voices, the category mosaic,
 * the service band, Instagram strip.
 *
 * Shorter than the design's sequence: the limited-run band is cut from the page.
 * The component and its copy both remain, so putting it back is an edit to this
 * file alone.
 *
 * The made-to-order band is a different case and is **not** a candidate for
 * restoring. The studio does not offer that service, so its heading, its three
 * stats and its CTA are claims nobody can honour (confirmed 2026-08-20, see
 * PRODUCT.md). It has been taken out, and the mosaic and the service band — the
 * design's own pairing — took the slot it held.
 *
 * That is a **deviation from the design's block order**, and a deliberate one. The
 * design put the mosaic and the service band above the voices wall and the
 * made-to-order band below it, and the block below the wall is the one that cannot
 * ship. Something has to stand between the wall and the Instagram strip — see the
 * note further down — so the pair moved rather than the page keeping its order and
 * losing the separation. Everything else about them is the design's: their order
 * relative to each other, their copy, and their markup.
 *
 * Both are true where the made-to-order band was not. Every mosaic destination is a
 * real catalogue query, and each of the band's three promises is stated elsewhere on
 * the site: the shipping threshold is the announcement bar's, the exchange is on
 * every product page, and fit advice over WhatsApp is what the customer reviews
 * describe the studio doing.
 *
 * Every photograph on the page comes out of the catalogue rather than being art
 * directed separately, so the page cannot drift out of step with what is in stock.
 *
 * Only the hero animates on load. Everything below it reveals on scroll, which is
 * the design system's rule for a page this long.
 *
 * Two things then keep moving: the voices wall and the Instagram strip. They are
 * placed so that no single viewport holds both — a page with several continuous
 * loops in view at once reads as restless rather than alive.
 *
 * Each block below carries its own top spacing (`pt-section` / `mt-section`), so
 * the vertical rhythm holds whichever of them are present.
 */

const CARD_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

export default async function HomePage() {
  const products = await getFeaturedProducts(11);

  /**
   * The mosaic's five photographs, feature tile first.
   *
   * Each tile is shot with the leading piece behind its own destination, read out of
   * the tile's href rather than listed here — so the tiles cannot drift out of step
   * with the catalogue, and adding one is still a change to `lib/content/site.ts`
   * alone. A piece is used once: without that, "Everything" and the feature tile
   * both land on the first piece in the catalogue and the mosaic shows the same
   * photograph twice.
   */
  const used = new Set<string>();

  const tileImage = (href: string): Image => {
    const query = new URLSearchParams(href.split("?")[1] ?? "");
    const category = query.get(QUERY_KEYS.category);
    const newestFirst = query.get(QUERY_KEYS.sort) === "newest";

    const matches = (product: Product) =>
      category
        ? product.productType === category
        : newestFirst
          ? product.tags.includes(TAGS.new)
          : true;

    const piece =
      products.find((product) => matches(product) && !used.has(product.handle)) ??
      products[0];

    used.add(piece.handle);
    return piece.featuredImage;
  };

  const mosaicImages = [
    tileImage(home.mosaic.feature.href),
    ...home.mosaic.tiles.map((tile) => tileImage(tile.href)),
  ];

  return (
    <>
      <HeroCarousel slides={home.hero.slides} label={ui.heroLabel} />

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

      {/*
        The voices wall and the Instagram strip below are NOT wrapped in <Reveal>,
        and that is the fix for two bugs rather than a preference.

        <Reveal> animates opacity, which makes its wrapper a stacking context and
        promotes it to its own layer. Around the voices wall that flattens the
        wall's `preserve-3d` scene: the plane's `translateZ(-100px)` stops pushing
        the cards behind the stage's fades, so the cards paint over them and the top
        of the wall ends in a hard edge instead of dissolving into the page. The same
        wrapper does the same damage to an <AuroraBand>'s `mix-blend-mode:
        soft-light`, which then blends against the wrapper instead of the page and
        shows up as a visible rectangle — that is why the made-to-order band was
        unwrapped while it stood in this slot, and it still governs the aurora in the
        footer and the bag.

        Neither needs an entrance anyway — each one is already the only thing moving
        in its own viewport, and the block between them is what keeps it that way.
      */}
      <TestimonialWall heading={home.voices.heading} reviews={home.voices.reviews} />

      {/* The two blocks between the loops. Neither carries a blend mode or a 3D
          scene, so unlike their neighbours they reveal on scroll like the rest of
          the page. */}
      <Reveal>
        <CategoryMosaic
          feature={home.mosaic.feature}
          tiles={home.mosaic.tiles}
          images={mosaicImages}
          label={ui.shopByCategory}
        />
      </Reveal>

      <Reveal>
        <ServiceBand services={home.services} />
      </Reveal>

      <InstagramStrip
        heading={home.instagram.heading}
        images={products.map((product) => product.featuredImage)}
      />
    </>
  );
}
