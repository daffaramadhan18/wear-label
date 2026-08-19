import { SiteFooter } from "wear-label";

/**
 * The site footer: logotype, the same primary navigation as the header, a footer
 * note and the copyright line, separated by inner hairlines.
 *
 * Takes no props — everything comes from lib/content/site.ts. The note and
 * tagline are unwritten brand copy, so they render as labelled Copy placeholders;
 * that is the current state of the site, not a broken render.
 */
export const Default = () => <SiteFooter />;
