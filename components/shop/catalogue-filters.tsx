import Link from "next/link";
import { ui } from "@/lib/content/site";
import {
  catalogueHref,
  toggle,
  type CatalogueFacets,
  type CatalogueQuery,
} from "@/lib/shopify";

/**
 * Catalogue filters, styled from the design system's Forms section: 11px camel
 * field labels at 0.18em, cream-filled controls with a sand rule, and pill chips —
 * which the system reserves for badges and filter chips exactly like these.
 *
 * Every control is a LINK, not a form field. Each one is the current URL with one
 * facet flipped, so filtering needs no JavaScript, no submit step and no client
 * state: the URL is the state, it is shareable, and the back button undoes exactly
 * one choice. `lib/shopify/catalogue.ts` builds the hrefs and is also what will
 * translate them into Storefront API arguments once the store is live.
 *
 * A link cannot be `aria-pressed`, so an applied filter carries `aria-current`
 * instead — the fill is never the only thing saying it is on. Colourways carry
 * their name as well as their swatch, for the same reason.
 */
export function CatalogueFilters({
  facets,
  query,
}: {
  facets: CatalogueFacets;
  query: CatalogueQuery;
}) {
  const filtered =
    query.category !== null ||
    query.sizes.length > 0 ||
    query.colours.length > 0 ||
    query.madeToOrder ||
    query.inStockOnly;

  return (
    <aside
      aria-label={ui.filters}
      className="flex flex-col gap-block border-b border-rule pb-block lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:border-0 lg:pb-0"
    >
      <FilterGroup legend={ui.category} first>
        <ul className="flex flex-col gap-3.5">
          <CategoryRow
            href={catalogueHref(query, { category: null, madeToOrder: false })}
            label={ui.allPieces}
            count={facets.total}
            active={query.category === null && !query.madeToOrder}
          />
          {facets.categories.map((category) => (
            <CategoryRow
              key={category.name}
              href={catalogueHref(query, {
                category: query.category === category.name ? null : category.name,
              })}
              label={category.name}
              count={category.count}
              active={query.category === category.name}
            />
          ))}
          <CategoryRow
            href={catalogueHref(query, { madeToOrder: !query.madeToOrder })}
            label={ui.madeToOrder}
            count={facets.madeToOrderCount}
            active={query.madeToOrder}
          />
        </ul>
      </FilterGroup>

      <FilterGroup legend={ui.size}>
        <ul className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => {
            const active = query.sizes.includes(size);

            return (
              <li key={size}>
                <Link
                  href={catalogueHref(query, { sizes: toggle(query.sizes, size) })}
                  aria-current={active ? "true" : undefined}
                  className={`inline-flex h-10 min-w-11 items-center justify-center rounded-xs border px-2 text-caption tracking-wide transition-colors duration-(--duration-base) ${
                    active
                      ? "border-brand bg-brand text-on-brand"
                      : "border-line bg-canvas text-ink-body hover:border-brand hover:text-brand"
                  }`}
                >
                  {size}
                </Link>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup legend={ui.colourway}>
        <ul className="flex flex-wrap gap-3">
          {facets.colours.map((colour) => {
            const active = query.colours.includes(colour.name);

            return (
              <li key={colour.name}>
                <Link
                  href={catalogueHref(query, { colours: toggle(query.colours, colour.name) })}
                  aria-current={active ? "true" : undefined}
                  title={colour.name}
                  style={{ backgroundColor: colour.swatch }}
                  className={`inline-block size-8 rounded-pill border border-line transition-shadow duration-(--duration-base) ${
                    active ? "ring-2 ring-brand ring-offset-2" : "hover:ring-1 hover:ring-line"
                  }`}
                >
                  <span className="sr-only">{colour.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup legend={ui.availability}>
        <Link
          href={catalogueHref(query, { inStockOnly: !query.inStockOnly })}
          aria-current={query.inStockOnly ? "true" : undefined}
          className={`inline-flex min-h-11 items-center rounded-pill border px-4 text-caption transition-colors duration-(--duration-base) ${
            query.inStockOnly
              ? "border-brand bg-surface-muted text-ink"
              : "border-line bg-canvas text-ink-body hover:bg-surface-muted"
          }`}
        >
          {ui.inStockOnly}
        </Link>
      </FilterGroup>

      {filtered ? (
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center self-start border-b border-line py-2 text-caption text-brand transition-colors duration-(--duration-base) hover:border-brand"
        >
          {ui.clearAll}
        </Link>
      ) : null}
    </aside>
  );
}

function FilterGroup({
  legend,
  first = false,
  children,
}: {
  legend: string;
  /** The first group has no rule above it. */
  first?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={first ? "flex flex-col gap-3.5" : "flex flex-col gap-3.5 border-t border-hairline pt-7"}
    >
      <h2 className="font-body text-micro uppercase tracking-label text-ink-subtle">{legend}</h2>
      {children}
    </section>
  );
}

function CategoryRow({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "true" : undefined}
        className={`flex min-h-8 items-center justify-between gap-4 text-small transition-colors duration-(--duration-base) hover:text-brand ${
          active ? "text-brand" : "text-ink-body"
        }`}
      >
        <span>{label}</span>
        <span data-numeric className="text-caption text-on-inert">
          {count}
        </span>
      </Link>
    </li>
  );
}
