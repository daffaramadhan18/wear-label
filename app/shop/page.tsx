import type { Metadata } from "next";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CatalogueFilters } from "@/components/shop/catalogue-filters";
import { Pagination } from "@/components/shop/pagination";
import { ProductCard } from "@/components/shop/product-card";
import { ResultsToolbar } from "@/components/shop/results-toolbar";
import { ShopPromos } from "@/components/shop/shop-promos";
import { Alert } from "@/components/ui/alert";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Media } from "@/components/ui/media";
import { nav, shop, ui } from "@/lib/content/site";
import {
  catalogueFacets,
  filterProducts,
  getAllProducts,
  paginate,
  parseCatalogueQuery,
  type Image,
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
 */

export const metadata: Metadata = { title: shop.heading };

const BANNER: Image = { url: null, altText: "", width: 1600, height: 440 };

const CARD_SIZES = "(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 90vw";

export default async function ShopPage(props: PageProps<"/shop">) {
  const [searchParams, products] = await Promise.all([props.searchParams, getAllProducts()]);

  const query = parseCatalogueQuery(searchParams);
  const facets = catalogueFacets(products);
  const results = filterProducts(products, query);
  const { items, page, pageCount } = paginate(results, query.page);

  const filterLabel = query.category ?? (query.madeToOrder ? ui.madeToOrder : ui.allPieces);
  const promoImages = products.slice(0, 2).map((product) => product.featuredImage);

  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs
        trail={[{ label: nav.primary[0].label, href: "/" }, { label: nav.primary[1].label }]}
        className="mb-block"
      />

      <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-sm">
        <Media image={BANNER} fill sizes="100vw" label="Campaign banner" className="rounded-none" />
        {/* The banner plate, not a text shadow: type over an unknown crop needs its
            own surface to stay readable whatever the photograph turns out to be. */}
        <h1 className="relative bg-invert/80 px-8 py-5 text-center text-h1 leading-h1 text-ink-invert">
          {shop.heading}
        </h1>
      </div>

      <div className="mt-block">
        <ShopPromos promos={shop.promos} images={promoImages} />
      </div>

      <div className="mt-block-lg grid gap-block-lg lg:grid-cols-[15rem_minmax(0,1fr)]">
        <CatalogueFilters facets={facets} query={query} />

        <div className="flex flex-col gap-7">
          <ResultsToolbar query={query} count={results.length} filterLabel={filterLabel} />

          {items.length === 0 ? (
            <Alert>{ui.noResults}</Alert>
          ) : (
            /* The grid re-staggers on every filter change, because each filter is a
               real navigation — the arrival doubles as the feedback that it applied. */
            <Stagger className="grid gap-x-7 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
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
