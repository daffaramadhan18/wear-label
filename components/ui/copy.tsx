/**
 * Copy renderer + placeholder.
 *
 * Brand copy has not been written, so `lib/content/site.ts` holds empty strings.
 * Wherever text belongs, `<Copy>` renders either the real string or a labelled
 * placeholder block sized in `em` — so a heading placeholder is heading-sized and
 * a caption placeholder caption-sized, and the page's rhythm is already the final
 * one. Filling in the content module replaces every block with text; no component
 * changes, no layout shift.
 *
 * The block is exposed as an image with the field name as its accessible label,
 * so assistive tech announces "heading placeholder" rather than silence.
 */

/** Line widths cycle so multi-line blocks read as prose, not as a solid slab. */
const LINE_WIDTHS = ["100%", "92%", "68%", "84%", "56%"];

export function Copy({
  value,
  label,
  lines = 1,
  inline = false,
  className = "",
}: {
  value: string;
  /** Field name shown on the placeholder, e.g. "heading", "product name". */
  label: string;
  lines?: number;
  /** Bar and label side by side — for short strings inside a control. */
  inline?: boolean;
  className?: string;
}) {
  if (value) return <>{value}</>;

  if (inline) {
    return (
      <span
        role="img"
        aria-label={`${label} placeholder`}
        className={`inline-flex items-center gap-2 ${className}`}
      >
        <span aria-hidden="true" className="block h-[0.7em] w-12 rounded-xs bg-current opacity-30" />
        <span
          aria-hidden="true"
          className="font-body text-micro font-normal uppercase tracking-nav opacity-70"
        >
          {label}
        </span>
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`${label} placeholder`}
      className={`inline-flex w-full flex-col gap-[0.4em] align-middle ${className}`}
    >
      {Array.from({ length: lines }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="block h-[0.7em] rounded-xs bg-surface-muted"
          style={{ width: LINE_WIDTHS[index % LINE_WIDTHS.length] }}
        />
      ))}
      <span
        aria-hidden="true"
        className="font-body text-micro font-normal uppercase tracking-nav text-ink-subtle"
      >
        {label}
      </span>
    </span>
  );
}
