import { publishedProjects } from "@/content/projects";
import { Container } from "./Container";
import { ProjectCard } from "./ProjectCard";
import { Reveal } from "./Reveal";

export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="pb-24 pt-8 sm:pt-10 md:pb-36">
      <Container>
        <Reveal delay={380} className="mb-6 flex items-baseline gap-2 px-1">
          <h2 id="work-title" className="font-heading text-title font-medium text-ink">
            Selected Work
          </h2>
          <span className="text-meta tabular-nums text-muted">
            {String(publishedProjects.length).padStart(2, "0")}
            <span className="sr-only"> projects</span>
          </span>
        </Reveal>

        <Reveal delay={460}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 md:gap-y-14 xl:gap-x-8">
            {publishedProjects.map((project, index) => (
              <li key={project.slug}>
                <ProjectCard project={project} priority={index < 2} />
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
