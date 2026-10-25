import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./Container";
import { PrimaryNav } from "./PrimaryNav";

type PlaceholderPageProps = {
  /** Highlights a tab in the navigation, if this page has one. */
  activeTab?: "Work" | "About";
  eyebrow?: string;
  title: string;
  children?: ReactNode;
};

/** Simple page shell for sections that are not designed yet. */
export function PlaceholderPage({ activeTab = "Work", eyebrow, title, children }: PlaceholderPageProps) {
  return (
    <Container as="section" className="pb-32 pt-24 sm:pt-32 lg:pt-36">
      <PrimaryNav active={activeTab} />
      {eyebrow && <p className="mt-12 text-meta text-muted">{eyebrow}</p>}
      <h1 className={`${eyebrow ? "mt-2" : "mt-12"} font-heading text-name font-medium text-ink`}>{title}</h1>
      <div className="mt-4 max-w-[52ch] text-intro text-muted">{children}</div>
      <Link href="/" className="link-underline mt-10 inline-block pb-0.5 text-meta text-muted hover:text-ink">
        ← Back to work
      </Link>
    </Container>
  );
}
