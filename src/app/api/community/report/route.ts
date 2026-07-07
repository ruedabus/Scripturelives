import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { createReport } from "@/lib/community";

export const runtime = "nodejs";

// POST /api/community/report  { targetId, targetType, reason }
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { targetId?: string; targetType?: string; reason?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { targetId, targetType, reason } = body;
  if (!targetId || !targetType || !reason?.trim())
    return NextResponse.json({ error: "targetId, targetType, and reason are required" }, { status: 400 });

  if (!["post", "comment"].includes(targetType))
    return NextResponse.json({ error: "targetType must be post or comment" }, { status: 400 });

  const ok = await createReport({
    reporter_id: user.id,
    target_id:   targetId,
    target_type: targetType as "post" | "comment",
    reason:      reason.trim(),
  });

  // 409 = already reported (unique constraint)
  if (!ok) return NextResponse.json({ error: "Report already submitted" }, { status: 409 });
  return NextResponse.json({ success: true });
}
