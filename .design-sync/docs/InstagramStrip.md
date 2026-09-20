---
category: Home
keywords: [instagram strip, marquee, image rail, social, scrolling]
---
One row of square crops, scrolling — the strip the home page ends on.

**The loop is pure CSS** (`.wl-marquee` in `globals.css`), so this stays a Server
Component and costs no JavaScript.

## Notes

- The track holds the run twice and travels exactly −50%, which is what makes it
  seamless. **The component builds the second copy itself** and marks it
  `aria-hidden` — pass each image once.
- It runs continuously; hovering does not stop it. `prefers-reduced-motion` stops it
  altogether, which is why the rail is `overflow-x-auto` rather than `hidden`: with
  the animation off the strip must stay reachable by scrolling. The scrollbar itself
  is hidden.
- There are no links on the crops: a post needs a permalink, and inventing one would
  send readers nowhere.
- An empty `images` array renders nothing.

```jsx
<InstagramStrip heading="Follow us on Instagram" images={images} />
```
