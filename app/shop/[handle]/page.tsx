import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { Media } from "@/components/ui/media";
import { Price } from "@/components/ui/price";
import { Eyebrow } from "@/components/ui/section";
import { ui } from "@/lib/content/site";
import { getAllProducts, getProductByHandle } from "@/lib/shopify";

/**
 * Product detail.
 *
 * Presentation only: breadcrumb, image, name, price, the size chips and the
 * description — all styled from the design system's Navigation and Product
 * variants sections. There is deliberately no add-to-bag control: cart and
 * checkout are Shopify's, and the cart UI is not part of this build. The size
 * chips are therefore a list of what exists, not a selector.
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
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2.5 text-caption text-ink-subtle">
          <li>
            <Link
              href="/"
              className="transition-colors duration-(--duration-base) hover:text-brand"
            >
              {ui.home}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/shop"
              className="transition-colors duration-(--duration-base) hover:text-brand"
            >
              {ui.shop}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink-body">
            <Copy value={product.title} label="product name" className="max-w-36" />
          </li>
        </ol>
      </nav>

      <div className="mt-block grid gap-block-lg lg:grid-cols-2">
        <Media image={product.featuredImage} priority sizes="(min-width: 1024px) 48vw, 100vw" />

        {/* The photograph is the priority image and must paint immediately, so
            only the detail column is revealed — it arrives beside a picture that
            is already there. */}
        <Reveal className="lg:pt-block">
          <h1 className="text-h1 leading-h1">
            <Copy value={product.title} label="product name" />
          </h1>

          <p className="mt-3 text-caption text-ink-subtle">
            <Copy value={product.material} label="material" className="max-w-48" />
          </p>

          <div className="mt-7 text-h3">
            <Price price={product.priceRange.minVariantPrice} />
          </div>

          {sizes.length > 0 ? (
            <div className="mt-block">
              <h2 className="font-body">
                <Eyebrow>{ui.size}</Eyebrow>
              </h2>
              <ul className="mt-3.5 flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <li
                    key={size.name}
                    className={`inline-flex h-11.5 min-w-[54px] items-center justify-center rounded-sm border px-3.5 text-caption tracking-wide ${
                      size.available
                        ? "border-line bg-canvas text-ink-body"
                        : "border-inert-border bg-inert text-on-inert line-through"
                    }`}
                  >
                    {size.name}
                    {!size.available ? <span className="sr-only">, {ui.soldOut}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-block wl-measure text-body leading-body text-ink-body">
            <Copy value={product.description} label="description" lines={4} />
          </div>
        </Reveal>
      </div>
    </Container>
  );
}
