import { ui } from "@/lib/content/site";
import { QUERY_KEYS, SORT_KEYS, SORT_LABELS, type CatalogueQuery } from "@/lib/shopify";

/**
 * The row above the grid: how many pieces are showing and what is narrowing them,
 * then the sort control.
 *
 * Sort is the one facet that stays a form rather than becoming a set of links — a
 * `<select>` is the right control for four mutually exclusive orderings, and the
 * design draws it that way. It is a plain `GET`, so it needs no JavaScript; the
 * hidden fields carry the active filters through, and `page` is deliberately not
 * among them, because a re-sorted catalogue starts again at page one.
 */
export function ResultsToolbar({
  query,
  count,
  /** What is currently narrowing the catalogue, in words. */
  filterLabel,
}: {
  query: CatalogueQuery;
  count: number;
  filterLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-4.5">
      <p className="text-caption text-ink-muted">
        <span data-numeric>{count}</span> {ui.pieces} · {filterLabel}
      </p>

      <form action="/shop" method="get" className="flex items-center gap-3">
        {query.category ? (
          <input type="hidden" name={QUERY_KEYS.category} value={query.category} />
        ) : null}
        {query.sizes.map((size) => (
          <input key={size} type="hidden" name={QUERY_KEYS.size} value={size} />
        ))}
        {query.colours.map((colour) => (
          <input key={colour} type="hidden" name={QUERY_KEYS.colour} value={colour} />
        ))}
        {query.madeToOrder ? (
          <input type="hidden" name={QUERY_KEYS.madeToOrder} value="1" />
        ) : null}
        {query.inStockOnly ? <input type="hidden" name={QUERY_KEYS.stock} value="in" /> : null}

        <label htmlFor="sort" className="text-micro uppercase tracking-nav text-ink-subtle">
          {ui.sort}
        </label>
        <select
          id="sort"
          name={QUERY_KEYS.sort}
          defaultValue={query.sort}
          className="min-h-11 cursor-pointer rounded-sm border border-line bg-canvas px-3.5 text-caption text-ink transition-colors duration-(--duration-base) focus:border-brand focus:bg-surface"
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-sm border border-line px-4 text-micro uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:border-brand hover:text-brand"
        >
          {ui.apply}
        </button>
      </form>
    </div>
  );
}
