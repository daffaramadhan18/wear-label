import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { CatalogueFilters } from "@/components/shop/catalogue-filters";
import { ProductCard } from "@/components/shop/product-card";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { PageHeading } from "@/components/ui/section";
import { shop, ui } from "@/lib/content/site";
import {
  catalogueFacets,
  filterProducts,
  getAllProducts,
  isFiltered,
  parseCatalogueQuery,
} from "@/lib/shopify";

/**
 * Shop — the catalogue.
 *
 * Filter state lives entirely in the URL, so this stays a Server Component: it
 * reads `searchParams`, asks `lib/shopify` for the matching products and renders.
 * No client-side filtering, no hydrated state to keep in sync with the URL.
 */
export default async function ShopPage(props: PageProps<"/shop">) {
  const [searchParams, products] = await Promise.all([props.searchParams, getAllProducts()]);

  const query = parseCatalogueQuery(searchParams);
  const facets = catalogueFacets(products);
  const results = filterProducts(products, query);

  return (
    <Container className="py-section">
      <PageHeading id="shop-heading" heading={shop.heading} body={shop.body} />

      <div className="mt-block-lg grid gap-block-lg lg:grid-cols-[16rem_1fr]">
        <CatalogueFilters facets={facets} query={query} filtered={isFiltered(query)} />

        <div>
          <p className="text-caption text-ink-subtle" data-numeric>
            {results.length} {ui.results}
          </p>

          {results.length === 0 ? (
            <Alert className="mt-block">{ui.noResults}</Alert>
          ) : (
            /* The grid re-staggers on every filter submit, because a `GET`
               form is a real navigation — the arrival doubles as the feedback
               that the filter was applied. */
            <Stagger className="mt-block grid gap-block sm:grid-cols-2 xl:grid-cols-3">
              {results.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard
                    product={product}
                    headingLevel="h2"
                    sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 90vw"
                  />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </Container>
  );
}
