# Yoolim Kim — Portfolio

Personal UX and product design portfolio, built with Next.js (App Router), React, TypeScript and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Where to edit things

| To change | Edit |
| --- | --- |
| Name, intro, nav links, email, LinkedIn, resume link | `content/site.ts` |
| Projects (title, description, category, year, thumbnail) | `content/projects.ts` |
| Project thumbnails | `public/projects/` (37:20, for example 2000 × 1080) |
| Colors, type scale, spacing, motion | `app/globals.css` (the `:root` and `@theme` blocks) |
| Fonts | `lib/fonts.ts` (three roles: heading, subheading, body) |
| Resume file | add `public/resume.pdf` |

### Adding a project

Add an entry to `projects` in `content/projects.ts` and put its image in `public/projects/`. It appears on the homepage and gets a page at `/work/<slug>` automatically.

### Swapping fonts

`lib/fonts.ts` loads fonts with `next/font` and assigns them to three roles. Change the imports and the `fontHeading`, `fontSubheading` and `fontBody` constants; components only use the `font-heading`, `font-subheading` and `font-body` utilities, so nothing else needs to change. For local font files, use `next/font/local` in the same file.

### Placeholder images

`node scripts/make-placeholders.mjs` regenerates the labeled placeholder thumbnails.
