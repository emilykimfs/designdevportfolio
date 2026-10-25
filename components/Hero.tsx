import { site } from "@/content/site";
import { Container } from "./Container";
import { Emphasis } from "./Emphasis";
import { PrimaryNav } from "./PrimaryNav";
import { Reveal } from "./Reveal";

export function Hero() {
  const { greeting, aside, intro } = site.hero;

  return (
    <section aria-labelledby="hero-title" className="pt-24 sm:pt-32 lg:pt-36">
      <Container>
        <Reveal delay={60}>
          <h1 id="hero-title" className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-heading text-name font-medium text-ink">{greeting}</span>
            <span className="font-subheading text-intro text-muted">{aside}</span>
          </h1>
        </Reveal>

        <Reveal delay={180} className="mt-4 sm:mt-5">
          {intro.map((line) => (
            <p key={line} className="max-w-[60ch] text-pretty font-body text-intro text-muted xl:max-w-none">
              <Emphasis text={line} />
            </p>
          ))}
        </Reveal>

        <Reveal delay={300} className="mt-8 sm:mt-10">
          <PrimaryNav active="Work" />
        </Reveal>
      </Container>
    </section>
  );
}
