/**
 * Inline SVG icon set — only what the four pages actually use.
 *
 * The design system's navigation, buttons and breadcrumb are all text, so the only
 * icons left are the mobile menu toggle's two states.
 *
 * One visual language: 24px box, 1.5 stroke, round caps, no fills. Never use
 * emoji as an icon. Icons are decorative (`aria-hidden`) — when an icon is the
 * only content of a control, the control carries the accessible name.
 */

type IconProps = React.SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}
