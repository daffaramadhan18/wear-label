# Catalogue photography

The eleven garment shots below are **in the repo**, pulled from the Wear Label design
project (Claude Design `bf11a0f4-4b1c-400b-802c-b9c9c2d66673`, `assets/products/`)
and byte-identical to the originals there. `lib/shopify/fixtures.ts` points at them by
handle, so nothing needs configuring.

```
basic-linen-cullote.webp     casual-culotte-zipper.webp   milly-stripe-pants.webp
basic-pants.webp             cerra-loose-pants.webp       moa-pants.webp
                             dalia-wide-pants.webp        pallo-pants.webp
                             lilo-pants.webp              taka-flare-pants.webp
                                                          yora-loose-pants.webp
```

Each file is a **square** shot (639–1024 px on the side; the majority are 1024). The
filename is the product handle, so `/shop/lilo-pants` and `/products/lilo-pants.webp`
always agree.

## Replacing one

Overwrite the file, keeping the name and a 1:1 crop. `components/ui/media.tsx` frames
catalogue images at `1 / 1`, so a portrait file would be centre-cropped.

## Still missing

Photography that is **not** catalogue product shots, and still renders as a labelled
placeholder block at its final ratio:

| Slot | Where | Ratio |
| --- | --- | --- |
| Hero | `app/page.tsx` | 1440 × 600 |
| Shop campaign banner | `app/shop/page.tsx` | 1600 × 440 |

Both are `<image-slot>` placeholders in the design too — no shot has been chosen yet.
Drop a file into `public/home/` and set the `url` on the `Image` object in the page.
