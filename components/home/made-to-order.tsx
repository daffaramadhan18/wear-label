import { AuroraBand } from "@/components/ui/aurora";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";

/**
 * The made-to-order band — the one place on the page where the aurora runs at full
 * width. No photography sits on it, which is the rule for this effect: the wash is
 * for low-density bands, never behind a garment or the logotype.
 *
 * The design's second action ("How it works") is not here. There is no page for it
 * yet, and a button that goes nowhere is worse than one button.
 */
export function MadeToOrder({
  eyebrow,
  heading,
  body,
  cta,
  href,
  stats,
  id,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
  stats: readonly { value: string; label: string }[];
  id: string;
}) {
  return (
    <AuroraBand
      tone="canvas"
      origin="top-right"
      className="mt-section bg-canvas"
      aria-labelledby={id}
    >
      <div className="mx-auto grid max-w-content gap-block-lg px-gutter py-section lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-5.5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="max-w-[15ch] text-h1 leading-h1">
            {heading}
          </h2>
          <p className="wl-measure text-body leading-body text-ink-body">{body}</p>
          <ButtonLink href={href} size="lg" className="mt-2">
            {cta}
          </ButtonLink>
        </div>

        <dl className="flex flex-col gap-5 border-line pl-0 lg:border-l lg:pl-10">
          {stats.map((stat) => (
            <div key={stat.value} className="flex flex-col gap-1">
              <dt className="font-display text-h2 leading-h2 text-ink">{stat.value}</dt>
              <dd className="text-caption text-ink-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </AuroraBand>
  );
}
