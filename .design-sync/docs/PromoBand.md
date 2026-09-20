---
category: Home
keywords: [promo band, limited run, campaign band, countdown]
---
The limited-run band: copy on the inert aurora, the garment filling the right-hand edge.

The photograph sits behind the copy and **only from `md` up** — at narrow widths the
crop would be a sliver and the text would be reading against a garment.

## Notes

- The countdown appears only when `endsAt` is a parseable FUTURE date. Pass an empty
  string and the band renders without blocks — which is the storefront's own state,
  because a run's end date is merchandising data and a countdown that is really a
  fixed string is worse than no countdown.
- The band is currently off the home page; the component and its copy both stay, so
  restoring it is one block in `app/page.tsx`.

```jsx
<PromoBand
  eyebrow="Limited run"
  heading="Twenty pieces per colourway"
  cta="View collection"
  href="/shop"
  endsAt=""
  image={image}
/>
```
