import type { ReactNode } from "react";

/**
 * Page gutter + max content width. Both values are tokens, so the whole site's
 * measure changes from one place.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-content px-gutter ${className}`}>{children}</div>
  );
}
