/**
 * GET /api/tournament/debug
 * Disabled in production — returns 404.
 * Re-enable locally by setting DEBUG_MODE=true in .env.local
 */

import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.DEBUG_MODE !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only reachable locally with DEBUG_MODE=true
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return NextResponse.json({
    USE_SUPABASE: !!(SUPABASE_URL && SUPABASE_KEY),
    status: SUPABASE_URL && SUPABASE_KEY ? "✅ env vars present" : "❌ missing env vars",
  });
}
