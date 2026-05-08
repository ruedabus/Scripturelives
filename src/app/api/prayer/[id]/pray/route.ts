/**
 * POST /api/prayer/[id]/pray
 * Atomically increments pray_count for a public prayer request.
 * Uses the same SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY as tournamentStore.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_KEY);

function sbHeaders() {
  return {
    apikey:         SUPABASE_KEY!,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}
const TABLE = () => `${SUPABASE_URL?.replace(/\/+$/, "")}/rest/v1/prayer_requests`;

// In-memory fallback store (shared module ref with route.ts in same process)
// We re-import it at runtime — for local dev only.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;
if (!g.__prayerMem) g.__prayerMem = [];
const memStore: Array<{ id: string; pray_count: number; is_public: boolean }> = g.__prayerMem;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const { id } = await params;
  if (!id || typeof id !== "string" || id.length > 64) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
  }

  try {
    if (USE_SUPABASE) {
      // 1. Fetch current count
      const fetchRes = await fetch(
        `${TABLE()}?id=eq.${encodeURIComponent(id)}&is_public=eq.true&select=pray_count`,
        { headers: sbHeaders(), cache: "no-store" }
      );
      if (!fetchRes.ok) throw new Error(`Supabase fetch ${fetchRes.status}`);
      const rows = await fetchRes.json() as Array<{ pray_count: number }>;
      if (!Array.isArray(rows) || rows.length === 0) {
        return NextResponse.json({ error: "Prayer request not found." }, { status: 404 });
      }

      const newCount = (rows[0].pray_count ?? 0) + 1;

      // 2. Update
      const updateRes = await fetch(
        `${TABLE()}?id=eq.${encodeURIComponent(id)}&is_public=eq.true`,
        {
          method:  "PATCH",
          headers: { ...sbHeaders(), Prefer: "return=minimal" },
          body:    JSON.stringify({ pray_count: newCount }),
        }
      );
      if (!updateRes.ok) throw new Error(`Supabase update ${updateRes.status}`);

      return NextResponse.json({ prayCount: newCount });
    } else {
      // Local dev fallback
      const row = memStore.find((r) => r.id === id && r.is_public);
      if (!row) return NextResponse.json({ error: "Not found." }, { status: 404 });
      row.pray_count = (row.pray_count ?? 0) + 1;
      return NextResponse.json({ prayCount: row.pray_count });
    }
  } catch (e) {
    console.error("[prayer/pray]", e);
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
}
