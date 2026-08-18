import { Section, SectionHeading } from "@/components/ui/section";
import { notes } from "@/lib/content/site";

/**
 * Social proof, placed before the final call to action. Static quotes — no
 * auto-rotation, so nothing needs pausing and nothing moves under reduced motion.
 */
export function Notes() {
  return (
    <Section labelledBy="notes-heading">
      <SectionHeading
        id="notes-heading"
        eyebrow={notes.eyebrow}
        heading={notes.heading}
        align="center"
      />

      <ul className="mt-block-lg grid gap-block md:grid-cols-3">
        {notes.items.map((note) => (
          <li key={note.name} className="wl-reveal">
            <figure className="flex h-full flex-col rounded-lg border border-hairline bg-surface p-7 shadow-sm">
              <blockquote className="flex-1">
                <p className="font-display text-h3 leading-snug text-ink">“{note.quote}”</p>
              </blockquote>
              <figcaption className="mt-7 border-t border-hairline pt-5">
                <span className="block text-body font-medium">{note.name}</span>
                <span className="mt-1 block text-caption text-ink-muted">{note.context}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
