---
category: Feedback
keywords: [notice form, form state, live region, useActionState, server function]
---
A form that answers back — used by the two controls whose Shopify side must be configured before they can work.

The newsletter and the discount code submit for REAL and print whatever the Server
Function returned into a live region, rather than being disabled (which reads as
broken) or silently swallowing the input (which is worse). When the Shopify feature
is wired up, the same component shows the success or validation message instead and
nothing changes here.

## Props

`action` is a Server Function with the `useActionState` signature —
`(previous: FormNotice, formData: FormData) => Promise<FormNotice>`, where
`FormNotice` is `{ status: "idle" | "ok" | "unavailable"; message: string }`.
`label` names the form for assistive tech, since it has no visible heading.

## Notes

- The notice paragraph is present from FIRST render, so a message is an update to
  an existing live region rather than a new region appearing — some screen readers
  would not announce the latter.
- Everything visible is passed in as children and stays server-rendered; the only
  client code is the state hook.
- Never disable one of these controls instead. A dead control reads as broken.

```jsx
<NoticeForm action={applyDiscountCode} label="Promo code" noticeClassName="text-ink-muted">
  <input name="code" placeholder="Promo code" />
  <button type="submit">Apply</button>
</NoticeForm>
```
