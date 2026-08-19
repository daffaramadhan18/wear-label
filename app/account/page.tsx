import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Copy } from "@/components/ui/copy";
import { PageHeading } from "@/components/ui/section";
import { account } from "@/lib/content/site";

/**
 * My Account — shell only.
 *
 * Whether customer accounts are used at all (versus guest checkout) is not
 * decided, and customer records live in Shopify either way. So this page carries
 * no sign-in form and no auth: adding one would commit the project to an approach
 * that has not been chosen. It reserves the route and the layout; the panels below
 * are where order history and details will go once the decision is made.
 */

export const metadata: Metadata = { title: "My Account" };

export default function AccountPage() {
  return (
    <Container className="py-section">
      <PageHeading id="account-heading" heading={account.heading} body={account.body} />

      <div className="mt-block-lg grid gap-block sm:grid-cols-2">
        {account.panels.map((panel, index) => (
          <section
            key={index}
            className="rounded-lg border border-hairline bg-surface p-8"
          >
            <h2 className="text-h3">
              <Copy value={panel.title} label="panel title" />
            </h2>
            <p className="mt-5 text-caption leading-relaxed text-ink-muted">
              <Copy value={panel.body} label="panel body" lines={3} />
            </p>
          </section>
        ))}
      </div>
    </Container>
  );
}
