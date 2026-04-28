/**
 * Tournament room store — Upstash Redis + local file fallback.
 *
 * Production (Vercel): uses Upstash Redis REST API so all lambda instances
 *   share the same state regardless of which cold/warm instance handles each
 *   request.  Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in your
 *   Vercel environment and in .env.local for local testing.
 *
 * Local dev without Redis env vars: falls back to a JSON file in /tmp.
 *   This works fine for a single-machine dev session.
 *
 * All functions are async.  Rooms expire after 3 hours.
 */

import fs   from "fs";
import path from "path";
import os   from "os";
import type { GameRoom } from "@/lib/tournamentTypes";

const EXPIRY_SEC  = 3 * 60 * 60;        // 3 hours in seconds (for Redis TTL)
const EXPIRY_MS   = EXPIRY_SEC * 1000;
const STORE_FILE  = path.join(os.tmpdir(), "scripture-tournament-rooms.json");
const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const USE_REDIS   = !!(REDIS_URL && REDIS_TOKEN);

// ── Redis helpers (Upstash REST API — no npm package needed) ─────────────────

async function redisCmd(command: unknown[]): Promise<unknown> {
  const res = await fetch(REDIS_URL!, {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

async function redisGet(key: string): Promise<string | null> {
  return (await redisCmd(["GET", key])) as string | null;
}

async function redisSet(key: string, value: string): Promise<void> {
  await redisCmd(["SET", key, value, "EX", EXPIRY_SEC]);
}

async function redisDel(key: string): Promise<void> {
  await redisCmd(["DEL", key]);
}

// ── File-based fallback (local dev) ──────────────────────────────────────────

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
  if (USE_REDIS) {
    await redisSet(`tournament:${room.code}`, JSON.stringify(room));
  } else {
    const store = fileRead();
    store[room.code] = room;
    fileWrite(store);
  }
}

export async function getRoom(code: string): Promise<GameRoom | undefined> {
  const key = code.toUpperCase();
  if (USE_REDIS) {
    const raw = await redisGet(`tournament:${key}`);
    return raw ? (JSON.parse(raw) as GameRoom) : undefined;
  } else {
    return fileRead()[key];
  }
}

export async function updateRoom(
  code: string,
  updater: (r: GameRoom) => GameRoom,
): Promise<GameRoom | null> {
  const key  = code.toUpperCase();
  const room = await getRoom(key);
  if (!room) return null;
  const updated = updater({ ...room, lastUpdated: Date.now() });
  if (USE_REDIS) {
    await redisSet(`tournament:${key}`, JSON.stringify(updated));
  } else {
    const store = fileRead();
    store[key]  = updated;
    fileWrite(store);
  }
  return updated;
}

export async function deleteRoom(code: string): Promise<void> {
  const key = code.toUpperCase();
  if (USE_REDIS) {
    await redisDel(`tournament:${key}`);
  } else {
    const store = fileRead();
    delete store[key];
    fileWrite(store);
  }
}

export async function listRooms(): Promise<string[]> {
  if (USE_REDIS) return []; // not needed for production
  return Object.keys(fileRead());
}
