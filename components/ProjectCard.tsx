import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

type ProjectCardProps = {
  project: Project;
  /** Load the image eagerly when the card is likely above the fold. */
  priority?: boolean;
};

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article className="group">
      <Link
        href={`/work/${project.slug}`}
        className="block rounded-[var(--radius-media)] focus-visible:outline-offset-4"
      >
        <div className="relative aspect-[37/20] overflow-hidden rounded-[var(--radius-media)] bg-surface">
          <Image
            src={project.thumbnail.src}
            alt={project.thumbnail.alt}
            fill
            priority={priority}
            sizes="(min-width: 1536px) 720px, (min-width: 768px) 48vw, 100vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out)] will-change-transform group-hover:scale-[1.025]"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-media)] ring-1 ring-inset ring-black/[0.06]" />
          <p className="absolute bottom-4 left-4 hidden md:inline-flex items-center gap-1.5 rounded-full bg-chip px-3.5 py-1.5 text-meta text-ink shadow-[0_2px_8px_rgb(0_0_0/0.06)] backdrop-blur-sm">
            {project.category}
            <span aria-hidden="true" className="text-muted">
              ·
            </span>
            <span className="text-muted">{project.year}</span>
          </p>
        </div>

        <div className="mt-4 flex items-start justify-between gap-6 px-1">
          <div>
            <h3 className="font-heading text-title font-medium text-ink">
              <span className="link-underline pb-0.5 group-hover:bg-[length:100%_1px]">
                {project.title}
              </span>
              <span className="mt-0.5 block font-body text-meta font-normal text-muted md:hidden">
                {project.category} · {project.year}
              </span>
            </h3>
            <p className="mt-1 max-w-[52ch] text-body text-muted">{project.description}</p>
          </div>
          <span
            aria-hidden="true"
            className="mt-0.5 -translate-x-1 text-title text-ink opacity-0 transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </div>
      </Link>
    </article>
  );
}
