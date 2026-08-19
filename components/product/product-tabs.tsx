"use client";

import { useRef, useState } from "react";
import { Copy } from "@/components/ui/copy";

/**
 * The product page's Details / Fabric & care / Shipping tabs.
 *
 * Real ARIA tabs, which means the keyboard contract has to be real too: arrow keys
 * move between tabs, Home and End jump to the ends, and the tab strip is a single
 * tab stop, with Tab moving on to the panel. A row of buttons that only responds to
 * clicks looks like this and is not this.
 *
 * A panel whose copy has not been written renders the labelled placeholder at body
 * size, so the block keeps its height either way.
 */
export interface Tab {
  id: string;
  label: string;
  body: string;
  /** Field name shown on the placeholder when `body` is empty. */
  placeholder: string;
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const strip = useRef<HTMLDivElement>(null);

  function focusTab(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActive(next);
    strip.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowRight") focusTab(active + 1);
    else if (event.key === "ArrowLeft") focusTab(active - 1);
    else if (event.key === "Home") focusTab(0);
    else if (event.key === "End") focusTab(tabs.length - 1);
    else return;

    event.preventDefault();
  }

  return (
    <div className="border-t border-rule">
      <div ref={strip} role="tablist" onKeyDown={onKeyDown} className="flex flex-wrap">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={index === active}
            aria-controls={`panel-${tab.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => setActive(index)}
            className={`cursor-pointer border-b-2 px-6 py-5.5 text-label uppercase tracking-nav transition-colors duration-(--duration-base) sm:px-8 ${
              index === active
                ? "border-brand text-ink"
                : "border-transparent text-ink-subtle hover:text-brand"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={index !== active}
          tabIndex={0}
          className="wl-measure py-8 text-body leading-body text-ink-body"
        >
          <Copy value={tab.body} label={tab.placeholder} lines={3} />
        </div>
      ))}
    </div>
  );
}
