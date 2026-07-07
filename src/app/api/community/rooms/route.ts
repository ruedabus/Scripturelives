import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getRooms, createRoom } from "@/lib/community";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/community/rooms
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? undefined;
  const rooms = await getRooms(category);
  return NextResponse.json(rooms);
}

// POST /api/community/rooms — create a new room
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { name?: string; slug?: string; description?: string; category?: string; icon?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, slug, description = "", category = "General", icon = "📖" } = body;
  if (!name?.trim() || !slug?.trim())
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });

  // Validate slug
  const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const room = await createRoom({
    name: name.trim(), slug: cleanSlug, description, category, icon, created_by: user.id,
  });

  if (!room) return NextResponse.json({ error: "Failed to create room (slug may be taken)" }, { status: 409 });
  return NextResponse.json(room, { status: 201 });
}
