"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckIcon } from "@/components/ui/icons";
import { newsletter } from "@/lib/content/site";
import { subscribeToNewsletter } from "@/lib/content/newsletter";

/**
 * Signup form.
 *
 * Validation runs on blur and on submit — never per keystroke. The error sits
 * directly below the field, is wired with aria-describedby, and is announced via
 * role="alert". The submit button is disabled while in flight and success is
 * confirmed in place rather than by a toast that steals focus.
 */
export function Newsletter() {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  function validate(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return "Enter your email address so we know where to send the letter.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "That address looks incomplete — check for a missing @ or domain.";
    }
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = validate(email);
    setError(message);
    if (message) return;

    setStatus("submitting");
    const result = await subscribeToNewsletter(email.trim());

    if (result.ok) {
      setStatus("done");
      return;
    }

    setStatus("idle");
    setError(result.message);
  }

  return (
    <section aria-labelledby="newsletter-heading" className="wl-on-dark bg-invert py-section">
      <Container>
        <div className="grid items-start gap-block-lg lg:grid-cols-2">
          <div>
            <p className="text-eyebrow font-medium uppercase tracking-eyebrow text-ink-invert-muted">
              {newsletter.eyebrow}
            </p>
            <h2 id="newsletter-heading" className="mt-4 text-h2 text-ink-invert">
              {newsletter.heading}
            </h2>
            <p className="mt-5 wl-measure text-lead leading-relaxed text-ink-invert-muted">
              {newsletter.body}
            </p>
          </div>

          <div className="lg:pt-4">
            {status === "done" ? (
              <p className="flex items-start gap-3 text-body-lg text-ink-invert">
                <CheckIcon className="mt-0.5 size-6 shrink-0 text-clay-fill" />
                <span>
                  You’re on the list. The next letter goes out at the start of the month.
                </span>
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor={fieldId} className="block text-caption text-ink-invert">
                  Email address{" "}
                  <span className="text-ink-invert-muted">(required)</span>
                </label>

                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id={fieldId}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError(null);
                    }}
                    onBlur={(event) => setError(validate(event.target.value))}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${errorId} ${hintId}` : hintId}
                    className="min-h-12 flex-1 rounded-pill border border-line bg-transparent px-5 text-body text-ink-invert placeholder:text-ink-invert-muted/70 focus-visible:border-clay-fill"
                    placeholder="you@example.com"
                  />
                  <Button type="submit" disabled={status === "submitting"} size="lg">
                    {status === "submitting" ? "Adding you…" : "Subscribe"}
                  </Button>
                </div>

                {error ? (
                  <p id={errorId} role="alert" className="mt-3 text-caption text-clay-fill">
                    {error}
                  </p>
                ) : null}

                <p id={hintId} className="mt-4 text-caption text-ink-invert-muted">
                  {newsletter.consent}
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
