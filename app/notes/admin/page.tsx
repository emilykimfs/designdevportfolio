import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { GuestbookAdmin } from "@/components/GuestbookAdmin";

export const metadata: Metadata = {
  title: "Manage notes",
  robots: { index: false, follow: false },
};

export default function NotesAdminPage() {
  return (
    <Container as="section" className="pb-32 pt-24 sm:pt-32">
      <h1 className="font-heading text-name font-medium text-ink">Manage notes</h1>
      <p className="mt-3 max-w-[52ch] text-intro text-muted">Approve or remove notes on your wall.</p>
      <GuestbookAdmin />
    </Container>
  );
}
