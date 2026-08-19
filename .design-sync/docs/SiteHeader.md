---
category: Layout
keywords: [header, navigation, nav, sticky header, site chrome]
---
The site header — sticky, cream, section rule beneath, logotype beside the nav.

Takes no props: navigation comes from the content module and the active item from
the current route.

## Notes

- The current page's link carries an underline and `aria-current="page"`, so the
  active state is not colour alone.
- Below `md` the nav collapses behind the `MenuIcon` toggle, opening a panel that
  handles Escape and returns focus to the button.
- Its height is the `--header-height` token (5.25rem), which also drives the
  page's scroll padding so anchors and keyboard focus never land underneath it.
- One per page, in the root layout — not something to place inside a section.
