import { Pagination } from "wear-label";

/**
 * Catalogue paging.
 *
 * Links, like the filters — so a page is a real URL, the back button works and a
 * result set is shareable. Each link is built by `catalogueHref`, which flips the
 * page and preserves every other facet.
 *
 * The current page is **not** a link: it carries `aria-current="page"`, which is
 * what tells a screen reader where it is. The camel fill is not doing that job
 * alone. The trailing "Page n of m" says the same thing in words.
 *
 * **A single page of results renders nothing** — see `SinglePage`, where the whole
 * nav disappears rather than showing a lone disabled "1".
 */
const query = {
  category: null,
  sizes: [],
  colours: [],
  madeToOrder: false,
  inStockOnly: false,
  sort: "featured" as const,
  page: 1,
};

/** First of three pages. */
export const Default = () => <Pagination query={query} page={1} pageCount={3} />;

/** Mid-run — the current page is the filled, unlinked one. */
export const MidRun = () => (
  <Pagination query={{ ...query, page: 3 }} page={3} pageCount={5} />
);

/**
 * Paging inside an active filter. Every link keeps the category and sort, so
 * moving through pages never quietly resets the catalogue.
 */
export const WithFiltersApplied = () => (
  <Pagination
    query={{ ...query, category: "Wide leg", sort: "price-asc", page: 2 }}
    page={2}
    pageCount={4}
  />
);

/** One page of results — the component renders nothing at all. */
export const SinglePage = () => (
  <div className="flex flex-col gap-2 text-caption text-ink-subtle">
    <Pagination query={query} page={1} pageCount={1} />
    <span>(renders nothing — one page needs no pager)</span>
  </div>
);
