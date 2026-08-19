import { Section, SectionHeading, Eyebrow } from "wear-label";

/**
 * Vertical rhythm plus an optional background band. The padding is one token
 * (`--spacing-section`, 80–96px), so the page's cadence is tuned in one place,
 * and Section wraps its children in Container — you do not need both.
 */

/** The default canvas tone — cream, the page background. */
export const Canvas = () => (
  <Section>
    <div className="flex flex-col gap-3">
      <Eyebrow>Section</Eyebrow>
      <SectionHeading
        id="preview-section-canvas"
        heading="Featured products"
        body="A short section introduction sits here, two lines at the body step."
      />
    </div>
  </Section>
);

/** `muted` for an alternating band, so consecutive sections stay distinguishable. */
export const Muted = () => (
  <Section tone="muted">
    <SectionHeading
      id="preview-section-muted"
      heading="From the atelier"
      body="A short section introduction sits here, two lines at the body step."
    />
  </Section>
);

/** Two tones stacked, which is how the alternation actually reads on a page. */
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
