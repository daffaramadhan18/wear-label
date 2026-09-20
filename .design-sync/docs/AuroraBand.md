---
category: Structure
keywords: [aurora band, section background, gradient band, wash]
---
A band with the aurora behind its contents — the wrapper to reach for, rather than placing Aurora yourself.

It supplies the two things a hand-rolled version gets wrong: `isolate`, which keeps
the `soft-light` blend against this band instead of the whole page, and a `w-full`
content wrapper, without which a flex parent shrinks the contents to the width of
the text.

## Props

Same `tone` / `origin` / `intensity` as `Aurora`, plus `as` to pick the element
(`section` default, `div`, `aside`, `footer`). Any other attribute —
`aria-labelledby`, `className`, `id` — passes straight through.

## Notes

- **`tone` must match the band's own background class**, exactly as for `Aurora`.
- Used by the made-to-order band, the bag's summary panel and the footer.

```jsx
<AuroraBand as="aside" tone="inert" origin="top-right" intensity={0.7} className="rounded-sm bg-inert p-9">
  <h2>Order summary</h2>
</AuroraBand>
```
