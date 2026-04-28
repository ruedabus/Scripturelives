/**
 * In-memory game room store.
 *
 * Uses a Node.js global so the Map survives Next.js hot-module reloads in dev
 * and is shared across all API routes in the same process (no "Room not found"
 * errors caused by each route getting a fresh module instance).
 *
 * On Vercel, game sessions are short (< 1 hour) and the same warm lambda
 * instance handles requests from the same origin within a session.
 * Rooms auto-expire after 3 hours.
 */

import type { GameRoom } from "@/lib/tournamentTypes";

const EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

// ── Singleton pattern — survives hot reloads in dev ────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __tournamentRooms: Map<string, GameRoom> | undefined;
  // eslint-disable-next-line no-var
  var __tournamentPruneStarted: boolean | undefined;
}

const rooms: Map<string, GameRoom> =
  globalThis.__tournamentRooms ??
  (globalThis.__tournamentRooms = new Map<string, GameRoom>());

// ── Prune expired rooms periodically (only start one timer per process) ────
function pruneExpired() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.createdAt > EXPIRY_MS) rooms.delete(code);
  }
}
if (!globalThis.__tournamentPruneStarted) {
  globalThis.__tournamentPruneStarted = true;
  setInterval(pruneExpired, 10 * 60 * 1000); // every 10 min
}

// ── CRUD ────────────────────────────────────────────────────────────────────
export function createRoom(room: GameRoom): void {
  rooms.set(room.code, room);
}

export function getRoom(code: string): GameRoom | undefined {
  return rooms.get(code.toUpperCase());
}

export function updateRoom(code: string, updater: (r: GameRoom) => GameRoom): GameRoom | null {
  const room = rooms.get(code.toUpperCase());
  if (!room) return null;
  const updated = updater({ ...room, lastUpdated: Date.now() });
  rooms.set(code.toUpperCase(), updated);
  return updated;
}

export function deleteRoom(code: string): void {
  rooms.delete(code.toUpperCase());
}

export function listRooms(): string[] {
  return [...rooms.keys()];
}
