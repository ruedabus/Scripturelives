import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getPosts, createPost, isUserBanned } from "@/lib/community";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/community/posts?roomId=&sort=new|top&limit=&offset=
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const posts = await getPosts({
    roomId:  p.get("roomId") ?? undefined,
    sort:    (p.get("sort") ?? "new") as "new" | "top",
    limit:   parseInt(p.get("limit") ?? "25"),
    offset:  parseInt(p.get("offset") ?? "0"),
  });
  return NextResponse.json(posts);
}

// POST /api/community/posts
export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check ban
  const banned = await isUserBanned(user.id);
  if (banned) return NextResponse.json({ error: "Your account has been suspended." }, { status: 403 });

  let body: { roomId?: string; title?: string; body?: string; postType?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { roomId, title, body: postBody = "", postType = "discussion" } = body;
  if (!roomId || !title?.trim())
    return NextResponse.json({ error: "roomId and title are required" }, { status: 400 });

  const post = await createPost({
    room_id:   roomId,
    user_id:   user.id,
    title:     title.trim(),
    body:      postBody,
    post_type: postType,
  });

  if (!post) return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  return NextResponse.json(post, { status: 201 });
}
