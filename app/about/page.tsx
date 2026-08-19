import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { Media } from "@/components/ui/media";
import { PageHeading } from "@/components/ui/section";
import { about } from "@/lib/content/site";
import type { Image } from "@/lib/shopify";

/**
 * About Us — the company profile.
 *
 * Structure only: a heading, an intro and three body paragraphs, all resolving to
 * placeholders until `lib/content/site.ts` is filled in. Add or remove entries in
 * `about.paragraphs` to change the length; this page needs no edit.
 */

export const metadata: Metadata = { title: "About Us" };

const ABOUT_IMAGE: Image = { url: null, altText: "", width: 1600, height: 1000 };

export default function AboutPage() {
  return (
    <Container className="py-section">
      <PageHeading id="about-heading" heading={about.heading} body={about.body} />

      <div className="mt-block-lg">
        <Media image={ABOUT_IMAGE} sizes="(min-width: 1024px) 80vw, 100vw" label="about image" />
      </div>

      <div className="mt-block-lg flex flex-col gap-block wl-measure text-body leading-relaxed text-ink-muted">
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>
            <Copy value={paragraph} label="paragraph" lines={4} />
          </p>
        ))}
      </div>
    </Container>
  );
}
