import { CategoryMosaic } from "@/components/home/category-mosaic";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { InstagramStrip } from "@/components/home/instagram-strip";
import { MadeToOrder } from "@/components/home/made-to-order";
import { PromoBand } from "@/components/home/promo-band";
import { ServiceBand } from "@/components/home/service-band";
import { TestimonialWall } from "@/components/home/testimonial-wall";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { home, ui } from "@/lib/content/site";
import { getFeaturedProducts, TAGS } from "@/lib/shopify";

/**
 * Home — the design's sequence, top to bottom: hero, limited-run band, new
 * arrivals, customer voices, category mosaic, service band, made-to-order,
 * Instagram strip.
 *
 * Every photograph on the page comes out of the catalogue rather than being art
 * directed separately, so the page cannot drift out of step with what is in stock.
 * The band images are chosen by meaning, not by position: the limited-run band shows
 * a piece actually flagged new, and the mosaic shows the leading piece of each
 * category it links to.
 *
 * Only the hero animates on load. Everything below it reveals on scroll, which is
 * the design system's rule for a page this long.
 */

const CARD_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

export default async function HomePage() {
  const products = await getFeaturedProducts(11);

  const promoProduct =
    products.find((product) => product.tags.includes(TAGS.new)) ?? products[0];

  /* One image per mosaic tile, feature first: the leading piece of the category
     that tile links to, falling back to catalogue order for the tiles that are not
     a single category. */
  const mosaicImages = [home.mosaic.feature, ...home.mosaic.tiles].map((tile, index) => {
    const category = new URLSearchParams(tile.href.split("?")[1] ?? "").get("category");

    const match = category
      ? products.find((product) => product.productType === category)
      : undefined;

    return (match ?? products[index % products.length]).featuredImage;
  });

  return (
    <>
      <HeroCarousel slides={home.hero.slides} label={ui.heroLabel} />

      <Reveal>
        <PromoBand
          eyebrow={home.promo.eyebrow}
          heading={home.promo.heading}
          cta={home.promo.cta}
          href={home.promo.href}
          endsAt={home.promo.endsAt}
          image={promoProduct.featuredImage}
        />
      </Reveal>

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
        <CategoryMosaic
          feature={home.mosaic.feature}
          tiles={home.mosaic.tiles}
          images={mosaicImages}
          label={ui.category}
        />
      </Reveal>

      <Reveal>
        <ServiceBand services={home.services} />
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
