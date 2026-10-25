import { listNotes } from "@/lib/guestbook/store";
import { Container } from "./Container";
import { GuestbookWall } from "./GuestbookWall";

/** "Leave a note" section: a short form and a wall of visitors' notes. */
export async function Guestbook() {
  const notes = await listNotes().catch((error) => {
    console.error(error);
    return [];
  });

  return (
    <section id="notes" aria-labelledby="notes-title" className="pb-24 md:pb-36">
      <Container>
        <GuestbookWall initialNotes={notes} />
      </Container>
    </section>
  );
}
