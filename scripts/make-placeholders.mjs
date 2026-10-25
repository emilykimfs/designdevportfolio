// Generates neutral, clearly labeled placeholder thumbnails in public/projects/.
// Run with: node scripts/make-placeholders.mjs
// Replace the output files with real project images when you have them.
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const width = 2000;
const height = 1080;
const tones = [
  ["#e9e6df", "#d9d4c9"],
  ["#e3e6e4", "#cdd3cf"],
  ["#e8e3e3", "#d6cdcc"],
  ["#e2e4e9", "#ccd0d8"],
];
const names = ["one", "two", "three", "four"];

await mkdir("public/projects", { recursive: true });

for (const [i, name] of names.entries()) {
  const [bg, shape] = tones[i];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${bg}"/>
      <rect x="${width * 0.3}" y="${height * 0.16}" width="${width * 0.4}" height="${height * 0.68}" rx="28" fill="${shape}"/>
      <text x="${width - 64}" y="${height - 64}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#71717a" letter-spacing="1">
        PLACEHOLDER · PROJECT ${String(i + 1).padStart(2, "0")}
      </text>
    </svg>`;
  await sharp(Buffer.from(svg)).webp({ quality: 82 }).toFile(`public/projects/project-${name}.webp`);
}
