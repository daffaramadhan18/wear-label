import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ui } from "@/lib/content/site";
import { QUERY_KEYS, SORT_KEYS, SORT_LABELS, type CatalogueQuery } from "@/lib/shopify";

/**
 * Catalogue filters, styled from the design system's Forms section: 11px camel
 * field labels at 0.18em, cream-filled controls with a sand rule, and pill chips —
 * which the system reserves for badges and filter chips exactly like these.
 *
 * A plain `GET` form with native controls: no `"use client"`, no JavaScript, and
 * the resulting URL is shareable and back-button friendly. Filter state lives in
 * the query string, which `/shop` reads on the server — so once Shopify is live the
 * same query becomes Storefront API arguments with no UI change.
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
      className="flex flex-col gap-block border-b border-rule pb-block lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:border-0 lg:pb-0"
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

      <div className="flex flex-col gap-2.5">
        <label
          htmlFor="sort"
          className="text-micro uppercase tracking-nav text-ink-subtle"
        >
          {ui.sort}
        </label>
        <select
          id="sort"
          name={QUERY_KEYS.sort}
          defaultValue={query.sort}
          className="min-h-12 w-full cursor-pointer rounded-sm border border-line bg-canvas px-4 text-body text-ink transition-colors duration-(--duration-base) focus:border-brand focus:bg-surface"
        >
          {SORT_KEYS.map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button type="submit">{ui.apply}</Button>
        {filtered ? (
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center border-b border-line py-2 text-caption text-brand transition-colors duration-(--duration-base) hover:border-brand"
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
      <legend className="text-micro uppercase tracking-nav text-ink-subtle">{legend}</legend>
      <div className="mt-3.5 flex flex-wrap gap-2.5">{children}</div>
    </fieldset>
  );
}

/**
 * Native checkbox inside a pill chip. The checkbox itself stays visible rather
 * than being replaced by a styled span, so its state is never communicated by
 * colour alone and the control keeps the platform's own semantics.
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
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-pill border border-line bg-canvas px-4 text-caption text-ink-body transition-colors duration-(--duration-base) hover:bg-surface-muted has-checked:border-brand has-checked:bg-surface-muted has-checked:text-ink">
      <input
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="size-4 cursor-pointer accent-brand"
      />
      {label}
    </label>
  );
}
