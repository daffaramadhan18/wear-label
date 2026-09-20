import Link from "next/link";
import { ui } from "@/lib/content/site";
import { catalogueHref, type CatalogueQuery } from "@/lib/shopify";

/**
 * Paging. Links, like the filters, so a page is a real URL and the back button
 * works. The current page is not a link — it carries `aria-current="page"`, which
 * is what tells a screen reader where it is; the fill is not doing that job alone.
 *
 * A single page of results renders nothing.
 */
export function Pagination({
  query,
  page,
  pageCount,
}: {
  query: CatalogueQuery;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <nav
      aria-label={ui.pagination}
      className="flex flex-wrap items-center gap-2 border-t border-hairline pt-6"
    >
      <ul className="flex flex-wrap items-center gap-2">
        {pages.map((entry) => {
          const current = entry === page;

          return (
            <li key={entry}>
              {current ? (
                <span
                  aria-current="page"
                  data-numeric
                  className="inline-flex size-10 items-center justify-center rounded-xs border border-brand bg-brand text-caption text-on-brand"
                >
                  {entry}
                </span>
              ) : (
                <Link
                  href={catalogueHref(query, { page: entry })}
                  data-numeric
                  className="wl-tap inline-flex size-10 items-center justify-center rounded-xs border border-line text-caption text-ink-muted transition-colors duration-(--duration-base) hover:border-brand hover:text-brand"
                >
                  {entry}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <p className="ml-2 text-caption text-ink-subtle">
        {ui.page} <span data-numeric>{page}</span> of <span data-numeric>{pageCount}</span>
      </p>
    </nav>
  );
}
