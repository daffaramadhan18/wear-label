import { Container } from "wear-label";

/**
 * The page gutter and maximum measure, both tokens — so the whole site's width
 * changes from one edit. The dashed edge is only here to make the boundary
 * visible; Container itself draws nothing.
 */
export const Bounds = () => (
  <div className="w-full bg-surface-muted py-6">
    <Container>
      <div className="rounded-sm border border-dashed border-ink-subtle p-6 text-caption text-ink-muted">
        <p>
          Max width <code>--container-content</code>, 80rem.
        </p>
        <p className="mt-2">
          Gutter <code>--spacing-gutter</code>, clamped 1.5–4rem.
        </p>
      </div>
    </Container>
  </div>
);
