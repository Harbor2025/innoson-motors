import { Lato } from "next/font/google";

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
