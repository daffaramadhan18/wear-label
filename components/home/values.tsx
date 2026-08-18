import { Container } from "@/components/ui/container";
import { VALUE_ICONS } from "@/components/ui/icons";
import { values } from "@/lib/content/site";

/**
 * Four-point trust strip directly under the hero.
 *
 * The section heading is visually hidden rather than absent: the item titles are
 * h3s, so a real h2 has to exist between them and the page h1 or the heading
 * outline skips a level.
 */
export function Values() {
  return (
    <section aria-labelledby="values-heading" className="border-y border-hairline bg-surface">
      <Container className="py-block-lg">
        <h2 id="values-heading" className="sr-only">
          What we stand for
        </h2>
        <ul className="grid gap-block sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = VALUE_ICONS[value.icon];
            return (
              <li key={value.title} className="wl-reveal">
                <Icon className="size-6 text-ink-accent" />
                <h3 className="mt-4 font-body text-body-lg font-medium">{value.title}</h3>
                <p className="mt-2 text-caption leading-relaxed text-ink-muted">{value.body}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
