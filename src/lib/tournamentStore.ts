/**
 * Tournament room store — Supabase PostgreSQL + local file fallback.
 *
 * Production (Vercel): reads/writes to a Supabase `tournament_rooms` table
 *   via their REST API.  All lambda instances share the same database so
 *   state is consistent regardless of which cold/warm function handles the request.
 *
 * Local dev (no Supabase env vars): falls back to a /tmp JSON file, which
 *   works fine for single-machine testing.
 *
 * Required env vars (add to .env.local and Vercel):
 *   SUPABASE_URL              — e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — secret key from Project Settings → API
 *
 * Table schema (run once in Supabase SQL Editor):
 *   create table tournament_rooms (
 *     code        text primary key,
 *     data        jsonb not null,
 *     created_at  timestamptz default now(),
 *     expires_at  timestamptz not null
 *   );
 */

import fs   from "fs";
import path from "path";
import os   from "os";
import type { GameRoom } from "@/lib/tournamentTypes";

const EXPIRY_MS  = 3 * 60 * 60 * 1000;   // 3 hours
const STORE_FILE = path.join(os.tmpdir(), "scripture-tournament-rooms.json");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

// ── Supabase REST helpers ─────────────────────────────────────────────────────

function sbHeaders() {
  return {
    apikey:          SUPABASE_KEY!,
    Authorization:   `Bearer ${SUPABASE_KEY}`,
    "Content-Type":  "application/json",
  };
}

const TABLE = () => `${SUPABASE_URL?.replace(/\/+$/, "")}/rest/v1/tournament_rooms`;

async function sbGet(code: string): Promise<GameRoom | undefined> {
  const res = await fetch(`${TABLE()}?code=eq.${encodeURIComponent(code)}&select=data`, {
    headers: sbHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable)");
    console.error(`[tournamentStore] sbGet HTTP ${res.status}:`, body);
    throw new Error(`Supabase GET failed (${res.status}): ${body}`);
  }
  let rows: { data: GameRoom }[];
  try {
    rows = (await res.json()) as { data: GameRoom }[];
  } catch (e) {
    console.error("[tournamentStore] sbGet JSON parse error:", e);
    throw new Error("Supabase GET returned invalid JSON");
  }
  if (!Array.isArray(rows) || rows.length === 0) return undefined;
  return rows[0].data;
}

async function sbUpsert(room: GameRoom): Promise<void> {
  const expiresAt = new Date(room.createdAt + EXPIRY_MS).toISOString();
  const res = await fetch(TABLE(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates" },
    body:    JSON.stringify({ code: room.code, data: room, expires_at: expiresAt }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable)");
    console.error(`[tournamentStore] sbUpsert HTTP ${res.status}:`, body);
    throw new Error(`Supabase UPSERT failed (${res.status}): ${body}`);
  }
}

async function sbDelete(code: string): Promise<void> {
  const res = await fetch(`${TABLE()}?code=eq.${encodeURIComponent(code)}`, {
    method:  "DELETE",
    headers: sbHeaders(),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "(unreadable)");
    console.error(`[tournamentStore] sbDelete HTTP ${res.status}:`, body);
    // Non-fatal — log but don't throw
  }
}

// ── File-based fallback (local dev without Supabase) ─────────────────────────

function fileRead(): Record<string, GameRoom> {
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, GameRoom>;
  } catch { return {}; }
}

function fileWrite(store: Record<string, GameRoom>): void {
  try {
    const now = Date.now();
    const pruned: Record<string, GameRoom> = {};
    for (const [code, room] of Object.entries(store)) {
      if (now - room.createdAt < EXPIRY_MS) pruned[code] = room;
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(pruned), "utf-8");
  } catch (e) { console.error("[tournamentStore] file write error:", e); }
}

// ── Public async API ─────────────────────────────────────────────────────────

export async function createRoom(room: GameRoom): Promise<void> {
  if (USE_SUPABASE) {
    await sbUpsert(room);
  } else {
    const store = fileRead();
    store[room.code] = room;
    fileWrite(store);
  }
}

export async function getRoom(code: string): Promise<GameRoom | undefined> {
  const key = code.toUpperCase();
  if (USE_SUPABASE) {
    return sbGet(key);
  }
  return fileRead()[key];
}

export async function updateRoom(
  code: string,
  updater: (r: GameRoom) => GameRoom,
): Promise<GameRoom | null> {
  const key  = code.toUpperCase();
  const room = await getRoom(key);
  if (!room) return null;
  const updated = updater({ ...room, lastUpdated: Date.now() });
  if (USE_SUPABASE) {
    await sbUpsert(updated);
  } else {
    const store = fileRead();
    store[key]  = updated;
    fileWrite(store);
  }
  return updated;
}

export async function deleteRoom(code: string): Promise<void> {
  const key = code.toUpperCase();
  if (USE_SUPABASE) {
    await sbDelete(key);
  } else {
    const store = fileRead();
    delete store[key];
    fileWrite(store);
  }
}

export async function listRooms(): Promise<string[]> {
  if (USE_SUPABASE) return [];
  return Object.keys(fileRead());
}
