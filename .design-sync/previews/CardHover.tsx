import { CardHover, CardMedia, Media, Price } from "wear-label";
import { products } from "@/lib/shopify/fixtures";

/**
 * The product card's hover and focus state, and the only client component in the
 * card. It supplies the `<article>` element and owns the active flag; `CardMedia`
 * reads that flag and scales the image inside it.
 *
 * Why both hover and focus: the card is one stretched link, so a pointer lands on
 * the article and a keyboard lands on the anchor inside it. Both fold into one
 * flag, so a keyboard user tabbing the grid sees exactly what a mouse user sees.
 *
 * **Hover is a pointer state, so a still card shows the rest position.** Compose it
 * as below, or just use `ProductCard`, which does all of this for you — reach for
 * `CardHover` directly only when you need a card the catalogue does not have.
 */
const moa = products.find((p) => p.handle === "moa-pants")!;

/** The composition: article, media wrapper, then the card's own text block. */
export const Composed = () => (
  <CardHover className="relative flex w-56 flex-col gap-3.5">
    <CardMedia>
      <Media image={moa.featuredImage} sizes="25vw" ratio="1 / 1" />
    </CardMedia>
    <div className="flex flex-col gap-1.5">
      <p className="text-caption text-ink-subtle">{moa.material}</p>
      <h3 className="font-display text-card leading-card text-ink">{moa.title}</h3>
      <Price
        price={moa.priceRange.minVariantPrice}
        compareAt={moa.compareAtPrice}
        className="mt-0.5 text-small"
      />
    </div>
  </CardHover>
);

/**
 * A row of them — how the state reads across a grid, where only the card under the
 * pointer lifts.
 */
export const InAGrid = () => (
  <div className="grid grid-cols-3 gap-6">
    {products.slice(0, 3).map((product) => (
      <CardHover key={product.id} className="relative flex flex-col gap-3.5">
        <CardMedia>
          <Media image={product.featuredImage} sizes="25vw" ratio="1 / 1" />
        </CardMedia>
        <div className="flex flex-col gap-1.5">
          <p className="text-caption text-ink-subtle">{product.material}</p>
          <h3 className="font-display text-card leading-card text-ink">{product.title}</h3>
          <Price price={product.priceRange.minVariantPrice} className="mt-0.5 text-small" />
        </div>
      </CardHover>
    ))}
  </div>
);
