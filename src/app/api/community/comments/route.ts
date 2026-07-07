import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getComments, createComment, isUserBanned } from "@/lib/community";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/community/comments?postId=
export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
  const comments = await getComments(postId);
  return NextResponse.json(comments);
}

// POST /api/community/comments
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const banned = await isUserBanned(user.id);
  if (banned) return NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });

  let body: { postId?: string; body?: string; parentCommentId?: string | null };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { postId, body: commentBody, parentCommentId = null } = body;
  if (!postId || !commentBody?.trim())
    return NextResponse.json({ error: "postId and body are required" }, { status: 400 });

  const comment = await createComment({
    post_id:           postId,
    user_id:           user.id,
    body:              commentBody.trim(),
    parent_comment_id: parentCommentId,
  });

  if (!comment) return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  return NextResponse.json(comment, { status: 201 });
}
