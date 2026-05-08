/**
 * POST /api/prayer/[id]/pray
 * Increments the pray_count for a public prayer request.
 * Rate-limited per IP to prevent abuse.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

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
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
  }

  try {
    const supabase = getSupabase();

    // Use RPC to atomically increment (or fall back to select+update)
    const { data, error } = await supabase.rpc("increment_pray_count", { request_id: id });

    if (error) {
      // Fallback: manual increment
      const { data: current, error: fetchErr } = await supabase
        .from("prayer_requests")
        .select("pray_count")
        .eq("id", id)
        .eq("is_public", true)
        .single();

      if (fetchErr || !current) {
        return NextResponse.json({ error: "Request not found." }, { status: 404 });
      }

      const { error: updateErr } = await supabase
        .from("prayer_requests")
        .update({ pray_count: (current.pray_count ?? 0) + 1 })
        .eq("id", id)
        .eq("is_public", true);

      if (updateErr) throw updateErr;
      return NextResponse.json({ prayCount: (current.pray_count ?? 0) + 1 });
    }

    return NextResponse.json({ prayCount: data });
  } catch (e) {
    console.error("[prayer/pray]", e);
    return NextResponse.json({ error: "Could not update." }, { status: 500 });
  }
}
