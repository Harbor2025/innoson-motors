import { Inter } from "next/font/google";

/**
 * The revamped design (Figma "IVM website") is set in Inter. The rest of the
 * site keeps its existing fonts, so Inter is exposed as a scoped CSS variable
 * by the revamped routes' layouts instead of changing the root layout.
 * Revamp components opt in with `font-[family-name:var(--font-ivm-inter)]`.
 */
export const ivmInter = Inter({
  variable: "--font-ivm-inter",
  subsets: ["latin"],
  fallback: ["sans-serif"],
});
