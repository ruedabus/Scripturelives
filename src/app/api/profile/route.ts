/**
 * GET  /api/profile?id=xxx         — fetch any profile by user id
 * GET  /api/profile?username=xxx   — fetch by username
 * POST /api/profile                — create / update own profile (auth required)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getProfile, getProfileByUsername, upsertProfile } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id       = searchParams.get("id");
    const username = searchParams.get("username");

    if (id) {
      const p = await getProfile(id);
      if (!p) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      return NextResponse.json(p, { headers: { "Cache-Control": "no-store" } });
    }

    if (username) {
      const p = await getProfileByUsername(username);
      if (!p) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      return NextResponse.json(p, { headers: { "Cache-Control": "no-store" } });
    }

    return NextResponse.json({ error: "Missing id or username" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));

    // Sanitize — only allow safe fields
    const allowed = ["username", "display_name", "avatar_url", "church_name", "church_city", "country"];
    const update: Record<string, unknown> = { id: authUser.id };
    for (const key of allowed) {
      if (body[key] !== undefined) update[key] = String(body[key]).slice(0, 80);
    }

    // Username must be alphanumeric + underscores, 3-30 chars
    if (update.username) {
      const u = update.username as string;
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(u)) {
        return NextResponse.json({ error: "Username must be 3-30 alphanumeric characters or underscores" }, { status: 400 });
      }
    }

    const profile = await upsertProfile(update as { id: string });
    if (!profile) return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });

    return NextResponse.json(profile);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
