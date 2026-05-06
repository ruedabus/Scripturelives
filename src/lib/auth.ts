/**
 * Supabase Auth helpers — server-side (API routes only).
 *
 * We use Supabase's built-in auth (email/password + Google OAuth).
 * The JWT from the client is verified here using the service role key.
 *
 * Client pages use the anon key via the browser SDK (see authClient.ts).
 */

import type { NextRequest } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id:    string;
  email: string;
};

export type UserProfile = {
  id:            string;   // matches auth.users.id
  username:      string;
  display_name:  string;
  avatar_url:    string | null;
  church_name:   string | null;
  church_city:   string | null;
  country:       string | null;
  // stats
  games_played:  number;
  games_won:     number;
  total_points:  number;
  win_streak:    number;
  best_streak:   number;
  elo:           number;
  created_at:    string;
  updated_at:    string;
};

export type MatchRecord = {
  id:             string;
  player1_id:     string;
  player2_id:     string;
  winner_id:      string;
  player1_score:  number;
  player2_score:  number;
  questions:      number;
  category:       string | null;
  played_at:      string;
};

export type EnrichedMatch = {
  id:              string;
  opponent_id:     string;
  opponent_name:   string;
  opponent_avatar: string | null;
  won:             boolean;
  my_score:        number;
  opponent_score:  number;
  category:        string | null;
  played_at:       string;
};

// ── Server-side auth helpers ──────────────────────────────────────────────────

function sbHeaders() {
  return {
    apikey:         SUPABASE_KEY,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Verify a JWT from the Authorization header and return the user, or null. */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const user = await res.json();
    if (!user?.id) return null;
    return { id: user.id, email: user.email };
  } catch { return null; }
}

// ── Profile helpers ────────────────────────────────────────────────────────────

const PROFILES = () => `${SUPABASE_URL}/rest/v1/profiles`;
const MATCHES  = () => `${SUPABASE_URL}/rest/v1/match_history`;

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const res = await fetch(
    `${PROFILES()}?id=eq.${encodeURIComponent(userId)}&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as UserProfile[];
  return rows[0] ?? null;
}

export async function getProfileByUsername(username: string): Promise<UserProfile | null> {
  const res = await fetch(
    `${PROFILES()}?username=eq.${encodeURIComponent(username)}&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as UserProfile[];
  return rows[0] ?? null;
}

export async function upsertProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile | null> {
  const res = await fetch(PROFILES(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=representation" },
    body:    JSON.stringify({ ...profile, updated_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    console.error("[auth] upsertProfile failed:", res.status, await res.text().catch(() => ""));
    return null;
  }
  const rows = await res.json() as UserProfile[];
  return rows[0] ?? null;
}

/** Fetch the last N matches for a user, enriched with opponent name/avatar. */
export async function getMatchHistory(userId: string, limit = 15): Promise<EnrichedMatch[]> {
  // Fetch raw matches where the user was player1 or player2
  const [r1, r2] = await Promise.all([
    fetch(`${MATCHES()}?player1_id=eq.${encodeURIComponent(userId)}&order=played_at.desc&limit=${limit}&select=*`, { headers: sbHeaders(), cache: "no-store" }),
    fetch(`${MATCHES()}?player2_id=eq.${encodeURIComponent(userId)}&order=played_at.desc&limit=${limit}&select=*`, { headers: sbHeaders(), cache: "no-store" }),
  ]);
  if (!r1.ok || !r2.ok) return [];

  const [rows1, rows2] = await Promise.all([r1.json() as Promise<MatchRecord[]>, r2.json() as Promise<MatchRecord[]>]);
  const all = [...rows1, ...rows2].sort((a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()).slice(0, limit);

  if (all.length === 0) return [];

  // Collect unique opponent IDs
  const opponentIds = [...new Set(all.map((m) => m.player1_id === userId ? m.player2_id : m.player1_id))];
  const opponentMap = new Map<string, { name: string; avatar: string | null }>();

  // Bulk-fetch opponent profiles in one query
  const ids = opponentIds.map((id) => `id.eq.${encodeURIComponent(id)}`).join(",");
  const pr = await fetch(`${PROFILES()}?or=(${ids})&select=id,display_name,avatar_url`, { headers: sbHeaders(), cache: "no-store" });
  if (pr.ok) {
    const profiles = await pr.json() as Array<{ id: string; display_name: string; avatar_url: string | null }>;
    for (const p of profiles) opponentMap.set(p.id, { name: p.display_name, avatar: p.avatar_url });
  }

  return all.map((m) => {
    const isP1      = m.player1_id === userId;
    const oppId     = isP1 ? m.player2_id : m.player1_id;
    const opp       = opponentMap.get(oppId);
    return {
      id:              m.id,
      opponent_id:     oppId,
      opponent_name:   opp?.name ?? "Unknown",
      opponent_avatar: opp?.avatar ?? null,
      won:             m.winner_id === userId,
      my_score:        isP1 ? m.player1_score : m.player2_score,
      opponent_score:  isP1 ? m.player2_score : m.player1_score,
      category:        m.category,
      played_at:       m.played_at,
    };
  });
}

export async function getLeaderboard(limit = 50, offset = 0): Promise<UserProfile[]> {
  const res = await fetch(
    `${PROFILES()}?select=*&order=elo.desc,games_won.desc&limit=${limit}&offset=${offset}`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  return (await res.json()) as UserProfile[];
}

export async function getChurchLeaderboard(limit = 20): Promise<{ church_name: string; church_city: string | null; country: string | null; total_wins: number; total_points: number; player_count: number }[]> {
  // Aggregate by church_name using PostgREST
  const res = await fetch(
    `${PROFILES()}?select=church_name,church_city,country,games_won,total_points&church_name=not.is.null&limit=500`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as UserProfile[];

  // Aggregate client-side (simple for now; can move to a DB view later)
  const map = new Map<string, { church_name: string; church_city: string | null; country: string | null; total_wins: number; total_points: number; player_count: number }>();
  for (const r of rows) {
    if (!r.church_name) continue;
    const key = r.church_name;
    const cur = map.get(key) ?? { church_name: r.church_name, church_city: r.church_city, country: r.country, total_wins: 0, total_points: 0, player_count: 0 };
    cur.total_wins   += r.games_won ?? 0;
    cur.total_points += r.total_points ?? 0;
    cur.player_count += 1;
    map.set(key, cur);
  }
  return [...map.values()]
    .sort((a, b) => b.total_wins - a.total_wins)
    .slice(0, limit);
}

export async function recordMatch(match: Omit<MatchRecord, "id" | "played_at">): Promise<void> {
  // Save match
  const res = await fetch(MATCHES(), {
    method:  "POST",
    headers: sbHeaders(),
    body:    JSON.stringify({ ...match, played_at: new Date().toISOString() }),
  });
  if (!res.ok) {
    console.error("[auth] recordMatch failed:", res.status, await res.text().catch(() => ""));
    return;
  }

  // Update both players' stats
  await Promise.all([
    updatePlayerStats(match.player1_id, match.winner_id === match.player1_id, match.player1_score),
    updatePlayerStats(match.player2_id, match.winner_id === match.player2_id, match.player2_score),
  ]);
}

/** Update stats for a single player — safe to call even if they have no profile yet. */
export async function updatePlayerStatsById(supabaseUserId: string, won: boolean, points: number): Promise<void> {
  return updatePlayerStats(supabaseUserId, won, points);
}

async function updatePlayerStats(playerId: string, won: boolean, points: number): Promise<void> {
  // Fetch current profile
  const profile = await getProfile(playerId);
  if (!profile) return;

  const newStreak   = won ? profile.win_streak + 1 : 0;
  const newBest     = Math.max(profile.best_streak, newStreak);
  // Simple ELO delta: +20 for win, -15 for loss (we can tune this)
  const eloDelta    = won ? 20 : -15;

  await upsertProfile({
    id:           playerId,
    games_played: profile.games_played + 1,
    games_won:    profile.games_won + (won ? 1 : 0),
    total_points: profile.total_points + points,
    win_streak:   newStreak,
    best_streak:  newBest,
    elo:          Math.max(0, profile.elo + eloDelta),
  });
}
