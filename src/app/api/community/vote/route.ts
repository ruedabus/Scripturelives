import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { toggleVote } from "@/lib/community";

export const runtime = "nodejs";

// POST /api/community/vote  { targetId, targetType: "post"|"comment" }
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { targetId?: string; targetType?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { targetId, targetType } = body;
  if (!targetId || !targetType || !["post", "comment"].includes(targetType))
    return NextResponse.json({ error: "targetId and targetType (post|comment) required" }, { status: 400 });

  const result = await toggleVote(user.id, targetId, targetType as "post" | "comment");
  return NextResponse.json(result);
}
