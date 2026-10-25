"use client";

import { useState, type FormEvent } from "react";
import type { Note } from "@/lib/guestbook/store";

type Lists = { approved: Note[]; pending: Note[] };

/** Password-gated list of notes with approve and delete buttons. */
export function GuestbookAdmin() {
  const [password, setPassword] = useState("");
  const [lists, setLists] = useState<Lists>();
  const [error, setError] = useState<string>();

  async function load(event?: FormEvent) {
    event?.preventDefault();
    const res = await fetch("/api/notes/admin", { headers: { "x-admin-password": password } });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setError(undefined);
    setLists(data);
  }

  async function act(id: string, action: "approve" | "delete") {
    const res = await fetch("/api/notes/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) return setError((await res.json()).error);
    await load();
  }

  if (!lists) {
    return (
      <form onSubmit={load} className="mt-10 flex max-w-sm gap-2">
        <label htmlFor="admin-password" className="sr-only">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="h-10 min-w-0 flex-1 rounded-full bg-surface px-4 text-body text-ink placeholder:text-muted"
        />
        <button type="submit" className="h-10 rounded-full bg-ink px-4 font-heading text-tab text-paper">
          Open
        </button>
        {error && <p className="self-center text-meta text-ink">{error}</p>}
      </form>
    );
  }

  return (
    <div className="mt-10 grid gap-12">
      {error && <p className="text-meta text-ink">{error}</p>}
      {(["pending", "approved"] as const).map((status) => (
        <div key={status}>
          <h2 className="border-b border-line pb-3 font-heading text-title font-medium text-ink">
            {status === "pending" ? "Waiting for approval" : "On the wall"}{" "}
            <span className="text-meta font-normal tabular-nums text-muted">{lists[status].length}</span>
          </h2>
          <ul>
            {lists[status].map((note) => (
              <li key={note.id} className="flex items-start gap-6 border-b border-line py-4">
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-line break-words text-body text-ink">{note.message}</p>
                  <p className="mt-1 text-meta text-muted">
                    {note.name || "Anonymous"} · {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  {status === "pending" && (
                    <button
                      onClick={() => act(note.id, "approve")}
                      className="h-9 rounded-full bg-ink px-3.5 text-meta text-paper"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => act(note.id, "delete")}
                    className="h-9 rounded-full px-3.5 text-meta text-muted hover:bg-surface hover:text-ink"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
