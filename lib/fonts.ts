import { Instrument_Sans } from "next/font/google";

/*
 * Typography roles.
 *
 * Every font on the site comes from one of these three roles. To swap in
 * different fonts (for example the ones from the Figma file), change the
 * import and the three constants below. Components never reference a font
 * family directly; they use the `font-heading`, `font-subheading` and
 * `font-body` Tailwind utilities, which map to these CSS variables in
 * app/globals.css. If a role gets its own family, also point its
 * `--font-*-family` variable in globals.css at the new variable name.
 */

const sans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-family-sans",
});

export const fontHeading = sans;
export const fontSubheading = sans;
export const fontBody = sans;

export const fontVariables = [
  ...new Set([fontHeading.variable, fontSubheading.variable, fontBody.variable]),
].join(" ");
