import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "./Container";

export function SiteHeader() {
  return (
    <header className="relative z-10">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-meta focus:text-paper"
      >
        Skip to content
      </a>
      <Container className="flex items-center pt-6 sm:pt-8">
        <Link href="/" className="group inline-flex items-center gap-3" aria-label={`${site.name}, home`}>
          <span
            aria-hidden="true"
            className="grid size-10 place-items-center rounded-[10px] bg-ink font-heading text-[0.9375rem] font-semibold tracking-[0.02em] text-paper transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] group-hover:-rotate-6 sm:size-11"
          >
            {site.initials}
          </span>
          <span className="font-heading text-[0.9375rem] font-medium text-ink">{site.name}</span>
        </Link>
      </Container>
    </header>
  );
}
