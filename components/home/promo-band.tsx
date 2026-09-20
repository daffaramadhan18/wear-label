import { AuroraBand } from "@/components/ui/aurora";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Media } from "@/components/ui/media";
import { Eyebrow } from "@/components/ui/section";
import type { Image } from "@/lib/shopify";
import { Countdown } from "./countdown";

/**
 * The limited-run band: copy on the aurora, the garment filling the right-hand
 * edge. The countdown appears only when the run has an end date in
 * `lib/content/site.ts` — see the note there on why it is empty.
 */
export function PromoBand({
  eyebrow,
  heading,
  cta,
  href,
  endsAt,
  image,
}: {
  eyebrow: string;
  heading: string;
  cta: string;
  href: string;
  endsAt: string;
  image: Image;
}) {
  return (
    <Container className="pt-section">
      <AuroraBand as="div" tone="inert" origin="bottom-left" className="bg-inert">
        <div className="relative flex min-h-70 items-center md:min-h-125">
          {/* Behind the copy, and only from md up: at narrow widths the crop would
              be a sliver, and the text would be reading against a garment. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] md:block">
            <Media image={image} fill sizes="46vw" label="Campaign photo" className="rounded-none" />
          </div>

          <div className="relative flex max-w-140 flex-col items-start gap-5 p-6 md:gap-6 md:p-14">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="text-h1 leading-h1">{heading}</h2>
            <Countdown endsAt={endsAt} />
            <ButtonLink href={href} variant="outline">
              {cta}
            </ButtonLink>
          </div>
        </div>
      </AuroraBand>
    </Container>
  );
}
