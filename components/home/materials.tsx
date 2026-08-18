import { Section, SectionHeading } from "@/components/ui/section";
import { materials } from "@/lib/content/site";

export function Materials() {
  return (
    <Section tone="sand" labelledBy="materials-heading">
      <SectionHeading
        id="materials-heading"
        eyebrow={materials.eyebrow}
        heading={materials.heading}
        body={materials.body}
      />

      <dl className="mt-block-lg grid gap-x-block gap-y-block md:grid-cols-2">
        {materials.items.map((item, index) => (
          <div
            key={item.name}
            className="wl-reveal border-t border-ink/15 pt-6"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-display text-caption text-ink-muted" data-numeric>
                {String(index + 1).padStart(2, "0")}
              </span>
              <dt className="font-display text-h3">{item.name}</dt>
            </div>
            <dd className="mt-3 pl-10">
              <p className="text-eyebrow uppercase tracking-eyebrow text-ink-muted">
                {item.origin}
              </p>
              <p className="mt-3 wl-measure text-body leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
