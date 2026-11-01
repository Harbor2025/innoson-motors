# Brochure fonts

Inter (Regular, SemiBold, Bold) is bundled here because the brochure PDF
generator (`src/lib/vehicle-brochure.ts`) embeds it at runtime — the browser
cannot reuse the webfont files loaded by `next/font`.

- Source: <https://fonts.google.com/specimen/Inter> (static TTFs from Google Fonts)
- License: SIL Open Font License 1.1 — <https://openfontlicense.org>
- Author: Rasmus Andersson

If you swap these files, keep the same filenames (`Inter-Regular.ttf`,
`Inter-SemiBold.ttf`, `Inter-Bold.ttf`) or update `FONT_FILES` in the generator.
