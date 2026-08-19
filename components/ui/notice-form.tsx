"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { NO_NOTICE, type FormNotice } from "@/lib/shopify/form-state";

/**
 * A form that answers back.
 *
 * Used by the two controls whose Shopify side has to be configured before they can
 * work — the newsletter and the discount code. They submit for real and print
 * whatever the Server Function returned into a live region, rather than being
 * disabled (which reads as broken) or silently swallowing the input (which is
 * worse). When the Shopify feature is wired up, the same component shows the
 * success or validation message instead; nothing here changes.
 *
 * The only client code in these blocks: the fields, labels and button all come in
 * as server-rendered children.
 */
export function NoticeForm({
  action,
  label,
  className = "",
  noticeClassName = "",
  children,
}: {
  action: (previous: FormNotice, formData: FormData) => Promise<FormNotice>;
  /** Names the form for assistive tech, since it has no visible heading. */
  label: string;
  className?: string;
  noticeClassName?: string;
  children: ReactNode;
}) {
  const [notice, formAction] = useActionState(action, NO_NOTICE);

  return (
    <form action={formAction} aria-label={label} className={`flex flex-col gap-3 ${className}`}>
      {children}
      {/* Present from first render so the message is an update to an existing
          region rather than a new region appearing, which some screen readers
          would not announce. */}
      <p aria-live="polite" className={`text-caption leading-snug ${noticeClassName}`}>
        {notice.message}
      </p>
    </form>
  );
}
