import { Section, SectionHeading } from "@/components/ui/section";
import { process } from "@/lib/content/site";

/** Dark band. Changes the page's rhythm and marks the shift from product to craft. */
export function Process() {
  return (
    <Section tone="invert" labelledBy="process-heading" className="wl-grain overflow-hidden">
      <SectionHeading
        id="process-heading"
        eyebrow={process.eyebrow}
        heading={process.heading}
        tone="invert"
      />

      <ol className="mt-block-lg grid gap-block md:grid-cols-2 lg:grid-cols-4">
        {process.steps.map((step, index) => (
          <li key={step.title} className="wl-reveal border-t border-ink-invert/25 pt-6">
            <span
              className="font-display text-h2 text-clay-fill"
              data-numeric
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-body text-body-lg font-medium text-ink-invert">
              <span className="sr-only">Step {index + 1}: </span>
              {step.title}
            </h3>
            <p className="mt-3 text-caption leading-relaxed text-ink-invert-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
