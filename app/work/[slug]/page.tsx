import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { getProject, publishedProjects } from "@/content/projects";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return publishedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return { title: project?.title };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <PlaceholderPage eyebrow={`${project.category} · ${project.year}`} title={project.title}>
      <p>Case study coming soon.</p>
    </PlaceholderPage>
  );
}
