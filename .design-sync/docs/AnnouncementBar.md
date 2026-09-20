---
category: Layout
keywords: [announcement bar, promo strip, top bar, banner]
---
The espresso strip above the header.

One line, uppercase at label tracking, centred.

## Notes

- **Nothing interactive goes in it.** A bar that carries a link competes with the
  nav directly underneath it.
- It takes NO props: the line comes from `announcement` in `lib/content/site.ts`,
  which is the only place to change it.
- Empty copy renders nothing at all rather than an empty band, so removing the
  strip is a content change, not a layout change.

```jsx
<AnnouncementBar />
```
