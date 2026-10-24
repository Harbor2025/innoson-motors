import type { ReactNode } from "react";
import { Inter } from "next/font/google";

/**
 * The revamped design (Figma "IVM website") is set in Inter. The rest of the
 * site still uses its existing fonts, so Inter is exposed as a scoped CSS
 * variable here instead of changing the root layout. Revamp components opt in
 * with `font-[family-name:var(--font-ivm-inter)]`.
 */
const ivmInter = Inter({
  variable: "--font-ivm-inter",
  subsets: ["latin"],
  fallback: ["sans-serif"],
});

export default function VehiclesLayout({ children }: { children: ReactNode }) {
  return <div className={ivmInter.variable}>{children}</div>;
}
