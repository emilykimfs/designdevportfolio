import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { approveNote, listNotes, removeNote } from "@/lib/guestbook/store";

/** Checks the password against GUESTBOOK_ADMIN_PASSWORD. */
function authorized(request: NextRequest) {
  const expected = process.env.GUESTBOOK_ADMIN_PASSWORD;
  const given = request.headers.get("x-admin-password") ?? "";
  if (!expected || given.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

const denied = () => NextResponse.json({ error: "Wrong password." }, { status: 401 });

export async function GET(request: NextRequest) {
  if (!authorized(request)) return denied();
  const [approved, pending] = await Promise.all([listNotes("approved"), listNotes("pending")]);
  return NextResponse.json({ approved, pending });
}

/** Body: { id, action: "approve" | "delete" } */
export async function POST(request: NextRequest) {
  if (!authorized(request)) return denied();
  const { id, action } = (await request.json().catch(() => ({}))) as { id?: string; action?: string };
  if (!id) return NextResponse.json({ error: "Missing note." }, { status: 400 });

  if (action === "approve") {
    await approveNote(id);
  } else if (action === "delete") {
    await removeNote(id, "approved");
    await removeNote(id, "pending");
  } else {
    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
