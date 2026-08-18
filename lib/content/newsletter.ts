/**
 * Newsletter signup transport — STUB.
 *
 * LAUNCH BLOCKER: no list provider is wired up. This resolves successfully so
 * the designed happy path is testable, and warns in the console so the gap is
 * not silently shipped. Replace the body with a call to the real provider (or a
 * Route Handler that talks to it) before going live.
 */

export type SubscribeResult = { ok: true } | { ok: false; message: string };

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  if (!email) {
    return { ok: false, message: "Enter an email address." };
  }

  console.warn(
    "[newsletter] No provider configured — the signup was not stored. " +
      "Wire lib/content/newsletter.ts to a real list before launch.",
  );

  await new Promise((resolve) => setTimeout(resolve, 450));
  return { ok: true };
}
