import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "quiet";
type Size = "md" | "lg";

/**
 * Shared action styling. Every screen keeps a single `primary` action; other
 * actions use `outline` or `quiet` so the hierarchy stays readable.
 *
 * Minimum control height is 44px (comfortably over the 24px WCAG 2.2 web target
 * minimum) and the outline variant uses `border-line`, which clears 3:1 against
 * the canvas.
 *
 * Every variant has a distinct pressed state as well as hover, so touch users —
 * who never see hover — still get confirmation that the press landed. The press
 * feedback is a colour change, not a transform, so it cannot shift layout.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active border border-transparent",
  secondary:
    "bg-secondary text-on-secondary hover:bg-secondary-hover active:bg-secondary-active border border-transparent",
  outline:
    "bg-transparent text-ink border border-line hover:bg-sand hover:border-ink active:bg-sand-strong active:border-ink",
  quiet:
    "bg-transparent text-ink border border-transparent underline decoration-1 underline-offset-4 decoration-line hover:decoration-ink active:text-ink-accent active:decoration-ink-accent",
};

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-5 text-caption",
  lg: "min-h-13 px-7 text-body",
};

function classes(variant: Variant, size: Size, className: string) {
  return [
    "inline-flex items-center justify-center gap-2 rounded-pill font-medium",
    "cursor-pointer transition-colors duration-[var(--duration-base)] ease-out",
    "disabled:cursor-not-allowed disabled:opacity-45",
    VARIANTS[variant],
    SIZES[size],
    className,
  ].join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <button className={classes(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; children: ReactNode }) {
  return (
    <Link href={href} className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
