import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "link" | "checkout";
type Size = "sm" | "md" | "lg" | "full";

/**
 * Buttons, per the design system's Buttons section.
 *
 * Labels are always uppercase at 0.2em tracking, and one primary button per
 * screen. Hover changes the fill, the pressed state nudges 1px down, and focus
 * uses the system ring (see globals.css for the contrast note on it).
 *
 * `checkout` is the system's espresso full-bleed action; `link` is the underlined
 * text action ("Size guide") and is the one variant that is not uppercase.
 */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand border border-brand hover:bg-brand-hover hover:border-brand-hover active:translate-y-px",
  outline:
    "bg-transparent text-brand border border-ink-subtle hover:bg-brand hover:border-brand hover:text-on-brand active:translate-y-px",
  ghost:
    "bg-transparent text-ink-muted border border-transparent hover:bg-surface-muted active:translate-y-px",
  link: "bg-transparent text-brand border-0 border-b border-line rounded-none hover:border-brand",
  checkout:
    "w-full bg-invert text-ink-invert border border-invert hover:bg-invert-hover hover:border-invert-hover active:translate-y-px",
};

/** Sizes from the system: small · medium · large, plus the full-width action. */
const SIZES: Record<Size, string> = {
  sm: "min-h-11 px-5 text-micro tracking-nav",
  md: "min-h-11 px-7 text-label tracking-label",
  lg: "min-h-13 px-11 text-caption tracking-[0.22em]",
  full: "min-h-13 w-full px-6 text-label tracking-label",
};

/** Only a real `<button>` can be disabled, so links do not carry these. */
const DISABLED =
  "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-on-disabled disabled:translate-y-0";

function classes(variant: Variant, size: Size, className: string, disableable: boolean) {
  const isLink = variant === "link";

  return [
    "inline-flex items-center justify-center gap-2",
    isLink ? "" : "rounded-sm uppercase",
    isLink ? "px-0.5 py-2 text-caption tracking-[0.04em]" : SIZES[size],
    "cursor-pointer transition-[background-color,color,border-color,transform] duration-(--duration-base) ease-out",
    disableable ? DISABLED : "",
    VARIANTS[variant],
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
    <button className={classes(variant, size, className, true)} {...props}>
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
    <Link href={href} className={classes(variant, size, className, false)} {...props}>
      {children}
    </Link>
  );
}
