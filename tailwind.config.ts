// tailwind.config.ts
import type { Config } from 'tailwindcss'

/**
 * Tailwind is preconfigured here for when the frontend is built on top of
 * this backend. Not wired into any page yet — no UI is included per scope.
 */
const config: Config = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-google-sans)", "sans-serif"],
        roboto: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
}
export default config
