import type { ReactNode } from "react";
import { Copy } from "./copy";
import { Container } from "./container";

/**
 * Vertical rhythm + optional background band. Section spacing is one token
 * (`--spacing-section`, 80–96px per the system's spacing scale), so the page's
 * cadence is tuned in one place.
 */
export function Section({
  id,
  tone = "canvas",
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  tone?: "canvas" | "muted";
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const tones = {
    canvas: "bg-canvas",
    muted: "bg-surface-muted",
  } as const;

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`py-section ${tones[tone]} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

/** Small uppercase label in camel — the system's eyebrow. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`text-micro uppercase tracking-nav text-ink-subtle ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The `h1` block at the top of a page: heading at the H1 step with an intro below.
 * Text resolves through `<Copy>`, which renders a placeholder until copy exists.
 */
export function PageHeading({
  id,
  heading,
  body,
}: {
  id: string;
  heading: string;
  body: string;
}) {
  return (
    <div className="wl-measure">
      <h1 id={id} className="text-h1 leading-h1">
        <Copy value={heading} label="page heading" />
      </h1>
      <p className="mt-6 text-body leading-body text-ink-muted">
        <Copy value={body} label="intro" lines={2} />
      </p>
    </div>
  );
}

/**
 * Section header, following the system's own pattern: heading and eyebrow on one
 * baseline over a section rule, with an optional trailing action.
 */
export function SectionHeading({
  id,
  heading,
  body,
  action,
}: {
  id: string;
  heading: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4 border-b border-rule pb-4.5">
        <h2 id={id} className="text-h2 leading-h2">
          <Copy value={heading} label="heading" />
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <p className="wl-measure text-body leading-body text-ink-muted">
        <Copy value={body} label="body" lines={2} />
      </p>
    </div>
  );
}
