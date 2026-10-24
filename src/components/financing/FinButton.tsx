import Link from "next/link";

type Variant = "primary" | "white" | "outline";

const VARIANT: Record<Variant, string> = {
  primary: "bg-ivm-blue text-white",
  white: "bg-white text-ivm-n900",
  outline: "border border-ivm-n200 bg-white text-ivm-n900",
};

/** Figma: "Revamp/Button/Primary" and "Revamp/Button/Secondary" at the 48px size. */
export default function FinButton({
  href,
  label,
  variant,
  className = "",
}: {
  href: string;
  label: string;
  variant: Variant;
  className?: string;
}) {
  const classes = `flex h-12 items-center justify-center whitespace-nowrap rounded-[4px] text-[14px] font-semibold leading-[1.4] transition-opacity hover:opacity-90 ${VARIANT[variant]} ${className}`;
  // tel: and in-page links need a plain anchor; internal routes use next/link
  return /^(tel:|mailto:|#|https?:)/.test(href) ? (
    <a href={href} className={classes}>
      {label}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}
