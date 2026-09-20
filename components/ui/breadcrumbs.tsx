import Link from "next/link";

/**
 * Breadcrumb trail. The last entry is the current page and is not a link — it
 * carries `aria-current="page"` instead, so the trail reads as a position rather
 * than as a set of destinations.
 */
export function Breadcrumbs({
  trail,
  className = "",
}: {
  /** Ancestors first, current page last. Only the last may omit `href`. */
  trail: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2.5 text-caption text-ink-subtle">
        {trail.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`} className="flex items-center gap-2.5">
            {index > 0 ? (
              <span aria-hidden="true" className="text-line">
                /
              </span>
            ) : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="transition-colors duration-(--duration-base) hover:text-brand"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
