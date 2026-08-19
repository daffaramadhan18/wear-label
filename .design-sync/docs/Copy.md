---
category: Typography
keywords: [copy, placeholder, text, empty state, content]
---
Renders a text value, or a labelled placeholder block when that value is empty.

This is the most important component to understand in this design system. Brand
copy has not been written, so `lib/content/site.ts` holds empty strings and every
text slot goes through `Copy`.

- Given a real string it renders exactly that string and nothing else.
- Given an empty string it renders a block sized in `em`, so it inherits the
  surrounding type size — a heading placeholder is heading-sized, a caption
  placeholder caption-sized.

That is what keeps the page rhythm final before any copy exists: filling the
content module in replaces every block with text, with no layout shift.

## Props

- `value` — the string. Empty means placeholder.
- `label` — required. Names the slot ("heading", "product name"), shown on the
  placeholder and used as its accessible label, so assistive tech announces
  "heading placeholder" rather than silence.
- `lines` — placeholder line count. Widths cycle so multi-line reads as prose.
- `inline` — bar and label side by side, for short strings inside a control.

```jsx
<h2 className="text-h2"><Copy value={heading} label="heading" /></h2>
<p><Copy value={body} label="intro" lines={2} /></p>
```
