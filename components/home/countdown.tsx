"use client";

import { useSyncExternalStore } from "react";

/**
 * Time left on a limited run.
 *
 * The clock is external state, so it is read with `useSyncExternalStore` rather than
 * copied into state by an effect. That is what makes the server render well defined:
 * `getServerSnapshot` returns null, so the markup carries no time at all, and a
 * cached page can never serve a stale countdown. It also renders nothing once the
 * run has ended.
 *
 * It ticks once every thirty seconds, not once a second. The smallest unit shown is
 * minutes, so a per-second interval would repaint the same three numbers sixty times
 * over.
 */
const TICK_MS = 30_000;

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, TICK_MS);
  return () => window.clearInterval(timer);
}

/** The current tick, so a re-read inside one tick is referentially stable. */
function tick(): number {
  return Math.floor(Date.now() / TICK_MS);
}

function remaining(target: number, now: number) {
  const ms = target - now;
  if (ms <= 0) return null;

  const minutes = Math.floor(ms / 60_000);

  return [
    { value: Math.floor(minutes / 1440), label: "days" },
    { value: Math.floor(minutes / 60) % 24, label: "hrs" },
    { value: minutes % 60, label: "min" },
  ];
}

export function Countdown({ endsAt, className = "" }: { endsAt: string; className?: string }) {
  const target = Date.parse(endsAt);
  const now = useSyncExternalStore(subscribe, tick, () => null);

  if (now === null || !Number.isFinite(target)) return null;

  const blocks = remaining(target, now * TICK_MS);
  if (!blocks) return null;

  return (
    <ul className={`flex gap-4 ${className}`}>
      {blocks.map((block) => (
        <li
          key={block.label}
          className="flex size-16 flex-col items-center justify-center gap-0.5 border border-ink"
        >
          <span data-numeric className="text-h3 font-medium text-brand">
            {String(block.value).padStart(2, "0")}
          </span>
          <span className="text-micro uppercase tracking-eyebrow text-ink-subtle">
            {block.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
