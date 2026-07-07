/**
 * Scripture Alive — Bible Study Community
 * Supabase REST helpers (service-role, server-side only).
 */

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function sbHeaders() {
  return {
    apikey:         SUPABASE_KEY,
    Authorization:  `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type CommunityRoom = {
  id:           string;
  name:         string;
  slug:         string;
  description:  string | null;
  category:     string;
  icon:         string;
  created_by:   string | null;
  member_count: number;
  post_count:   number;
  is_official:  boolean;
  is_locked:    boolean;
  created_at:   string;
};

export type CommunityPost = {
  id:             string;
  room_id:        string;
  user_id:        string;
  title:          string;
  body:           string | null;
  post_type:      "discussion" | "question" | "scripture";
  upvote_count:   number;
  comment_count:  number;
  is_pinned:      boolean;
  is_locked:      boolean;
  is_removed:     boolean;
  removed_by:     string | null;
  removed_reason: string | null;
  created_at:     string;
  updated_at:     string;
  // joined from profiles
  author_name?:   string;
  author_avatar?: string | null;
  // joined from rooms
  room_name?:     string;
  room_slug?:     string;
  room_icon?:     string;
  // viewer state
  user_voted?:    boolean;
};

export type CommunityComment = {
  id:                string;
  post_id:           string;
  user_id:           string;
  parent_comment_id: string | null;
  body:              string;
  upvote_count:      number;
  is_removed:        boolean;
  removed_by:        string | null;
  removed_reason:    string | null;
  created_at:        string;
  // joined
  author_name?:      string;
  author_avatar?:    string | null;
  user_voted?:       boolean;
  replies?:          CommunityComment[];
};

export type CommunityReport = {
  id:          string;
  reporter_id: string;
  target_id:   string;
  target_type: "post" | "comment";
  reason:      string;
  status:      "pending" | "reviewed" | "dismissed";
  created_at:  string;
  // joined
  reporter_name?: string;
};

// ── Rooms ─────────────────────────────────────────────────────────────────────

const ROOMS = () => `${SUPABASE_URL}/rest/v1/community_rooms`;

export async function getRooms(category?: string): Promise<CommunityRoom[]> {
  let url = `${ROOMS()}?select=*&order=is_official.desc,member_count.desc`;
  if (category) url += `&category=eq.${encodeURIComponent(category)}`;
  const res = await fetch(url, { headers: sbHeaders(), cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function getRoom(slug: string): Promise<CommunityRoom | null> {
  const res = await fetch(
    `${ROOMS()}?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as CommunityRoom[];
  return rows[0] ?? null;
}

export async function createRoom(data: {
  name: string; slug: string; description: string; category: string; icon: string; created_by: string;
}): Promise<CommunityRoom | null> {
  const res = await fetch(ROOMS(), {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const rows = await res.json() as CommunityRoom[];
  return rows[0] ?? null;
}

// ── Posts ─────────────────────────────────────────────────────────────────────

const POSTS    = () => `${SUPABASE_URL}/rest/v1/community_posts`;
const PROFILES = () => `${SUPABASE_URL}/rest/v1/profiles`;

/** Enrich posts with author display_name + avatar, and room info. */
async function enrichPosts(
  posts: CommunityPost[],
  viewerUserId?: string
): Promise<CommunityPost[]> {
  if (posts.length === 0) return [];

  // Collect unique user IDs
  const userIds = [...new Set(posts.map(p => p.user_id))];
  const profileMap = new Map<string, { name: string; avatar: string | null }>();

  if (userIds.length > 0) {
    const ids = userIds.map(id => `id.eq.${encodeURIComponent(id)}`).join(",");
    const pr = await fetch(
      `${PROFILES()}?or=(${ids})&select=id,display_name,avatar_url`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (pr.ok) {
      const profiles = await pr.json() as { id: string; display_name: string; avatar_url: string | null }[];
      for (const p of profiles) profileMap.set(p.id, { name: p.display_name, avatar: p.avatar_url });
    }
  }

  // Fetch rooms
  const roomIds = [...new Set(posts.map(p => p.room_id))];
  const roomMap = new Map<string, { name: string; slug: string; icon: string }>();
  if (roomIds.length > 0) {
    const ids = roomIds.map(id => `id.eq.${encodeURIComponent(id)}`).join(",");
    const rr = await fetch(
      `${ROOMS()}?or=(${ids})&select=id,name,slug,icon`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (rr.ok) {
      const rooms = await rr.json() as { id: string; name: string; slug: string; icon: string }[];
      for (const r of rooms) roomMap.set(r.id, { name: r.name, slug: r.slug, icon: r.icon });
    }
  }

  // Viewer votes
  let votedSet = new Set<string>();
  if (viewerUserId && posts.length > 0) {
    const pids = posts.map(p => `target_id.eq.${encodeURIComponent(p.id)}`).join(",");
    const vr = await fetch(
      `${SUPABASE_URL}/rest/v1/community_votes?user_id=eq.${viewerUserId}&target_type=eq.post&or=(${pids})&select=target_id`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (vr.ok) {
      const votes = await vr.json() as { target_id: string }[];
      votedSet = new Set(votes.map(v => v.target_id));
    }
  }

  return posts.map(p => ({
    ...p,
    author_name:   profileMap.get(p.user_id)?.name ?? "Unknown",
    author_avatar: profileMap.get(p.user_id)?.avatar ?? null,
    room_name:     roomMap.get(p.room_id)?.name,
    room_slug:     roomMap.get(p.room_id)?.slug,
    room_icon:     roomMap.get(p.room_id)?.icon,
    user_voted:    votedSet.has(p.id),
  }));
}

export async function getPosts(options: {
  roomId?: string;
  sort?: "new" | "top";
  limit?: number;
  offset?: number;
  viewerUserId?: string;
}): Promise<CommunityPost[]> {
  const { roomId, sort = "new", limit = 25, offset = 0, viewerUserId } = options;
  const orderBy = sort === "top" ? "upvote_count.desc,created_at.desc" : "is_pinned.desc,created_at.desc";
  let url = `${POSTS()}?select=*&is_removed=eq.false&order=${orderBy}&limit=${limit}&offset=${offset}`;
  if (roomId) url += `&room_id=eq.${encodeURIComponent(roomId)}`;
  const res = await fetch(url, { headers: sbHeaders(), cache: "no-store" });
  if (!res.ok) return [];
  const rows = await res.json() as CommunityPost[];
  return enrichPosts(rows, viewerUserId);
}

export async function getPost(postId: string, viewerUserId?: string): Promise<CommunityPost | null> {
  const res = await fetch(
    `${POSTS()}?id=eq.${encodeURIComponent(postId)}&select=*&limit=1`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = await res.json() as CommunityPost[];
  if (!rows[0]) return null;
  const enriched = await enrichPosts([rows[0]], viewerUserId);
  return enriched[0] ?? null;
}

export async function createPost(data: {
  room_id: string; user_id: string; title: string; body?: string; post_type: string;
}): Promise<CommunityPost | null> {
  const res = await fetch(POSTS(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation" },
    body:    JSON.stringify(data),
  });
  if (!res.ok) return null;
  // Increment room post_count
  await fetch(
    `${ROOMS()}?id=eq.${encodeURIComponent(data.room_id)}`,
    { method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ post_count: `post_count + 1` }) }
  ).catch(() => {});
  const rows = await res.json() as CommunityPost[];
  return rows[0] ?? null;
}

export async function updatePost(postId: string, updates: Partial<CommunityPost>): Promise<boolean> {
  const res = await fetch(
    `${POSTS()}?id=eq.${encodeURIComponent(postId)}`,
    { method: "PATCH", headers: { ...sbHeaders(), Prefer: "return=minimal" }, body: JSON.stringify(updates) }
  );
  return res.ok;
}

// ── Comments ──────────────────────────────────────────────────────────────────

const COMMENTS = () => `${SUPABASE_URL}/rest/v1/community_comments`;

export async function getComments(postId: string, viewerUserId?: string): Promise<CommunityComment[]> {
  const res = await fetch(
    `${COMMENTS()}?post_id=eq.${encodeURIComponent(postId)}&is_removed=eq.false&order=created_at.asc&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as CommunityComment[];
  if (rows.length === 0) return [];

  // Enrich with author info
  const userIds = [...new Set(rows.map(c => c.user_id))];
  const profileMap = new Map<string, { name: string; avatar: string | null }>();
  if (userIds.length > 0) {
    const ids = userIds.map(id => `id.eq.${encodeURIComponent(id)}`).join(",");
    const pr = await fetch(
      `${PROFILES()}?or=(${ids})&select=id,display_name,avatar_url`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (pr.ok) {
      const profiles = await pr.json() as { id: string; display_name: string; avatar_url: string | null }[];
      for (const p of profiles) profileMap.set(p.id, { name: p.display_name, avatar: p.avatar_url });
    }
  }

  // Viewer votes on comments
  let votedSet = new Set<string>();
  if (viewerUserId && rows.length > 0) {
    const cids = rows.map(c => `target_id.eq.${encodeURIComponent(c.id)}`).join(",");
    const vr = await fetch(
      `${SUPABASE_URL}/rest/v1/community_votes?user_id=eq.${viewerUserId}&target_type=eq.comment&or=(${cids})&select=target_id`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (vr.ok) {
      const votes = await vr.json() as { target_id: string }[];
      votedSet = new Set(votes.map(v => v.target_id));
    }
  }

  const enriched: CommunityComment[] = rows.map(c => ({
    ...c,
    author_name:   profileMap.get(c.user_id)?.name ?? "Unknown",
    author_avatar: profileMap.get(c.user_id)?.avatar ?? null,
    user_voted:    votedSet.has(c.id),
    replies:       [],
  }));

  // Nest replies
  const topLevel: CommunityComment[] = [];
  const commentMap = new Map<string, CommunityComment>();
  for (const c of enriched) commentMap.set(c.id, c);
  for (const c of enriched) {
    if (c.parent_comment_id && commentMap.has(c.parent_comment_id)) {
      commentMap.get(c.parent_comment_id)!.replies!.push(c);
    } else {
      topLevel.push(c);
    }
  }
  return topLevel;
}

export async function createComment(data: {
  post_id: string; user_id: string; body: string; parent_comment_id?: string | null;
}): Promise<CommunityComment | null> {
  const res = await fetch(COMMENTS(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation" },
    body:    JSON.stringify(data),
  });
  if (!res.ok) return null;
  // Increment post comment_count via RPC-less approach
  await fetch(
    `${POSTS()}?id=eq.${encodeURIComponent(data.post_id)}`,
    { method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ comment_count: `comment_count + 1` }) }
  ).catch(() => {});
  const rows = await res.json() as CommunityComment[];
  return rows[0] ?? null;
}

export async function updateComment(commentId: string, updates: Partial<CommunityComment>): Promise<boolean> {
  const res = await fetch(
    `${COMMENTS()}?id=eq.${encodeURIComponent(commentId)}`,
    { method: "PATCH", headers: { ...sbHeaders(), Prefer: "return=minimal" }, body: JSON.stringify(updates) }
  );
  return res.ok;
}

// ── Votes ─────────────────────────────────────────────────────────────────────

const VOTES = () => `${SUPABASE_URL}/rest/v1/community_votes`;

export async function toggleVote(userId: string, targetId: string, targetType: "post" | "comment"): Promise<{ voted: boolean }> {
  // Check if already voted
  const check = await fetch(
    `${VOTES()}?user_id=eq.${userId}&target_id=eq.${targetId}&target_type=eq.${targetType}&select=id&limit=1`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  const existing = check.ok ? await check.json() as { id: string }[] : [];

  if (existing.length > 0) {
    // Un-vote
    await fetch(
      `${VOTES()}?user_id=eq.${userId}&target_id=eq.${targetId}&target_type=eq.${targetType}`,
      { method: "DELETE", headers: sbHeaders() }
    );
    // Decrement count
    const table = targetType === "post" ? POSTS() : COMMENTS();
    await fetch(
      `${table}?id=eq.${targetId}`,
      { method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ upvote_count: `upvote_count - 1` }) }
    ).catch(() => {});
    return { voted: false };
  } else {
    // Vote
    await fetch(VOTES(), {
      method:  "POST",
      headers: sbHeaders(),
      body:    JSON.stringify({ user_id: userId, target_id: targetId, target_type: targetType }),
    });
    // Increment count
    const table = targetType === "post" ? POSTS() : COMMENTS();
    await fetch(
      `${table}?id=eq.${targetId}`,
      { method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ upvote_count: `upvote_count + 1` }) }
    ).catch(() => {});
    return { voted: true };
  }
}

// ── Members ───────────────────────────────────────────────────────────────────

const MEMBERS = () => `${SUPABASE_URL}/rest/v1/community_members`;

export async function joinRoom(userId: string, roomId: string): Promise<void> {
  await fetch(MEMBERS(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body:    JSON.stringify({ user_id: userId, room_id: roomId }),
  });
  // Increment member_count
  await fetch(
    `${ROOMS()}?id=eq.${roomId}`,
    { method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ member_count: `member_count + 1` }) }
  ).catch(() => {});
}

export async function leaveRoom(userId: string, roomId: string): Promise<void> {
  await fetch(
    `${MEMBERS()}?user_id=eq.${userId}&room_id=eq.${roomId}`,
    { method: "DELETE", headers: sbHeaders() }
  );
  await fetch(
    `${ROOMS()}?id=eq.${roomId}`,
    { method: "PATCH", headers: sbHeaders(), body: JSON.stringify({ member_count: `member_count - 1` }) }
  ).catch(() => {});
}

export async function isMember(userId: string, roomId: string): Promise<boolean> {
  const res = await fetch(
    `${MEMBERS()}?user_id=eq.${userId}&room_id=eq.${roomId}&select=user_id&limit=1`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return false;
  const rows = await res.json() as unknown[];
  return rows.length > 0;
}

export async function getUserRoomIds(userId: string): Promise<string[]> {
  const res = await fetch(
    `${MEMBERS()}?user_id=eq.${userId}&select=room_id`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as { room_id: string }[];
  return rows.map(r => r.room_id);
}

// ── Reports ───────────────────────────────────────────────────────────────────

const REPORTS = () => `${SUPABASE_URL}/rest/v1/community_reports`;

export async function createReport(data: {
  reporter_id: string; target_id: string; target_type: "post" | "comment"; reason: string;
}): Promise<boolean> {
  const res = await fetch(REPORTS(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body:    JSON.stringify(data),
  });
  return res.ok;
}

export async function getPendingReports(): Promise<CommunityReport[]> {
  const res = await fetch(
    `${REPORTS()}?status=eq.pending&order=created_at.asc&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as CommunityReport[];
  if (rows.length === 0) return [];

  // Enrich with reporter names
  const userIds = [...new Set(rows.map(r => r.reporter_id))];
  const profileMap = new Map<string, string>();
  if (userIds.length > 0) {
    const ids = userIds.map(id => `id.eq.${encodeURIComponent(id)}`).join(",");
    const pr = await fetch(
      `${PROFILES()}?or=(${ids})&select=id,display_name`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (pr.ok) {
      const profiles = await pr.json() as { id: string; display_name: string }[];
      for (const p of profiles) profileMap.set(p.id, p.display_name);
    }
  }
  return rows.map(r => ({ ...r, reporter_name: profileMap.get(r.reporter_id) ?? "Unknown" }));
}

export async function updateReport(reportId: string, status: "reviewed" | "dismissed", reviewedBy: string): Promise<boolean> {
  const res = await fetch(
    `${REPORTS()}?id=eq.${encodeURIComponent(reportId)}`,
    { method: "PATCH", headers: { ...sbHeaders(), Prefer: "return=minimal" }, body: JSON.stringify({ status, reviewed_by: reviewedBy }) }
  );
  return res.ok;
}

// ── Bans ──────────────────────────────────────────────────────────────────────

const BANS = () => `${SUPABASE_URL}/rest/v1/community_bans`;

export async function banUser(userId: string, bannedBy: string, reason?: string): Promise<boolean> {
  const res = await fetch(BANS(), {
    method:  "POST",
    headers: { ...sbHeaders(), Prefer: "return=minimal" },
    body:    JSON.stringify({ user_id: userId, banned_by: bannedBy, reason: reason ?? null }),
  });
  return res.ok;
}

export async function unbanUser(userId: string): Promise<boolean> {
  const res = await fetch(
    `${BANS()}?user_id=eq.${encodeURIComponent(userId)}`,
    { method: "DELETE", headers: sbHeaders() }
  );
  return res.ok;
}

export async function isUserBanned(userId: string): Promise<boolean> {
  const res = await fetch(
    `${BANS()}?user_id=eq.${encodeURIComponent(userId)}&select=user_id&limit=1`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return false;
  const rows = await res.json() as unknown[];
  return rows.length > 0;
}

export async function getBannedUsers(): Promise<{ user_id: string; reason: string | null; created_at: string; display_name?: string }[]> {
  const res = await fetch(
    `${BANS()}?select=*&order=created_at.desc`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as { user_id: string; reason: string | null; created_at: string }[];
  if (rows.length === 0) return [];

  const userIds = rows.map(r => r.user_id);
  const profileMap = new Map<string, string>();
  const ids = userIds.map(id => `id.eq.${encodeURIComponent(id)}`).join(",");
  const pr = await fetch(`${PROFILES()}?or=(${ids})&select=id,display_name`, { headers: sbHeaders(), cache: "no-store" });
  if (pr.ok) {
    const profiles = await pr.json() as { id: string; display_name: string }[];
    for (const p of profiles) profileMap.set(p.id, p.display_name);
  }
  return rows.map(r => ({ ...r, display_name: profileMap.get(r.user_id) }));
}

// ── Admin helpers ─────────────────────────────────────────────────────────────

/** Get posts with is_removed = true (for admin review) */
export async function getRemovedPosts(limit = 50): Promise<CommunityPost[]> {
  const res = await fetch(
    `${POSTS()}?is_removed=eq.true&order=created_at.desc&limit=${limit}&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as CommunityPost[];
  return enrichPosts(rows);
}

/** Get ALL posts across all rooms for admin (includes removed) */
export async function getAllPostsAdmin(limit = 50, offset = 0): Promise<CommunityPost[]> {
  const res = await fetch(
    `${POSTS()}?order=created_at.desc&limit=${limit}&offset=${offset}&select=*`,
    { headers: sbHeaders(), cache: "no-store" }
  );
  if (!res.ok) return [];
  const rows = await res.json() as CommunityPost[];
  return enrichPosts(rows);
}

/** Count summary for admin dashboard */
export async function getCommunityStats(): Promise<{
  total_rooms: number; total_posts: number; total_comments: number;
  pending_reports: number; banned_users: number;
}> {
  const [rr, pr, cr, rep, ban] = await Promise.all([
    fetch(`${ROOMS()}?select=id&limit=1`, { headers: { ...sbHeaders(), Prefer: "count=exact" }, cache: "no-store" }),
    fetch(`${POSTS()}?select=id&limit=1`, { headers: { ...sbHeaders(), Prefer: "count=exact" }, cache: "no-store" }),
    fetch(`${COMMENTS()}?select=id&limit=1`, { headers: { ...sbHeaders(), Prefer: "count=exact" }, cache: "no-store" }),
    fetch(`${REPORTS()}?status=eq.pending&select=id&limit=1`, { headers: { ...sbHeaders(), Prefer: "count=exact" }, cache: "no-store" }),
    fetch(`${BANS()}?select=user_id&limit=1`, { headers: { ...sbHeaders(), Prefer: "count=exact" }, cache: "no-store" }),
  ]);

  const parseCount = (r: Response) => {
    const raw = r.headers.get("content-range");
    return parseInt(raw?.split("/")?.[1] ?? "0", 10) || 0;
  };

  return {
    total_rooms:     parseCount(rr),
    total_posts:     parseCount(pr),
    total_comments:  parseCount(cr),
    pending_reports: parseCount(rep),
    banned_users:    parseCount(ban),
  };
}
