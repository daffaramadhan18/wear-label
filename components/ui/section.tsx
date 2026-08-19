import type { ReactNode } from "react";
import { Copy } from "./copy";
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
  tone?: "canvas" | "sand";
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  const tones = {
    canvas: "bg-canvas text-ink",
    sand: "bg-sand text-ink",
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

/** The `h1` block at the top of a page. Text resolves through `<Copy>`. */
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
      <h1 id={id} className="text-h1 leading-tight">
        <Copy value={heading} label="page heading" />
      </h1>
      <p className="mt-7 text-lead leading-relaxed text-ink-muted">
        <Copy value={body} label="intro" lines={2} />
      </p>
    </div>
  );
}

/** The `h2` block at the top of a section, with an optional trailing action. */
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
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="wl-measure">
        <h2 id={id} className="text-h2">
          <Copy value={heading} label="heading" />
        </h2>
        <p className="mt-5 text-body-lg leading-relaxed text-ink-muted">
          <Copy value={body} label="body" lines={2} />
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
