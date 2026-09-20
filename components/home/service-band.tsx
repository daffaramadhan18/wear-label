import { Container } from "@/components/ui/container";
import { ExchangeIcon, ShippingIcon, SupportIcon } from "@/components/ui/icons";

/**
 * The three-up service band between the mosaic and the made-to-order block: rules
 * top and bottom, a camel mark in a circle, then the promise and its detail. The
 * marks are chosen by name from the content module, so adding a fourth promise is a
 * content change plus one entry here.
 */
const MARKS = {
  shipping: ShippingIcon,
  support: SupportIcon,
  exchange: ExchangeIcon,
} as const;

export interface Service {
  icon: string;
  title: string;
  body: string;
}

export function ServiceBand({ services }: { services: readonly Service[] }) {
  return (
    <section className="mt-section border-y border-rule">
      <Container>
        <ul className="grid divide-y divide-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {services.map((service) => {
            const Mark = MARKS[service.icon as keyof typeof MARKS] ?? ShippingIcon;

            return (
              <li
                key={service.title}
                className="flex min-h-30 items-center justify-center gap-4.5 px-4 py-6 md:min-h-45 md:py-8"
              >
                <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-pill bg-inert text-brand">
                  <Mark className="size-7.5" />
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="text-label font-medium uppercase tracking-nav text-ink">
                    {service.title}
                  </span>
                  <span className="text-caption text-ink-muted">{service.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
