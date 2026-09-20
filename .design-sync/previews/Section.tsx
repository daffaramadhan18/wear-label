import { Section, SectionHeading, Eyebrow } from "wear-label";
import { home } from "@/lib/content/site";

/**
 * Vertical rhythm plus an optional background band.
 *
 * The padding is one token (`--spacing-section`, 80–96px), so the page's cadence is
 * tuned in one place. **Section wraps its children in `Container` — you do not need
 * both.**
 */

/** The default surface tone: the white page shell every band sits on. */
export const Canvas = () => (
  <Section>
    <div className="flex flex-col gap-3">
      <Eyebrow>New arrivals</Eyebrow>
      <SectionHeading
        id="preview-section-canvas"
        heading={home.arrivals.heading}
        body=""
      />
    </div>
  </Section>
);

/** `muted` for an alternating band, so consecutive sections stay distinguishable. */
export const Muted = () => (
  <Section tone="muted">
    <SectionHeading
      id="preview-section-muted"
      heading={home.voices.heading}
      body="Twenty reviews, reproduced exactly as they were written."
    />
  </Section>
);

/** Two tones stacked, which is how the alternation actually reads down a page. */
export const Alternating = () => (
  <div>
    <Section>
      <p className="text-body text-ink-muted">Canvas section</p>
    </Section>
    <Section tone="muted">
      <p className="text-body text-ink-muted">Muted section</p>
    </Section>
    <Section>
      <p className="text-body text-ink-muted">Canvas section</p>
    </Section>
  </div>
);
