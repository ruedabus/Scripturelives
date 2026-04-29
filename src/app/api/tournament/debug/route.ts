/**
 * GET /api/tournament/debug
 * Returns Supabase connectivity info — useful for diagnosing "Room not found" errors.
 * Safe to leave in production: it writes then immediately reads/deletes a test row.
 */

import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  const info: Record<string, unknown> = {
    USE_SUPABASE:   !!(SUPABASE_URL && SUPABASE_KEY),
    SUPABASE_URL:   SUPABASE_URL ? SUPABASE_URL.replace(/https?:\/\//, "").split(".")[0] + ".supabase.co" : null,
    KEY_PREFIX:     SUPABASE_KEY ? SUPABASE_KEY.slice(0, 6) + "…" : null,
  };

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ ...info, error: "Supabase env vars not set — using /tmp file fallback" });
  }

  const headers = {
    apikey:         SUPABASE_KEY,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    Prefer:         "resolution=merge-duplicates",
  };
  const TABLE = `${SUPABASE_URL}/rest/v1/tournament_rooms`;
  const TEST_CODE = "_TEST_";

  // 1. Write a test row
  try {
    const writeRes = await fetch(TABLE, {
      method:  "POST",
      headers,
      body:    JSON.stringify({
        code:       TEST_CODE,
        data:       { test: true },
        expires_at: new Date(Date.now() + 60_000).toISOString(),
      }),
    });
    const writeBody = await writeRes.text();
    info.write_status = writeRes.status;
    info.write_body   = writeBody.slice(0, 200);
    if (!writeRes.ok) {
      return NextResponse.json({ ...info, error: `Write failed (${writeRes.status})` });
    }
  } catch (e) {
    return NextResponse.json({ ...info, error: `Write threw: ${String(e)}` });
  }

  // 2. Read it back
  try {
    const readRes = await fetch(`${TABLE}?code=eq.${TEST_CODE}&select=data`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      cache:   "no-store",
    });
    const readBody = await readRes.text();
    info.read_status = readRes.status;
    info.read_body   = readBody.slice(0, 200);
    if (!readRes.ok) {
      return NextResponse.json({ ...info, error: `Read failed (${readRes.status})` });
    }
    const rows = JSON.parse(readBody);
    info.read_rows = Array.isArray(rows) ? rows.length : "not an array";
  } catch (e) {
    return NextResponse.json({ ...info, error: `Read threw: ${String(e)}` });
  }

  // 3. Delete it
  try {
    await fetch(`${TABLE}?code=eq.${TEST_CODE}`, {
      method:  "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
  } catch { /* non-fatal */ }

  info.status = "✅ Supabase read/write working correctly";
  return NextResponse.json(info);
}
