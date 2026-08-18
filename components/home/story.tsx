import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Media } from "@/components/ui/media";
import { story } from "@/lib/content/site";
import type { Image } from "@/lib/shopify";

/** Company-profile block: who the house is, in its own words. */
export function Story({ image }: { image: Image }) {
  return (
    <section aria-labelledby="story-heading" className="bg-surface py-section">
      <Container>
        <div className="grid items-start gap-block-lg lg:grid-cols-[0.85fr_1fr]">
          <div className="wl-reveal">
            <Media image={image} sizes="(min-width: 1024px) 42vw, 100vw" className="rounded-lg" />
          </div>

          <div className="wl-reveal">
            <Eyebrow>{story.eyebrow}</Eyebrow>
            <h2 id="story-heading" className="mt-4 text-h2">
              {story.heading}
            </h2>

            <div className="mt-7 flex flex-col gap-5 wl-measure text-body-lg leading-relaxed text-ink-muted">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <blockquote className="mt-block border-l-2 border-clay-fill pl-6">
              <p className="font-display text-h3 text-ink">{story.quote.text}</p>
              <footer className="mt-3 text-caption text-ink-muted">
                — {story.quote.attribution}
              </footer>
            </blockquote>

            <dl className="mt-block grid grid-cols-3 gap-6 border-t border-hairline pt-7">
              {story.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span
                      className="block font-display text-h3 text-ink"
                      data-numeric
                    >
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-caption text-ink-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-block">
              <ButtonLink href={story.cta.href} variant="quiet">
                {story.cta.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
