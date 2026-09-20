import { Countdown } from "wear-label";

/**
 * Time left on a limited run — days, hours and minutes in bordered blocks.
 *
 * The clock is external state, so it is read with `useSyncExternalStore` rather
 * than copied into state by an effect. That is what makes the server render well
 * defined: `getServerSnapshot` returns null, the markup carries no time at all, and
 * a cached page can never serve a stale countdown.
 *
 * It **ticks every thirty seconds, not every second**. Minutes are the smallest
 * unit shown, so a per-second interval would repaint the same three numbers sixty
 * times over.
 *
 * It renders **nothing** in three cases, all of them deliberate: before hydration,
 * when `endsAt` is not a parseable date, and once the run has ended. So an expired
 * or unset run simply removes the blocks instead of showing zeroes — which is why
 * the storefront's own `home.promo.endsAt` is empty and the countdown is invisible
 * wherever the promo band is placed.
 *
 * The cells below compute `endsAt` relative to render time so they stay meaningful;
 * in the app it is an ISO timestamp in `lib/content/site.ts`.
 */
const inDays = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString();

/** Three days out — the shape of a real limited run. */
export const Default = () => <Countdown endsAt={inDays(3)} />;

/** Under a day left, so the hours and minutes blocks carry the urgency. */
export const LastDay = () => <Countdown endsAt={new Date(Date.now() + 7 * 3_600_000).toISOString()} />;

/**
 * An ended run, and the storefront's actual state — both render nothing at all.
 * The empty cell IS the behaviour: no zeroes, no expired badge.
 */
export const Ended = () => (
  <div className="flex flex-col gap-2 text-caption text-ink-subtle">
    <Countdown endsAt={inDays(-1)} />
    <Countdown endsAt="" />
    <span>(both render nothing — an ended or unset run removes the blocks)</span>
  </div>
);
