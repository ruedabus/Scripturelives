/**
 * File-backed game room store.
 *
 * Stores game state as JSON in /tmp/tournament-rooms.json so it survives
 * Next.js hot-module reloads and is shared across all API route handlers
 * regardless of how Next.js isolates module instances between routes.
 *
 * /tmp is available in both local development and Vercel serverless functions.
 * Rooms auto-expire after 3 hours.
 */

import fs from "fs";
import path from "path";
import os from "os";
import type { GameRoom } from "@/lib/tournamentTypes";

const EXPIRY_MS  = 3 * 60 * 60 * 1000; // 3 hours
const STORE_FILE = path.join(os.tmpdir(), "scripture-tournament-rooms.json");

// ── File I/O ─────────────────────────────────────────────────────────────────

function readStore(): Record<string, GameRoom> {
  try {
    const raw = fs.readFileSync(STORE_FILE, "utf-8");
    return JSON.parse(raw) as Record<string, GameRoom>;
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, GameRoom>): void {
  try {
    // Prune expired rooms before writing
    const now = Date.now();
    const pruned: Record<string, GameRoom> = {};
    for (const [code, room] of Object.entries(store)) {
      if (now - room.createdAt < EXPIRY_MS) pruned[code] = room;
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(pruned), "utf-8");
  } catch (e) {
    console.error("[tournamentStore] write error:", e);
  }
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export function createRoom(room: GameRoom): void {
  const store = readStore();
  store[room.code] = room;
  writeStore(store);
}

export function getRoom(code: string): GameRoom | undefined {
  const store = readStore();
  return store[code.toUpperCase()];
}

export function updateRoom(
  code: string,
  updater: (r: GameRoom) => GameRoom
): GameRoom | null {
  const store = readStore();
  const room  = store[code.toUpperCase()];
  if (!room) return null;
  const updated = updater({ ...room, lastUpdated: Date.now() });
  store[code.toUpperCase()] = updated;
  writeStore(store);
  return updated;
}

export function deleteRoom(code: string): void {
  const store = readStore();
  delete store[code.toUpperCase()];
  writeStore(store);
}

export function listRooms(): string[] {
  return Object.keys(readStore());
}
