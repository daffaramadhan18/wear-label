import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Media } from "@/components/ui/media";
import { lookbook } from "@/lib/content/site";
import type { Image } from "@/lib/shopify";

const RATIOS = [
  { width: 1200, height: 1500 },
  { width: 1200, height: 900 },
  { width: 1200, height: 900 },
  { width: 1200, height: 1500 },
] as const;

/**
 * Editorial grid. Deliberately not a carousel: a static grid needs no pause
 * control, no slide announcements and no keyboard slide navigation, and every
 * frame stays reachable by scroll alone.
 */
export function Lookbook() {
  const frames: Image[] = lookbook.frames.map((frame, index) => ({
    url: null, // → /lookbook/0{index + 1}.jpg
    altText: frame.alt,
    ...RATIOS[index],
  }));

  return (
    <section aria-labelledby="lookbook-heading" className="bg-surface py-section">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="wl-measure">
            <Eyebrow>{lookbook.eyebrow}</Eyebrow>
            <h2 id="lookbook-heading" className="mt-4 text-h2">
              {lookbook.heading}
            </h2>
            <p className="mt-5 text-lead leading-relaxed text-ink-muted">{lookbook.body}</p>
          </div>
          <ButtonLink href={lookbook.cta.href} variant="outline" className="shrink-0">
            {lookbook.cta.label}
          </ButtonLink>
        </div>

        <div className="mt-block-lg grid gap-4 sm:gap-block md:grid-cols-2">
          <div className="wl-reveal md:mt-block-lg">
            <Media image={frames[0]} sizes="(min-width: 768px) 46vw, 92vw" className="rounded-md" />
          </div>
          <div className="flex flex-col gap-4 sm:gap-block">
            <div className="wl-reveal">
              <Media
                image={frames[1]}
                sizes="(min-width: 768px) 46vw, 92vw"
                className="rounded-md"
              />
            </div>
            <div className="wl-reveal">
              <Media
                image={frames[2]}
                sizes="(min-width: 768px) 46vw, 92vw"
                className="rounded-md"
              />
            </div>
          </div>
          <div className="wl-reveal md:col-span-2 md:mx-auto md:w-2/3">
            <Media
              image={frames[3]}
              sizes="(min-width: 768px) 60vw, 92vw"
              shape="wl-arch"
              className="rounded-md"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
