/**
 * Admin-only moderation endpoint.
 * Actions: remove_post, restore_post, remove_comment, ban_user, unban_user, pin_post, lock_post, resolve_report
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import {
  updatePost, updateComment, banUser, unbanUser,
  updateReport,
} from "@/lib/community";

export const runtime = "nodejs";

const ADMIN_IDS = (process.env.ADMIN_USER_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean);

async function checkAdmin(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return null;
  // Allow if user ID is in ADMIN_USER_IDS env, or if they have a profile marked as admin
  if (ADMIN_IDS.includes(user.id)) return user;
  // Also check admin email list
  const adminEmails = (process.env.ADMIN_EMAILS ?? "ruedabus1@yahoo.com").split(",").map(e => e.trim());
  if (adminEmails.includes(user.email)) return user;
  return null;
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: {
    action: string;
    postId?: string;
    commentId?: string;
    userId?: string;
    reportId?: string;
    reason?: string;
  };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { action } = body;

  switch (action) {
    case "remove_post":
      if (!body.postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
      await updatePost(body.postId, {
        is_removed: true, removed_by: admin.id, removed_reason: body.reason ?? "Removed by moderator",
      });
      return NextResponse.json({ success: true });

    case "restore_post":
      if (!body.postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
      await updatePost(body.postId, { is_removed: false, removed_by: null, removed_reason: null });
      return NextResponse.json({ success: true });

    case "pin_post":
      if (!body.postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
      await updatePost(body.postId, { is_pinned: true });
      return NextResponse.json({ success: true });

    case "unpin_post":
      if (!body.postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
      await updatePost(body.postId, { is_pinned: false });
      return NextResponse.json({ success: true });

    case "lock_post":
      if (!body.postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
      await updatePost(body.postId, { is_locked: true });
      return NextResponse.json({ success: true });

    case "unlock_post":
      if (!body.postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
      await updatePost(body.postId, { is_locked: false });
      return NextResponse.json({ success: true });

    case "remove_comment":
      if (!body.commentId) return NextResponse.json({ error: "commentId required" }, { status: 400 });
      await updateComment(body.commentId, {
        is_removed: true, removed_by: admin.id, removed_reason: body.reason ?? "Removed by moderator",
      });
      return NextResponse.json({ success: true });

    case "restore_comment":
      if (!body.commentId) return NextResponse.json({ error: "commentId required" }, { status: 400 });
      await updateComment(body.commentId, { is_removed: false, removed_by: null, removed_reason: null });
      return NextResponse.json({ success: true });

    case "ban_user":
      if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
      await banUser(body.userId, admin.id, body.reason);
      return NextResponse.json({ success: true });

    case "unban_user":
      if (!body.userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
      await unbanUser(body.userId);
      return NextResponse.json({ success: true });

    case "resolve_report":
      if (!body.reportId) return NextResponse.json({ error: "reportId required" }, { status: 400 });
      await updateReport(body.reportId, "reviewed", admin.id);
      return NextResponse.json({ success: true });

    case "dismiss_report":
      if (!body.reportId) return NextResponse.json({ error: "reportId required" }, { status: 400 });
      await updateReport(body.reportId, "dismissed", admin.id);
      return NextResponse.json({ success: true });

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
