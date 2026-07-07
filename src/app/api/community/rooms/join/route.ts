import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { joinRoom, leaveRoom, isMember } from "@/lib/community";

export const runtime = "nodejs";

// POST /api/community/rooms/join  { roomId, action: "join" | "leave" }
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { roomId?: string; action?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { roomId, action = "join" } = body;
  if (!roomId) return NextResponse.json({ error: "roomId required" }, { status: 400 });

  if (action === "leave") {
    await leaveRoom(user.id, roomId);
    return NextResponse.json({ member: false });
  }

  const already = await isMember(user.id, roomId);
  if (!already) await joinRoom(user.id, roomId);
  return NextResponse.json({ member: true });
}
