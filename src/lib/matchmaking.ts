/**
 * Matchmaking queue — server-side helpers.
 * Uses Supabase service role key (no RLS needed on this table).
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const QUEUE = () => `${SUPABASE_URL}/rest/v1/matchmaking_queue`;

function sbHeaders() {
  return {
    apikey:         SUPABASE_KEY,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

export type QueueEntry = {
  id:           string;
  user_id:      string;   // Supabase auth user ID
  display_name: string;
  avatar_emoji: string;
  elo:          number;
  categories:   string[];
  status:       "waiting" | "matched" | "cancelled";
  room_code:    string | null;
  player_id:    string | null;  // in-game player ID assigned when matched
  matched_at:   string | null;
  created_at:   string;
  expires_at:   string;
};

// ── Queue CRUD ───────────────────────────────────────────────────────────────

/** Add or replace the queue entry for this user. */
export async function enterQueue(
  entry: Pick<QueueEntry, "user_id" | "display_name" | "avatar_emoji" | "elo" | "categories">
): Promise<QueueEntry | null> {
  // Upsert by user_id so re-entering is safe
  const res = await fetch(QUEUE(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=representation" },
    body:    JSON.stringify({
      ...entry,
      status:     "waiting",
      room_code:  null,
      player_id:  null,
      matched_at: null,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    }),
  });
  if (!res.ok) {
    console.error("[matchmaking] enterQueue failed:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const rows = await res.json() as QueueEntry[];
  return rows[0] ?? null;
}

/** Find the best-available waiting opponent (oldest entry, not expired). */
export async function findOpponent(excludeUserId: string): Promise<QueueEntry | null> {
  const now = new Date().toISOString();
  const res = await fetch(
    `${QUEUE()}?status=eq.waiting&user_id=neq.${encodeURIComponent(excludeUserId)}&expires_at=gt.${encodeURIComponent(now)}&order=created_at.asc&limit=1`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as QueueEntry[];
  return rows[0] ?? null;
}

/** Get the current queue entry for a user (to poll status). */
export async function getQueueEntry(userId: string): Promise<QueueEntry | null> {
  const res = await fetch(
    `${QUEUE()}?user_id=eq.${encodeURIComponent(userId)}&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as QueueEntry[];
  return rows[0] ?? null;
}

/** Update a queue entry (patch by user_id). */
export async function updateQueueEntry(userId: string, patch: Partial<QueueEntry>): Promise<void> {
  await fetch(
    `${QUEUE()}?user_id=eq.${encodeURIComponent(userId)}`,
    {
      method:  "PATCH",
      headers: sbHeaders(),
      body:    JSON.stringify(patch),
    }
  );
}

/** Remove a user from the queue. */
export async function removeFromQueue(userId: string): Promise<void> {
  await fetch(
    `${QUEUE()}?user_id=eq.${encodeURIComponent(userId)}`,
    { method: "DELETE", headers: sbHeaders() }
  );
}
