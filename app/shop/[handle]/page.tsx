import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Reveal } from "@/components/motion/reveal";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { Price } from "@/components/ui/price";
import { Eyebrow } from "@/components/ui/section";
import { nav, product as productCopy, ui } from "@/lib/content/site";
import { addToBag } from "@/lib/shopify/actions";
import {
  discountPercent,
  getAllProducts,
  getProductByHandle,
  getRelatedProducts,
  TAGS,
} from "@/lib/shopify";

/**
 * Product detail.
 *
 * Gallery on the left, everything purchasable on the right, then the tabs and the
 * related row. The right column's order is the design's and it is also the order the
 * decision gets made in: what it is made of, what it is called, what it costs, then
 * size, colourway, quantity, add.
 *
 * The design's star rating is not here. There is no review system behind it, and four
 * filled stars with "24 reviews" under them would be a fabricated claim about other
 * customers — the one kind of placeholder that cannot be labelled as one. When
 * reviews exist, this is where they go.
 */

const RELATED_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

/**
 * Prerender the catalogue's product pages. The routes are still rendered
 * dynamically at request time (the header reads the bag cookie), but generating the
 * params keeps the handle set in one place and gives Next a complete route manifest.
 */
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((entry) => ({ handle: entry.handle }));
}

export async function generateMetadata(
  props: PageProps<"/shop/[handle]">,
): Promise<Metadata> {
  const { handle } = await props.params;
  const found = await getProductByHandle(handle);

  if (!found) return {};

  return {
    title: found.title,
    description: found.description || found.material || undefined,
  };
}

export default async function ProductPage(props: PageProps<"/shop/[handle]">) {
  const { handle } = await props.params;
  const item = await getProductByHandle(handle);

  if (!item) notFound();

  const related = await getRelatedProducts(handle, 4);
  const price = item.priceRange.minVariantPrice;
  const discount = discountPercent(price, item.compareAtPrice);

  return (
    <Container className="pb-section pt-8">
      <Breadcrumbs
        trail={[
          { label: nav.primary[0].label, href: "/" },
          { label: nav.primary[1].label, href: "/shop" },
          { label: item.title },
        ]}
        className="mb-block"
      />

      <div className="grid gap-block-lg lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:gap-14">
        <ProductGallery images={item.images} title={item.title} />

        <div className="flex flex-col gap-5.5">
          <div className="flex flex-col gap-2.5">
            <Eyebrow className="tracking-label">
              <Copy value={item.material} label="material" inline />
            </Eyebrow>

            <h1 className="text-h1 leading-h1">{item.title}</h1>

            <div className="mt-1.5 flex flex-wrap items-baseline gap-3.5">
              <Price price={price} compareAt={item.compareAtPrice} size="display" />
              {discount !== null ? <Badge tone="sale">−{discount}%</Badge> : null}
              {item.tags.includes(TAGS.new) ? <Badge tone="invert">{ui.new}</Badge> : null}
              {!item.availableForSale ? <Badge tone="inert">{ui.soldOut}</Badge> : null}
            </div>
          </div>

          <ProductPurchase product={item} action={addToBag} />

          <ul className="flex flex-col gap-2.5 border-t border-hairline pt-5.5 text-caption leading-snug text-ink-muted">
            {productCopy.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      <Reveal className="mt-block-lg">
        <ProductTabs
          tabs={[
            {
              id: "details",
              label: ui.details,
              body: item.description,
              placeholder: "product details",
            },
            {
              id: "care",
              label: ui.fabricAndCare,
              body: item.care,
              placeholder: "fabric and care",
            },
            {
              id: "shipping",
              label: ui.shipping,
              body: productCopy.shipping,
              placeholder: "shipping",
            },
          ]}
        />
      </Reveal>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-block-lg flex flex-col gap-8">
          <Reveal>
            <h2 id="related-heading" className="font-body text-h2 leading-h2">
              {ui.relatedHeading}
            </h2>
          </Reveal>

          <Stagger className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((entry) => (
              <StaggerItem key={entry.id}>
                <ProductCard product={entry} sizes={RELATED_SIZES} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}
    </Container>
  );
}
