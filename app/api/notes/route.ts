import { createHash, randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { site } from "@/content/site";
import { addNote, isRateLimited, listNotes, type Note } from "@/lib/guestbook/store";
import { validateNote } from "@/lib/guestbook/validate";

const { rateLimit, requireApproval } = site.guestbook;

// Real people take a moment to write; bots tend to submit instantly.
const MIN_FILL_MS = 2500;

export async function GET() {
  return NextResponse.json({ notes: await listNotes() });
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Something went wrong. Try again?" }, { status: 400 });
  }

  // Honeypot: a field hidden from people that bots tend to fill in. Pretend
  // it worked so they don't retry.
  const elapsed = Date.now() - Number(body.startedAt);
  const tooFast = !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS;
  if (body.website || tooFast) {
    return NextResponse.json({ ok: true, pending: true });
  }

  const result = validateNote(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Only a hash of the address is stored, and only for an hour.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const visitor = createHash("sha256").update(`notes:${ip}`).digest("hex").slice(0, 32);
  if (await isRateLimited(visitor, rateLimit)) {
    return NextResponse.json({ error: "You've left a few notes already. Try again in a bit!" }, { status: 429 });
  }

  const note: Note = {
    id: randomUUID(),
    name: result.name,
    message: result.message,
    createdAt: Date.now(),
  };

  try {
    await addNote(note, requireApproval ? "pending" : "approved");
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Couldn't save your note. Try again?" }, { status: 500 });
  }

  if (requireApproval) return NextResponse.json({ ok: true, pending: true });
  revalidatePath("/");
  return NextResponse.json({ ok: true, note });
}
