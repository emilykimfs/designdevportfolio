import Link from "next/link";
import { site } from "@/content/site";

type PrimaryNavProps = {
  /** Label of the tab for the current page. */
  active: (typeof site.nav)[number]["label"];
};

/** Pill tabs under the introduction, with a hairline rule beneath. */
export function PrimaryNav({ active }: PrimaryNavProps) {
  return (
    <nav aria-label="Primary" className="border-b border-line pb-4">
      <ul className="-ml-3 flex items-center gap-1 sm:-ml-4">
        {site.nav.map((item) => {
          const isActive = item.label === active;
          const external = "external" in item && item.external;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`inline-flex h-10 items-center rounded-full px-3 font-heading text-tab transition-colors duration-[var(--duration-fast)] sm:px-4 ${
                  isActive ? "bg-surface text-ink" : "text-muted hover:bg-surface/70 hover:text-ink"
                }`}
              >
                {item.label}
                {external && (
                  <span aria-hidden="true" className="ml-1 text-[0.8em]">
                    ↗
                  </span>
                )}
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
