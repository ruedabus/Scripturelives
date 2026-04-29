/**
 * Challenge system — server-side helpers.
 * Uses Supabase service role (no RLS needed).
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const TABLE = () => `${SUPABASE_URL}/rest/v1/challenges`;

function sbHeaders() {
  return {
    apikey:         SUPABASE_KEY,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type Challenge = {
  id:                   string;
  code:                 string;            // 6-char shareable code
  challenger_id:        string;            // Supabase user ID
  challenger_name:      string;
  challenger_emoji:     string;
  challenger_elo:       number;
  challenger_player_id: string;            // pre-assigned in-game player ID
  challenged_player_id: string | null;     // assigned on acceptance
  categories:           string[];
  status:               "pending" | "accepted" | "declined" | "expired";
  room_code:            string | null;     // set when accepted
  created_at:           string;
  expires_at:           string;
};

// ── Code generation ───────────────────────────────────────────────────────────

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generateChallengeCode(): string {
  return Array.from({ length: 6 }, () =>
    CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join("");
}

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function createChallenge(
  data: Pick<
    Challenge,
    | "code"
    | "challenger_id"
    | "challenger_name"
    | "challenger_emoji"
    | "challenger_elo"
    | "challenger_player_id"
    | "categories"
  >
): Promise<Challenge | null> {
  const res = await fetch(TABLE(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation" },
    body:    JSON.stringify({
      ...data,
      challenged_player_id: null,
      status:     "pending",
      room_code:  null,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }),
  });
  if (!res.ok) {
    console.error("[challenges] createChallenge failed:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const rows = await res.json() as Challenge[];
  return rows[0] ?? null;
}

export async function getChallenge(code: string): Promise<Challenge | null> {
  const res = await fetch(
    `${TABLE()}?code=eq.${encodeURIComponent(code)}&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as Challenge[];
  return rows[0] ?? null;
}

export async function acceptChallenge(
  code: string,
  challengedPlayerId: string,
  roomCode: string
): Promise<void> {
  await fetch(`${TABLE()}?code=eq.${encodeURIComponent(code)}`, {
    method:  "PATCH",
    headers: sbHeaders(),
    body:    JSON.stringify({
      status:               "accepted",
      challenged_player_id: challengedPlayerId,
      room_code:            roomCode,
    }),
  });
}

export async function declineChallenge(code: string): Promise<void> {
  await fetch(`${TABLE()}?code=eq.${encodeURIComponent(code)}`, {
    method:  "PATCH",
    headers: sbHeaders(),
    body:    JSON.stringify({ status: "declined" }),
  });
}
