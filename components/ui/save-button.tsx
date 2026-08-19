"use client";

import { useSyncExternalStore } from "react";
import { HeartIcon } from "@/components/ui/icons";
import { ui } from "@/lib/content/site";

/**
 * Save for later.
 *
 * BROWSER-LOCAL, deliberately. Whether the storefront has customer accounts at all
 * is an open decision, and a wishlist that outlives the browser is a customer
 * record — which belongs in Shopify, not here. So this keeps a list of handles in
 * `localStorage` and nothing else: no request, no account, nothing to migrate but
 * the key name if the decision goes the other way.
 *
 * `useSyncExternalStore` rather than an effect that copies the list into state. The
 * list IS external state, and reading it this way gets three things an effect would
 * not: the server render is defined (nothing is saved, as far as the server can
 * know), every button showing the same handle updates together, and a change in
 * another tab arrives through the `storage` event.
 *
 * `aria-pressed` carries the state, so it is never colour alone.
 */
const KEY = "wl:saved";

const listeners = new Set<() => void>();

/** Cached so `getSnapshot` returns a stable reference while the list is unchanged. */
let cache: { raw: string | null; list: string[] } = { raw: null, list: [] };

function parse(raw: string | null): string[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
  } catch {
    return [];
  }
}

function read(): string[] {
  let raw: string | null = null;

  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    /* Storage can be blocked outright; an unreadable list is an empty one. */
    return cache.list;
  }

  if (raw !== cache.raw) cache = { raw, list: parse(raw) };
  return cache.list;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function write(list: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* Private mode or a full quota. The list stays as it was, which is the honest
       outcome — better than a button that says "saved" for something that is not. */
    return;
  }

  /* `storage` only fires in OTHER tabs, so this tab is told directly. */
  for (const listener of [...listeners]) listener();
}

export function SaveButton({
  handle,
  title,
  className = "",
}: {
  handle: string;
  /** Product name, so the control's accessible name says what it saves. */
  title: string;
  className?: string;
}) {
  const saved = useSyncExternalStore(
    subscribe,
    () => read().includes(handle),
    () => false,
  );

  function toggle() {
    const list = read();
    write(saved ? list.filter((entry) => entry !== handle) : [...list, handle]);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={`inline-flex cursor-pointer items-center justify-center transition-colors duration-(--duration-base) ${
        saved ? "text-brand" : "text-ink-muted hover:text-brand"
      } ${className}`}
    >
      <HeartIcon className="size-4.5" />
      <span className="sr-only">
        {saved ? ui.saved : ui.save}: {title}
      </span>
    </button>
  );
}
