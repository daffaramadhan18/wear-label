import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import type { Product } from "@/lib/shopify";
import { ProductCard } from "./product-card";

const CARD_SIZES = "(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw";

export function FeaturedCollection({ products }: { products: Product[] }) {
  return (
    <Section labelledBy="featured-heading">
      <SectionHeading
        id="featured-heading"
        eyebrow="This run"
        heading="Cut this season, in limited numbers."
        body="Each piece below is part of a run between forty and a hundred and twenty. When a size goes, it does not restock mid-season."
        action={
          <ButtonLink href="/shop" variant="outline">
            Shop all pieces
          </ButtonLink>
        }
      />

      <ul className="mt-block-lg grid gap-block sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} sizes={CARD_SIZES} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
