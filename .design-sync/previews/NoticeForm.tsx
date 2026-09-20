import { NoticeForm } from "wear-label";
import { ui } from "@/lib/content/site";

/**
 * A form that answers back.
 *
 * Used by the two controls whose Shopify side has to be configured before they can
 * work — the newsletter and the discount code. They submit for REAL and print
 * whatever the Server Function returned into a live region, rather than being
 * disabled (which reads as broken) or silently swallowing the input (which is
 * worse). When the Shopify feature is wired up, the same component shows the
 * success or validation message instead and nothing here changes.
 *
 * `action` is a Server Function with the `useActionState` signature —
 * `(previous, formData) => Promise<FormNotice>`, where `FormNotice` is
 * `{ status, message }`. The notice paragraph is present from first render, so the
 * message is an update to an existing live region rather than a new region
 * appearing — some screen readers would not announce the latter.
 *
 * Everything visible is passed in as children and stays server-rendered; the only
 * client code is the state hook.
 *
 * The cells below pass a plain async function so the card can render the answered
 * state without a server. In the app the real Server Functions come from
 * `lib/shopify/actions.ts`.
 */
const answers = (message: string) => async () => ({ status: "unavailable" as const, message });

/** The footer's newsletter sign-up, in its resting state. */
export const Newsletter = () => (
  <div className="max-w-100">
    <NoticeForm
      action={answers("")}
      label="Email address"
      noticeClassName="text-ink-muted"
    >
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor="preview-email" className="sr-only">
          Email address
        </label>
        <input
          id="preview-email"
          type="email"
          name="email"
          placeholder="Enter your email"
          className="min-h-12 min-w-0 flex-1 rounded-sm border border-line bg-canvas px-4 text-small text-ink placeholder:text-ink-subtle focus:border-brand"
        />
        <button
          type="submit"
          className="min-h-12 cursor-pointer rounded-sm border border-line px-5 text-micro uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:border-brand hover:text-brand"
        >
          Subscribe
        </button>
      </div>
    </NoticeForm>
  </div>
);

/**
 * What the reader sees after submitting today: the form worked, and it says
 * plainly why nothing was signed up. This is the whole point of the component.
 */
export const Answered = () => (
  <div className="max-w-100">
    <NoticeForm
      action={answers(ui.newsletterUnavailable)}
      label="Email address"
      noticeClassName="text-ink-muted"
    >
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor="preview-email-answered" className="sr-only">
          Email address
        </label>
        <input
          id="preview-email-answered"
          type="email"
          name="email"
          defaultValue="hello@example.com"
          className="min-h-12 min-w-0 flex-1 rounded-sm border border-line bg-canvas px-4 text-small text-ink focus:border-brand"
        />
        <button
          type="submit"
          className="min-h-12 cursor-pointer rounded-sm border border-line px-5 text-micro uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:border-brand hover:text-brand"
        >
          Subscribe
        </button>
      </div>
    </NoticeForm>
  </div>
);

/** The bag's promo field — the same component, a different Server Function. */
export const PromoCode = () => (
  <div className="max-w-100">
    <NoticeForm
      action={answers(ui.discountUnavailable)}
      label="Promo code"
      noticeClassName="text-ink-muted"
    >
      <div className="flex flex-wrap gap-2.5">
        <label htmlFor="preview-promo" className="sr-only">
          Promo code
        </label>
        <input
          id="preview-promo"
          type="text"
          name="code"
          placeholder="Promo code"
          className="min-h-12 min-w-0 flex-1 rounded-sm border border-line bg-canvas px-4 text-small text-ink placeholder:text-ink-subtle focus:border-brand"
        />
        <button
          type="submit"
          className="min-h-12 cursor-pointer rounded-sm border border-line px-5 text-micro uppercase tracking-nav text-ink-muted transition-colors duration-(--duration-base) hover:border-brand hover:text-brand"
        >
          Apply
        </button>
      </div>
    </NoticeForm>
  </div>
);
