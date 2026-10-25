import { site } from "@/content/site";

const { maxLength, maxNameLength, blockedWords } = site.guestbook;

const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|xyz|ru|ly|co)\b)/i;

/** Collapses whitespace and strips control characters. */
function clean(text: string) {
  return text
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[^\S\n]+/g, " ")
    .trim();
}

export type NoteInput = { name: string; message: string };

/** Returns the cleaned note, or an error message to show the visitor. */
export function validateNote(raw: { name?: unknown; message?: unknown }): NoteInput | { error: string } {
  const message = clean(String(raw.message ?? ""));
  const name = clean(String(raw.name ?? "")).replace(/\n/g, " ");

  if (!message) return { error: "Write a note first." };
  if (message.length > maxLength) return { error: `Keep it under ${maxLength} characters.` };
  if (name.length > maxNameLength) return { error: `Keep your name under ${maxNameLength} characters.` };
  if (LINK.test(message) || LINK.test(name)) return { error: "Links aren't allowed in notes." };

  const lower = `${name} ${message}`.toLowerCase();
  if (blockedWords.some((word) => lower.includes(word.toLowerCase()))) {
    return { error: "That note can't be posted." };
  }

  return { name, message };
}
