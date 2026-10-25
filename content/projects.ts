/*
 * Selected Work.
 *
 * To add a project, add an entry below and put its thumbnail in
 * public/projects/. Projects appear on the homepage in this order.
 * Thumbnails are cropped to a 37:20 ratio (for example 2000 × 1080).
 */

export type Project = {
  slug: string;
  title: string;
  description: string;
  category: string;
  year: string;
  thumbnail: {
    src: string;
    alt: string;
  };
  /** Set to false to hide the project without deleting it. */
  published?: boolean;
};

export const projects: Project[] = [
  {
    slug: "project-one",
    title: "Project title one",
    description: "Placeholder: one or two sentences about the problem and your role.",
    category: "Category",
    year: "2026",
    thumbnail: { src: "/projects/project-one.webp", alt: "Placeholder thumbnail for project one" },
  },
  {
    slug: "project-two",
    title: "Project title two",
    description: "Placeholder: one or two sentences about the problem and your role.",
    category: "Category",
    year: "2026",
    thumbnail: { src: "/projects/project-two.webp", alt: "Placeholder thumbnail for project two" },
  },
  {
    slug: "project-three",
    title: "Project title three",
    description: "Placeholder: one or two sentences about the problem and your role.",
    category: "Category",
    year: "2025",
    thumbnail: { src: "/projects/project-three.webp", alt: "Placeholder thumbnail for project three" },
  },
  {
    slug: "project-four",
    title: "Project title four",
    description: "Placeholder: one or two sentences about the problem and your role.",
    category: "Category",
    year: "2025",
    thumbnail: { src: "/projects/project-four.webp", alt: "Placeholder thumbnail for project four" },
  },
];

export const publishedProjects = projects.filter((p) => p.published !== false);

export function getProject(slug: string) {
  return publishedProjects.find((p) => p.slug === slug);
}
