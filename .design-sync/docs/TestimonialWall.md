---
category: Home
keywords: [testimonials, reviews, voices wall, customer quotes, marquee]
---
The voices wall — four tilted vertical tracks of real customer reviews.

**The motion is pure CSS** (`.wl-voices-*` in `globals.css`), so this stays a Server
Component and the wall costs no renders and no JavaScript.

The geometry is measured, not eyeballed: a long 2200px perspective, per-track
resting offsets so a reversed track does not run out of content, and four different
durations — equal ones lock into step within seconds and the wall reads as one
sliding block.

## Notes

- **The quotations are real customer reviews, verbatim.** That is the whole reason
  this section is allowed where a star rating is not: it reproduces what customers
  wrote instead of synthesising a score. Never edit, tidy, translate or invent one.
- Reviews are in Indonesian while the site is in English, and they stay that way —
  translating a quotation turns it into a paraphrase.
- Four columns of five. Keep the count a multiple of four or the last column runs
  short. An empty array renders nothing.
- `prefers-reduced-motion` flattens it to a plain grid rather than merely pausing —
  a stopped tilted wall holds most of its reviews outside a stage that clips at
  560px. Below `md` it lies down into a horizontal snap rail.

```jsx
<TestimonialWall heading="From our customers" reviews={home.voices.reviews} />
```
