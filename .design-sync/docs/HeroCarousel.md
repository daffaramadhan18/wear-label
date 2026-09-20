---
category: Home
keywords: [hero, carousel, slider, banner, home hero]
---
The home page hero — a 600px band with a cream copy card over the photograph.

Slides travel sideways rather than crossfading: every slide is parked one band
width away on the side it will arrive from, and only the offset changes.

## Rotation rules

- Stops on hover and on keyboard focus, so a reader can finish the sentence they
  are on and reach the CTA without it moving.
- **A touch stops it for good.** There is no hover on a phone, so the first touch
  anywhere on the band — or any use of the arrows or dots — ends rotation for the
  rest of the visit.
- `prefers-reduced-motion` turns rotation off entirely rather than shortening it.
- Inactive slides are `inert`, so their heading and CTA leave the tab order and the
  accessibility tree instead of being invisible tab stops.

## Notes

- **Controls are derived from the slide count, not drawn in**: one slide renders as
  a still band with no arrows and no dots.
- Artwork is matched to slides by POSITION, not filename. A slide with no artwork
  falls back to the labelled placeholder at the band's exact size.
- `label` names the region, since the heading changes with the slide.

```jsx
<HeroCarousel slides={home.hero.slides} label={ui.heroLabel} />
```
