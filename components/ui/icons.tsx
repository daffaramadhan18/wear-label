/**
 * Inline SVG icon set.
 *
 * One visual language: 24px box, 1.5 stroke, round caps, no fills. Never use
 * emoji as an icon. Icons are decorative by default (`aria-hidden`) — when an
 * icon is the only content of a control, the control carries the accessible
 * name, not the icon.
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

export function LeafIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20c0-7 5-12 16-13-1 11-6 15-13 15H4Z" />
      <path d="M4 20c4-4 8-6.5 13-8" />
    </Icon>
  );
}

export function LoomIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 5v14M9.333 5v14M14.667 5v14M20 5v14" />
      <path d="M3 9h18M3 15h18" />
    </Icon>
  );
}

export function NeedleIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 4 9 15" />
      <path d="M9 15l-1.5 4.5L12 18" />
      <path d="M17.5 6.5a2.5 2.5 0 1 1 0-.01" />
    </Icon>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 1 1 13 0c0 4.8-6.5 10-6.5 10Z" />
      <circle cx="12" cy="11" r="2.25" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </Icon>
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

export function BagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 8h14l-1 11H6L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m5 13 4.5 4.5L19 7" />
    </Icon>
  );
}

export const VALUE_ICONS = {
  leaf: LeafIcon,
  loom: LoomIcon,
  needle: NeedleIcon,
  map: MapPinIcon,
} as const;

export type ValueIconName = keyof typeof VALUE_ICONS;
