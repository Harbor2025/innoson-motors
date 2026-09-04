import { Lato, Beth_Ellen } from "next/font/google";

/**
 * Figma uses "Lato SemiBold" only for the two pill-button labels
 * ("See All Model" / "Subscribe" CTA text nodes). Lato is freely
 * available via Google Fonts, unlike Avenir (see styles/fonts.css).
 */
export const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
  display: "swap",
});

/**
 * Used for the handwritten-style lead-in phrases on the About page
 * ("In the beginning….", "The Present…", the closing accent line) and,
 * unlike Avenir, is a genuine free Google Font — no fallback needed.
 */
export const bethEllen = Beth_Ellen({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-beth-ellen",
  display: "swap",
});