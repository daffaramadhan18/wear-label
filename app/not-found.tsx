import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Branded 404.
 *
 * The landing page links to routes that are part of the next build phase (/shop,
 * /lookbook, /cart, ...). Until those exist this page catches them, so the
 * navigation is honest about what is not built yet instead of dead-ending in a
 * default framework error.
 */
export default function NotFound() {
  return (
    <Container className="py-section">
      <div className="wl-measure">
        <Eyebrow>Not here yet</Eyebrow>
        <h1 className="mt-4 text-h1 leading-tight">This page is still on the table.</h1>
        <p className="mt-7 text-lead leading-relaxed text-ink-muted">
          The landing page is live; the shop, lookbook and cart are the next thing we build. If
          you followed a link from elsewhere and expected something here, it has not been made
          yet rather than moved.
        </p>
        <div className="mt-block flex flex-wrap gap-4">
          <ButtonLink href="/" size="lg">
            Back to the front page
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
