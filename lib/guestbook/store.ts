import "server-only";

/*
 * Where guestbook notes are saved.
 *
 * In production, notes live in Upstash Redis (add it from the Vercel
 * Marketplace and the env vars below are set for you). Without those env
 * vars, for example when running locally, notes are kept in memory and
 * disappear when the server restarts.
 */

export type Note = {
  id: string;
  name: string;
  message: string;
  createdAt: number;
};

type Status = "approved" | "pending";

const KEYS = { approved: "notes:approved", pending: "notes:pending" } as const;
// Oldest notes beyond this are dropped from the wall.
const MAX_NOTES = 200;

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const usingRedis = Boolean(redisUrl && redisToken);

/** Sends commands to Upstash's REST API in one round trip. */
async function redis(...commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}` },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Redis request failed: ${res.status}`);
  const results = (await res.json()) as { result?: unknown; error?: string }[];
  return results.map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

// In-memory fallback, kept on globalThis so it survives hot reloads in dev.
const memory = ((globalThis as { __guestbook?: Record<string, string[]> }).__guestbook ??= {});
const hits = ((globalThis as { __guestbookHits?: Map<string, number[]> }).__guestbookHits ??= new Map<string, number[]>());

function parse(values: unknown): Note[] {
  return (Array.isArray(values) ? values : []).flatMap((v) => {
    try {
      return [JSON.parse(String(v)) as Note];
    } catch {
      return [];
    }
  });
}

/** Newest first. */
export async function listNotes(status: Status = "approved"): Promise<Note[]> {
  if (!usingRedis) return parse(memory[KEYS[status]]);
  const [values] = await redis(["LRANGE", KEYS[status], 0, MAX_NOTES - 1]);
  return parse(values);
}

export async function addNote(note: Note, status: Status) {
  const value = JSON.stringify(note);
  if (!usingRedis) {
    memory[KEYS[status]] = [value, ...(memory[KEYS[status]] ?? [])].slice(0, MAX_NOTES);
    return;
  }
  await redis(["LPUSH", KEYS[status], value], ["LTRIM", KEYS[status], 0, MAX_NOTES - 1]);
}

/** Removes a note from a list and returns it, if it was there. */
export async function removeNote(id: string, status: Status): Promise<Note | undefined> {
  const note = (await listNotes(status)).find((n) => n.id === id);
  if (!note) return undefined;
  const value = JSON.stringify(note);
  if (!usingRedis) {
    memory[KEYS[status]] = (memory[KEYS[status]] ?? []).filter((v) => v !== value);
  } else {
    await redis(["LREM", KEYS[status], 0, value]);
  }
  return note;
}

export async function approveNote(id: string) {
  const note = await removeNote(id, "pending");
  if (note) await addNote(note, "approved");
}

/**
 * Counts a submission from `visitor` and reports whether it is over
 * `limit` within the last hour.
 */
export async function isRateLimited(visitor: string, limit: number): Promise<boolean> {
  const windowMs = 60 * 60 * 1000;
  if (!usingRedis) {
    const now = Date.now();
    const recent = (hits.get(visitor) ?? []).filter((t) => now - t < windowMs);
    recent.push(now);
    hits.set(visitor, recent);
    return recent.length > limit;
  }
  const key = `notes:rate:${visitor}`;
  const [count] = await redis(["INCR", key], ["EXPIRE", key, windowMs / 1000, "NX"]);
  return Number(count) > limit;
}
