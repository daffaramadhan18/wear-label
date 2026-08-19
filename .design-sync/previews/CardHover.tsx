import { CardHover, CardMedia, Media, Copy, Price } from "wear-label";

/**
 * The product card's hover and focus state, and the only client component in the
 * card. It supplies the `<article>` element and owns the active flag; CardMedia
 * reads it and scales the image.
 *
 * Why both hover and focus: the card is one stretched link, so a pointer lands on
 * the article and a keyboard lands on the anchor inside it. Both fold into one
 * flag, so a keyboard user tabbing the grid sees exactly what a mouse user sees.
 *
 * Hover is a pointer state — a still card shows the rest position. Compose it as
 * below, or just use ProductCard, which does this for you.
 */
export const Composed = () => (
  <CardHover className="relative flex w-56 flex-col gap-3.5">
    <CardMedia>
      <Media
        image={{ url: null, altText: "", width: 1200, height: 1500 }}
        sizes="25vw"
      />
    </CardMedia>
    <div className="flex flex-col gap-1.5">
      <h3 className="font-display text-card leading-card text-ink">
        <Copy value="" label="product name" />
      </h3>
      <p className="text-caption text-ink-subtle">
        <Copy value="Handwoven linen" label="material" />
      </p>
      <Price price={null} className="mt-0.5 text-small" />
    </div>
  </CardHover>
);
