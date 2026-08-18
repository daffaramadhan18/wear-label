import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { hero } from "@/lib/content/site";
import type { Image } from "@/lib/shopify";

/**
 * Above-the-fold hero. The image is `priority` so it is not lazy-loaded, and its
 * aspect ratio is reserved, so the largest element on the page cannot shift.
 * Entrance motion is a one-shot fade-and-rise, skipped under reduced motion.
 */
export function Hero({ image }: { image: Image }) {
  return (
    <section aria-labelledby="hero-heading" className="wl-grain relative overflow-hidden bg-canvas">
      <Container className="py-section">
        <div className="grid items-center gap-block-lg lg:grid-cols-[1fr_0.95fr]">
          <div className="wl-rise">
            <p className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-accent">
              {hero.eyebrow}
            </p>
            <h1 id="hero-heading" className="mt-6 text-h1 leading-tight">
              {hero.heading}
            </h1>
            <p className="mt-7 wl-measure text-lead leading-relaxed text-ink-muted">
              {hero.body}
            </p>
            <div className="mt-block flex flex-wrap items-center gap-4">
              <ButtonLink href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRightIcon className="size-5" />
              </ButtonLink>
              <ButtonLink href={hero.secondaryCta.href} variant="outline" size="lg">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </div>

          <figure className="wl-rise wl-delay-2 m-0">
            <Media
              image={image}
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              shape="wl-arch"
              className="shadow-lg"
            />
            <figcaption className="mt-4 text-caption text-ink-muted">{hero.caption}</figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
