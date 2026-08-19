import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { FloatingPathsBackground } from "@/components/ui/floating-paths";
import { PageHeading } from "@/components/ui/section";
import { notFound } from "@/lib/content/site";

/**
 * 404. Catches anything outside the four routes this build ships.
 *
 * The floating-paths wash sits behind it. This is the sparsest page in the build —
 * a heading, an intro and one button, no photography and no logotype — which is the
 * low-density band the effect is for, and the one page where nothing else competes
 * with it. `subtle` rather than `brand` because all three of those sit on top of the
 * strands, so the wash has to stay under its content.
 *
 * Unlike `AuroraBand` this wash needs no tone matched to the surface underneath: it
 * paints strokes rather than a veil, so there is no filled rectangle to give away a
 * mismatch, and the page's white reads straight through it.
 */
export default function NotFound() {
  return (
    <FloatingPathsBackground tone="subtle">
      <Container className="py-section">
        <PageHeading id="not-found-heading" heading={notFound.heading} body={notFound.body} />
        <div className="mt-block">
          <ButtonLink href="/" size="lg">
            <Copy value={notFound.cta} label="cta" inline />
          </ButtonLink>
        </div>
      </Container>
    </FloatingPathsBackground>
  );
}
