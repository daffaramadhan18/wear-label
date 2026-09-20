import { ButtonLink } from "wear-label";

/**
 * Same five variants as Button, rendered as an anchor.
 *
 * Reach for this whenever the action navigates — it is a real link, so it keeps
 * middle-click, open-in-new-tab and the browser's own affordances. Button is for
 * actions that stay on the page. There is no disabled state here: only a real
 * `<button>` can be disabled.
 */
export const Variants = () => (
  <div className="flex flex-wrap items-center gap-4">
    <ButtonLink href="/shop" variant="primary">
      Shop the collection
    </ButtonLink>
    <ButtonLink href="/about" variant="outline">
      About us
    </ButtonLink>
    <ButtonLink href="/account" variant="ghost">
      My account
    </ButtonLink>
    <ButtonLink href="/shop" variant="link">
      View all
    </ButtonLink>
  </div>
);
