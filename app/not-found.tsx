import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { PageHeading } from "@/components/ui/section";
import { notFound } from "@/lib/content/site";

/** 404. Catches anything outside the four routes this build ships. */
export default function NotFound() {
  return (
    <Container className="py-section">
      <PageHeading id="not-found-heading" heading={notFound.heading} body={notFound.body} />
      <div className="mt-block">
        <ButtonLink href="/" size="lg">
          <Copy value={notFound.cta} label="cta" inline />
        </ButtonLink>
      </div>
    </Container>
  );
}
