import type { ReactNode } from "react";
import { Container } from "./container";

/**
 * Vertical rhythm + optional background band. Section spacing is a single token
 * (`--spacing-section`), so the page's cadence is tuned in one place.
 */
export function Section({
  id,
  tone = "canvas",
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  tone?: "canvas" | "surface" | "sand" | "invert";
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const tones = {
    canvas: "bg-canvas text-ink",
    surface: "bg-surface text-ink",
    sand: "bg-sand text-ink",
    invert: "wl-on-dark bg-invert text-ink-invert",
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative py-section ${tones[tone]} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Heading block shared by every section: eyebrow + h2 + optional lead. */
export function SectionHeading({
  id,
  eyebrow,
  heading,
  body,
  tone = "canvas",
  align = "start",
  action,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  body?: string;
  tone?: "canvas" | "invert";
  align?: "start" | "center";
  action?: ReactNode;
}) {
  const isInvert = tone === "invert";

  return (
    <div
      className={`flex flex-col gap-6 ${
        align === "center" ? "items-center text-center" : ""
      } ${action ? "md:flex-row md:items-end md:justify-between" : ""}`}
    >
      <div className={`wl-measure ${align === "center" ? "mx-auto" : ""}`}>
        <p
          className={`text-eyebrow font-medium uppercase tracking-eyebrow ${
            isInvert ? "text-ink-invert-muted" : "text-ink-accent"
          }`}
        >
          {eyebrow}
        </p>
        <h2 id={id} className="mt-4 text-h2">
          {heading}
        </h2>
        {body ? (
          <p
            className={`mt-5 text-lead leading-relaxed ${
              isInvert ? "text-ink-invert-muted" : "text-ink-muted"
            }`}
          >
            {body}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
