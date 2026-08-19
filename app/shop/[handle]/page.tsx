import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { ArrowLeftIcon } from "@/components/ui/icons";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { ui } from "@/lib/content/site";
import { getAllProducts, getProductByHandle } from "@/lib/shopify";

/**
 * Product detail.
 *
 * Presentation only: image, name, price, the size list and the description. There
 * is deliberately no add-to-cart control — cart and checkout are Shopify's, and
 * the cart UI is not part of this build.
 */

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ handle: product.handle }));
}

export default async function ProductPage(props: PageProps<"/shop/[handle]">) {
  const { handle } = await props.params;
  const product = await getProductByHandle(handle);

  if (!product) notFound();

  const sizes = product.options.find((option) => option.name === "Size")?.values ?? [];

  return (
    <Container className="py-section">
      <Link
        href="/shop"
        className="inline-flex min-h-11 items-center gap-2 text-caption text-ink transition-colors duration-[var(--duration-fast)] hover:text-ink-accent"
      >
        <ArrowLeftIcon className="size-4" />
        {ui.backToShop}
      </Link>

      <div className="mt-block grid gap-block-lg lg:grid-cols-2">
        <Media
          image={product.featuredImage}
          priority
          sizes="(min-width: 1024px) 48vw, 100vw"
          label="product image"
        />

        <div className="lg:pt-block">
          <h1 className="text-h2">
            <Copy value={product.title} label="product name" />
          </h1>

          <div className="mt-6 text-body-lg">
            <Price price={product.priceRange.minVariantPrice} />
          </div>

          {sizes.length > 0 ? (
            <div className="mt-block">
              <h2 className="font-body text-eyebrow font-medium uppercase tracking-eyebrow text-ink-muted">
                {ui.size}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <li
                    key={size.name}
                    className={`inline-flex min-h-11 items-center rounded-pill border px-4 text-caption ${
                      size.available
                        ? "border-line text-ink"
                        : "border-hairline text-ink-muted line-through"
                    }`}
                  >
                    {size.name}
                    {!size.available ? (
                      <span className="sr-only">, {ui.soldOut}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-block wl-measure text-body leading-relaxed text-ink-muted">
            <Copy value={product.description} label="description" lines={4} />
          </div>
        </div>
      </div>
    </Container>
  );
}
