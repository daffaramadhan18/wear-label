import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/content/site";
import { QUERY_KEYS, SORT_KEYS, SORT_LABELS, type CatalogueQuery } from "@/lib/shopify";

/**
 * Catalogue filters.
 *
 * A plain `GET` form with native controls: no `"use client"`, no JavaScript, and
 * the resulting URL is shareable and back-button friendly. Filter state lives in
 * the query string, which `/shop` reads on the server — so once Shopify is live
 * the same query becomes Storefront API arguments with no UI change.
 */
export function CatalogueFilters({
  facets,
  query,
  filtered,
}: {
  facets: { categories: string[]; sizes: string[] };
  query: CatalogueQuery;
  /** Whether anything is currently narrowing the catalogue. */
  filtered: boolean;
}) {
  return (
    <form
      action="/shop"
      method="get"
      aria-label={ui.filters}
      className="flex flex-col gap-block border-b border-hairline pb-block lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:border-0 lg:pb-0"
    >
      <FilterGroup legend={ui.category}>
        {facets.categories.map((category) => (
          <CheckboxChip
            key={category}
            name={QUERY_KEYS.category}
            value={category}
            label={category}
            defaultChecked={query.categories.includes(category)}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend={ui.size}>
        {facets.sizes.map((size) => (
          <CheckboxChip
            key={size}
            name={QUERY_KEYS.size}
            value={size}
            label={size}
            defaultChecked={query.sizes.includes(size)}
          />
        ))}
      </FilterGroup>

      <FilterGroup legend={ui.availability}>
        <CheckboxChip
          name={QUERY_KEYS.stock}
          value="in"
          label={ui.inStockOnly}
          defaultChecked={query.inStockOnly}
        />
      </FilterGroup>

      <div>
        <label
          htmlFor="sort"
          className="block text-eyebrow font-medium uppercase tracking-eyebrow text-ink-muted"
        >
          {ui.sort}
        </label>
        <select
          id="sort"
          name={QUERY_KEYS.sort}
          defaultValue={query.sort}
          className="mt-3 min-h-11 w-full cursor-pointer rounded-sm border border-line bg-surface px-3 text-caption text-ink"
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit">{ui.apply}</Button>
        {filtered ? (
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center text-caption text-ink underline decoration-1 underline-offset-4 decoration-line transition-colors duration-[var(--duration-fast)] hover:decoration-ink"
          >
            {ui.clearAll}
          </Link>
        ) : null}
      </div>
    </form>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-muted">
        {legend}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

/**
 * Native checkbox inside a pill. The checkbox itself stays visible rather than
 * being replaced by a styled span, so its state is never communicated by colour
 * alone and the control keeps the platform's own semantics.
 */
function CheckboxChip({
  name,
  value,
  label,
  defaultChecked,
}: {
  name: string;
  value: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border border-line px-4 text-caption transition-colors duration-[var(--duration-fast)] hover:bg-sand has-checked:border-ink has-checked:bg-sand">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="size-4 cursor-pointer accent-primary"
      />
      {label}
    </label>
  );
}
