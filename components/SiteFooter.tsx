import { site } from "@/content/site";
import { Container } from "./Container";
import { Emphasis } from "./Emphasis";

export function SiteFooter() {
  const { closing, invitation, email, linkedin, resume } = site.contact;
  const links = [
    { label: "Email", href: `mailto:${email}` },
    { label: "LinkedIn", href: linkedin, external: true },
    { label: "Resume", href: resume, external: true },
  ];

  return (
    <footer>
      <Container>
        <div className="flex flex-col gap-10 border-t border-line pb-10 pt-14 md:flex-row md:items-end md:justify-between md:pt-20">
          <div>
            <p className="text-balance font-heading text-name font-medium text-ink">{closing}</p>
            <p className="mt-3 max-w-[48ch] text-intro text-muted">
              <a href={`mailto:${email}`} className="hover:[&_span]:underline">
                <Emphasis text={invitation.replace("{email}", email)} />
              </a>
            </p>
          </div>

          <nav aria-label="Contact">
            <ul className="-ml-3 flex flex-wrap gap-1 md:ml-0 md:-mr-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="inline-flex h-10 items-center rounded-full px-3 text-tab text-muted transition-colors duration-[var(--duration-fast)] hover:bg-surface hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pb-8 text-meta text-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}
          </p>
          <a href="#main" className="link-underline self-start pb-0.5 hover:text-ink">
            Back to top ↑
          </a>
        </div>
      </Container>
    </footer>
  );
}
