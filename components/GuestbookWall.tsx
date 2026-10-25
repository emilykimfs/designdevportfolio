"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { site } from "@/content/site";
import type { Note } from "@/lib/guestbook/store";

const copy = site.guestbook;

const COLORS = ["bg-note-1", "bg-note-2", "bg-note-3", "bg-note-4"];
const TILTS = [-1.6, 1.1, -0.6, 1.8, -1.2, 0.7];

/** Picks a stable color and tilt for a note from its id. */
function lookFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  hash = Math.abs(hash);
  return { color: COLORS[hash % COLORS.length], tilt: TILTS[hash % TILTS.length] };
}

const formatDate = (time: number) =>
  new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

type Status = { kind: "idle" | "sending" | "done" | "error"; message?: string };

export function GuestbookWall({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [freshId, setFreshId] = useState<string>();
  const startedAt = useRef(Date.now());

  const remaining = copy.maxLength - message.length;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    const website = new FormData(event.currentTarget).get("website");
    setStatus({ kind: "sending" });

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, name, website, startedAt: startedAt.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error ?? "Something went wrong. Try again?" });
        return;
      }
      if (data.note) {
        setNotes((current) => [data.note, ...current]);
        setFreshId(data.note.id);
      }
      setMessage("");
      setStatus({ kind: "done", message: data.pending ? copy.pendingThanks : copy.thanks });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach the wall. Check your connection?" });
    }
  }

  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-x-16">
      <div className="lg:sticky lg:top-8 lg:self-start">
        <div className="flex items-baseline gap-2 px-1">
          <h2 id="notes-title" className="font-heading text-title font-medium text-ink">
            {copy.title}
          </h2>
          <span className="text-meta tabular-nums text-muted">
            {String(notes.length).padStart(2, "0")}
            <span className="sr-only"> notes</span>
          </span>
        </div>
        <p className="mt-1 max-w-[44ch] px-1 text-body text-muted">{copy.intro}</p>

        <form onSubmit={submit} className="mt-6" noValidate>
          <div className="rounded-[var(--radius-media)] bg-surface p-1.5 transition-shadow duration-[var(--duration-fast)] focus-within:shadow-[0_0_0_1px_var(--ink)]">
            <label htmlFor="note-message" className="sr-only">
              Your note
            </label>
            <textarea
              id="note-message"
              name="message"
              required
              rows={4}
              maxLength={copy.maxLength}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={copy.placeholder}
              className="block w-full resize-none rounded-[calc(var(--radius-media)-0.375rem)] bg-paper px-4 py-3 text-body text-ink placeholder:text-muted focus:outline-none"
            />
            <div className="flex items-center gap-2 pl-2 pt-1.5">
              <label htmlFor="note-name" className="sr-only">
                Your name (optional)
              </label>
              <input
                id="note-name"
                name="name"
                autoComplete="given-name"
                maxLength={copy.maxNameLength}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.namePlaceholder}
                className="h-10 min-w-0 flex-1 bg-transparent text-meta text-ink placeholder:text-muted focus:outline-none"
              />
              <span
                aria-live="polite"
                className={`text-meta tabular-nums ${remaining < 20 ? "text-ink" : "text-muted"}`}
              >
                {remaining}
                <span className="sr-only"> characters left</span>
              </span>
              <button
                type="submit"
                disabled={!message.trim() || status.kind === "sending"}
                className="inline-flex h-10 items-center rounded-full bg-ink px-4 font-heading text-tab text-paper transition-[opacity,transform] duration-[var(--duration-fast)] hover:-translate-y-px disabled:pointer-events-none disabled:opacity-35"
              >
                {status.kind === "sending" ? "Pinning…" : copy.submit}
              </button>
            </div>
          </div>

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <p
            role="status"
            className={`mt-3 min-h-[1.4em] px-1 text-meta ${status.kind === "error" ? "text-ink" : "text-muted"}`}
          >
            {status.message}
          </p>
        </form>
      </div>

      {notes.length === 0 ? (
        <p className="grid min-h-48 place-items-center rounded-[var(--radius-media)] border border-dashed border-line px-6 text-center text-body text-muted">
          {copy.empty}
        </p>
      ) : (
        <ul className="columns-1 gap-5 sm:columns-2 2xl:columns-3">
          {notes.map((note) => {
            const { color, tilt } = lookFor(note.id);
            return (
              <li
                key={note.id}
                style={{ "--tilt": `${tilt}deg` } as CSSProperties}
                className={`mb-5 break-inside-avoid rounded-[var(--radius-media)] ${color} px-5 pb-4 pt-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_6px_20px_-8px_rgb(0_0_0/0.08)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] [transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_translateY(-2px)] ${
                  note.id === freshId ? "note-pin" : ""
                }`}
              >
                <p className="whitespace-pre-line text-pretty break-words text-body text-ink">{note.message}</p>
                <p className="mt-3 flex justify-between gap-4 text-meta text-muted">
                  <span className="truncate">{note.name || "Anonymous"}</span>
                  <time dateTime={new Date(note.createdAt).toISOString()} className="shrink-0 tabular-nums">
                    {formatDate(note.createdAt)}
                  </time>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
