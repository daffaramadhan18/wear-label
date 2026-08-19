import { SiteHeader } from "wear-label";

/**
 * The site header — sticky, cream, with a section rule beneath it and the
 * logotype beside the primary navigation. It takes no props: navigation comes
 * from lib/content/site.ts and the active item from the current route.
 *
 * The current page's link carries an underline and `aria-current="page"`, so the
 * active state is not colour alone. Below the `md` breakpoint the nav collapses
 * behind the MenuIcon toggle, which opens a panel that traps Escape and returns
 * focus to the button.
 *
 * In a preview there is no router, so the pathname resolves to "/" and Home shows
 * as the current page. Its height is the `--header-height` token (5.25rem), which
 * also drives the page's scroll padding.
 */
export const Default = () => <SiteHeader />;
