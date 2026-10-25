import { Guestbook } from "@/components/Guestbook";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";

// Picks up new guestbook notes at least every five minutes. Posting a note
// also refreshes the page right away.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Guestbook />
    </>
  );
}
