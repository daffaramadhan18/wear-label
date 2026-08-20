import type { Metadata } from "next";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CatalogueFilters } from "@/components/shop/catalogue-filters";
import { Pagination } from "@/components/shop/pagination";
import { ProductCard } from "@/components/shop/product-card";
import { ResultsToolbar } from "@/components/shop/results-toolbar";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { shop, ui } from "@/lib/content/site";
import {
  catalogueFacets,
  filterProducts,
  getAllProducts,
  paginate,
  parseCatalogueQuery,
} from "@/lib/shopify";

/**
 * Shop — the catalogue.
 *
 * The entire query lives in the URL, so this stays a Server Component: it reads
 * `searchParams`, asks `lib/shopify` for the matching page of products and renders.
 * No client-side filtering, no hydrated state to keep in step with the URL, and the
 * result is a link anyone can send to anyone.
 *
 * Facets are computed from the whole catalogue, not from the filtered set — a count
 * that changes as you narrow tells you nothing about what the filter would do.
 *
 * The page opens straight on the catalogue. The breadcrumbs, the campaign banner and
 * the two promo bands the design draws above the grid are cut, so /shop lands on the
 * pieces and the filter rail with nothing in front of them. `ShopPromos` and its
 * `shop.promos` copy remain untouched, so restoring a band is an edit to this file
 * alone — the same arrangement as the bands cut from the home page.
 *
 * `shop.heading` is still rendered, screen-reader only, because it is the page's
 * single `h1`: without it the filter legends and the product-card titles would be
 * `h2`s sitting under no `h1` at all, and the route would announce itself by its
 * `<title>` only.
 */

export const metadata: Metadata = { title: shop.heading };

const CARD_SIZES = "(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 45vw";

export default async function ShopPage(props: PageProps<"/shop">) {
  const [searchParams, products] = await Promise.all([props.searchParams, getAllProducts()]);

  const query = parseCatalogueQuery(searchParams);
  const facets = catalogueFacets(products);
  const results = filterProducts(products, query);
  const { items, page, pageCount } = paginate(results, query.page);

  const filterLabel = query.category ?? (query.madeToOrder ? ui.madeToOrder : ui.allPieces);

  return (
    <Container className="pb-section pt-block-lg">
      <h1 className="sr-only">{shop.heading}</h1>

      <div className="grid gap-block-lg lg:grid-cols-[15rem_minmax(0,1fr)]">
        <CatalogueFilters facets={facets} query={query} />

        <div className="flex flex-col gap-7">
          <ResultsToolbar query={query} count={results.length} filterLabel={filterLabel} />

          {items.length === 0 ? (
            <Alert>{ui.noResults}</Alert>
          ) : (
            /* The grid re-staggers on every filter change, because each filter is a
               real navigation — the arrival doubles as the feedback that it applied. */
            <Stagger className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-7 sm:gap-y-10 xl:grid-cols-3">
              {items.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} headingLevel="h2" sizes={CARD_SIZES} />
                </StaggerItem>
              ))}
            </Stagger>
          )}

          <Pagination query={query} page={page} pageCount={pageCount} />
        </div>
      </div>
    </Container>
  );
}
