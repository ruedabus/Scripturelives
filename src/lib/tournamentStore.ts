/**
 * In-memory game room store.
 *
 * Works perfectly for development and single-instance deployments.
 * On Vercel, game sessions are short (< 1 hour) and the same warm lambda
 * instance handles requests from the same origin within a session.
 * Rooms auto-expire after 3 hours.
 */

import type { GameRoom } from "@/lib/tournamentTypes";

const EXPIRY_MS = 3 * 60 * 60 * 1000; // 3 hours

// Global store — persists across requests within the same process
const rooms = new Map<string, GameRoom>();

// ── Prune expired rooms periodically ───────────────────────────────────────
function pruneExpired() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.createdAt > EXPIRY_MS) rooms.delete(code);
  }
}
setInterval(pruneExpired, 10 * 60 * 1000); // every 10 min

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
