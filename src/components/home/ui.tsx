import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared bits for the redesigned homepage (Figma: "Revamp/Button/*", eyebrow style, icons).
 * No "use client" here, so server components can import it too.
 */

/** Central place for the links used by the homepage CTAs. */
export const ROUTES = {
  vehicles: "/vehicles",
  caris: "/vehicles/caris",
  testDrive: "/book-a-test-drive",
  // These aren't referenced in the files you shared; change them if your routes differ.
  quote: "/contact",
  financing: "/financing",
  about: "/about-us",
  news: "/news",
} as const;

/** Figma "Eyebrow": Inter 12 / semibold / 12% tracking / caps */
export const EYEBROW = "text-[12px] font-semibold uppercase leading-none tracking-[1.44px]";

type Variant = "primary" | "secondary" | "outline";

const VARIANT: Record<Variant, string> = {
  primary: "bg-ivm-blue text-white hover:bg-[#004a91]",
  secondary: "bg-white text-ivm-ink hover:bg-white/85",
  outline: "border border-ivm-line bg-white text-ivm-ink hover:bg-ivm-wash",
};

/**
 * Figma Revamp/Button/Primary + Secondary. 44px tall on mobile, 40px from md up
 * (`compact` keeps 40px everywhere, used on promo tiles). Pass the width via className.
 */
export function btnClass({
  variant = "primary",
  compact = false,
  className = "",
}: {
  variant?: Variant;
  compact?: boolean;
  className?: string;
} = {}) {
  return `flex items-center justify-center whitespace-nowrap rounded-[4px] text-[14px] font-semibold leading-[1.4] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivm-blue ${
    compact ? "h-10" : "h-11 md:h-10"
  } ${VARIANT[variant]} ${className}`;
}

export function Btn({
  href,
  variant = "primary",
  compact = false,
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={btnClass({ variant, compact, className })}>
      {children}
    </Link>
  );
}

export function Chevron({
  dir = "right",
  className = "size-5",
}: {
  dir?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={dir === "left" ? "M12.5 4.5 7 10l5.5 5.5" : "M7.5 4.5 13 10l-5.5 5.5"} />
    </svg>
  );
}

export function PlayIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path d="M10 6.5v15l12-7.5-12-7.5Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <rect x="4.5" y="3.5" width="3.8" height="13" rx="1" fill="currentColor" />
      <rect x="11.7" y="3.5" width="3.8" height="13" rx="1" fill="currentColor" />
    </svg>
  );
}