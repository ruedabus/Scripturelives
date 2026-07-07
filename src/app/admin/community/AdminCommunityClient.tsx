"use client";

import { useState } from "react";
import Link from "next/link";
import type { CommunityPost, CommunityReport, CommunityRoom } from "@/lib/community";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";

type BannedUser = { user_id: string; reason: string | null; created_at: string; display_name?: string };
type Stats = { total_rooms: number; total_posts: number; total_comments: number; pending_reports: number; banned_users: number };

interface Props {
  stats:       Stats;
  reports:     CommunityReport[];
  recentPosts: CommunityPost[];
  bannedUsers: BannedUser[];
  rooms:       CommunityRoom[];
}

type Tab = "overview" | "reports" | "posts" | "rooms" | "bans";

export default function AdminCommunityClient({ stats, reports, recentPosts, bannedUsers, rooms }: Props) {
  const [tab, setTab]           = useState<Tab>("overview");
  const [postList, setPostList] = useState(recentPosts);
  const [reportList, setReportList] = useState(reports);
  const [banList, setBanList]   = useState(bannedUsers);
  const [roomList, setRoomList] = useState(rooms);
  const [loading, setLoading]   = useState<string | null>(null);
  const [banUserId, setBanUserId] = useState("");
  const [banReason, setBanReason] = useState("");
  const [localStats, setLocalStats] = useState(stats);

  async function moderate(body: object) {
    const res = await fetch("/api/community/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  }

  async function removePost(post: CommunityPost) {
    setLoading(post.id);
    const ok = await moderate({ action: "remove_post", postId: post.id, reason: "Removed by moderator" });
    if (ok) setPostList(prev => prev.map(p => p.id === post.id ? { ...p, is_removed: true } : p));
    setLoading(null);
  }

  async function restorePost(post: CommunityPost) {
    setLoading(post.id);
    const ok = await moderate({ action: "restore_post", postId: post.id });
    if (ok) setPostList(prev => prev.map(p => p.id === post.id ? { ...p, is_removed: false } : p));
    setLoading(null);
  }

  async function pinPost(post: CommunityPost) {
    setLoading(post.id);
    const ok = await moderate({ action: post.is_pinned ? "unpin_post" : "pin_post", postId: post.id });
    if (ok) setPostList(prev => prev.map(p => p.id === post.id ? { ...p, is_pinned: !p.is_pinned } : p));
    setLoading(null);
  }

  async function lockPost(post: CommunityPost) {
    setLoading(post.id);
    const ok = await moderate({ action: post.is_locked ? "unlock_post" : "lock_post", postId: post.id });
    if (ok) setPostList(prev => prev.map(p => p.id === post.id ? { ...p, is_locked: !p.is_locked } : p));
    setLoading(null);
  }

  async function resolveReport(report: CommunityReport, action: "resolve_report" | "dismiss_report") {
    setLoading(report.id);
    const ok = await moderate({ action, reportId: report.id });
    if (ok) {
      setReportList(prev => prev.filter(r => r.id !== report.id));
      setLocalStats(s => ({ ...s, pending_reports: s.pending_reports - 1 }));
    }
    setLoading(null);
  }

  async function banUserAction() {
    if (!banUserId.trim()) return;
    const ok = await moderate({ action: "ban_user", userId: banUserId.trim(), reason: banReason });
    if (ok) {
      setBanList(prev => [...prev, { user_id: banUserId, reason: banReason || null, created_at: new Date().toISOString() }]);
      setBanUserId(""); setBanReason("");
    } else {
      alert("Failed to ban user — check the user ID.");
    }
  }

  async function unbanUserAction(userId: string) {
    const ok = await moderate({ action: "unban_user", userId });
    if (ok) setBanList(prev => prev.filter(b => b.user_id !== userId));
  }

  async function lockRoom(room: CommunityRoom) {
    setLoading(room.id);
    // Update via direct Supabase — need to add a room lock endpoint or just use existing moderate
    const res = await fetch(`/api/community/rooms`, {
      method: "PATCH" as string,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: room.id, is_locked: !room.is_locked }),
    });
    if (res.ok) setRoomList(prev => prev.map(r => r.id === room.id ? { ...r, is_locked: !r.is_locked } : r));
    setLoading(null);
  }

  const TABS: { key: Tab; label: string; badge?: number }[] = [
    { key: "overview", label: "📊 Overview" },
    { key: "reports",  label: "🚩 Reports",  badge: localStats.pending_reports },
    { key: "posts",    label: "📝 Posts" },
    { key: "rooms",    label: "🏠 Rooms" },
    { key: "bans",     label: "🚫 Bans", badge: localStats.banned_users },
  ];

  return (
    <main style={{ background: "#f5f5f5", minHeight: "100vh", fontFamily: "system-ui, sans-serif", padding: "1.5rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: NAVY, borderRadius: 12, padding: "1.25rem 1.5rem",
          marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
              <Link href="/admin/downloads" style={{ color: GOLD, textDecoration: "none" }}>← Admin</Link>
            </div>
            <h1 style={{ color: GOLD, margin: 0, fontSize: "1.4rem", fontWeight: 800 }}>
              🏛️ Community Moderation
            </h1>
          </div>
          <Link href="/community"
            style={{ background: GOLD, color: NAVY, padding: "0.4rem 1rem", borderRadius: 20,
              textDecoration: "none", fontWeight: 700, fontSize: "0.85rem" }}>
            View Community →
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ padding: "0.45rem 1rem", borderRadius: 20, border: "none", cursor: "pointer",
                background: tab === t.key ? NAVY : "#fff", color: tab === t.key ? GOLD : "#555",
                fontWeight: tab === t.key ? 700 : 400, fontSize: "0.85rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span style={{ background: "#dc3545", color: "#fff", borderRadius: 10,
                  padding: "1px 6px", fontSize: "0.7rem", fontWeight: 700 }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Rooms",    value: localStats.total_rooms,    icon: "🏠" },
                { label: "Posts",    value: localStats.total_posts,    icon: "📝" },
                { label: "Comments", value: localStats.total_comments, icon: "💬" },
                { label: "Reports",  value: localStats.pending_reports, icon: "🚩", alert: localStats.pending_reports > 0 },
                { label: "Bans",     value: localStats.banned_users,   icon: "🚫" },
              ].map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 10, padding: "1.25rem",
                  textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                  border: s.alert ? "2px solid #dc3545" : "none" }}>
                  <div style={{ fontSize: "1.5rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "1.75rem", fontWeight: 800, color: s.alert ? "#dc3545" : NAVY }}>{s.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "#888" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <h3 style={{ color: NAVY, margin: "0 0 0.75rem", fontSize: "0.95rem" }}>Quick Actions</h3>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {TABS.slice(1).map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    style={{ background: NAVY, color: GOLD, border: "none", borderRadius: 8,
                      padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>
                    {t.label}
                    {t.badge !== undefined && t.badge > 0 && ` (${t.badge})`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Reports ── */}
        {tab === "reports" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <h2 style={{ color: NAVY, margin: "0 0 1rem", fontSize: "1rem" }}>Pending Reports</h2>
            {reportList.length === 0 ? (
              <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>✅ No pending reports</p>
            ) : reportList.map(report => (
              <div key={report.id} style={{ padding: "1rem", border: "1px solid #f0ece4", borderRadius: 8,
                marginBottom: "0.75rem", background: "#fafaf8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", background: "#fff3cd", color: "#856404",
                      padding: "2px 6px", borderRadius: 6, fontWeight: 600, textTransform: "uppercase" }}>
                      {report.target_type}
                    </span>
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "#888" }}>
                      by {report.reporter_name} — {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => resolveReport(report, "resolve_report")}
                      disabled={loading === report.id}
                      style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 6,
                        padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>
                      Remove Content
                    </button>
                    <button onClick={() => resolveReport(report, "dismiss_report")}
                      disabled={loading === report.id}
                      style={{ background: "#6c757d", color: "#fff", border: "none", borderRadius: 6,
                        padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.8rem" }}>
                      Dismiss
                    </button>
                  </div>
                </div>
                <p style={{ margin: "0.5rem 0 0", color: "#333", fontSize: "0.875rem" }}>
                  <strong>Reason:</strong> {report.reason}
                </p>
                <p style={{ margin: "0.25rem 0 0", color: "#888", fontSize: "0.78rem" }}>
                  Target ID: <code style={{ background: "#f0ece4", padding: "1px 4px", borderRadius: 4 }}>{report.target_id}</code>
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Posts ── */}
        {tab === "posts" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <h2 style={{ color: NAVY, margin: "0 0 1rem", fontSize: "1rem" }}>All Posts (most recent)</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0ece4" }}>
                  {["Title", "Room", "Author", "Stats", "Status", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {postList.map((post, i) => (
                  <tr key={post.id} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff", opacity: post.is_removed ? 0.55 : 1 }}>
                    <td style={{ padding: "8px", color: NAVY, maxWidth: 220 }}>
                      <Link href={`/community/post/${post.id}`}
                        style={{ color: NAVY, textDecoration: "none", fontWeight: 500,
                          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {post.is_pinned ? "📌 " : ""}{post.title}
                      </Link>
                    </td>
                    <td style={{ padding: "8px", color: "#666", whiteSpace: "nowrap" }}>
                      {post.room_icon} {post.room_name ?? "—"}
                    </td>
                    <td style={{ padding: "8px", color: "#666", whiteSpace: "nowrap" }}>
                      {post.author_name}
                    </td>
                    <td style={{ padding: "8px", color: "#666", whiteSpace: "nowrap" }}>
                      ▲{post.upvote_count} · 💬{post.comment_count}
                    </td>
                    <td style={{ padding: "8px" }}>
                      {post.is_removed ? (
                        <span style={{ color: "#dc3545", fontWeight: 600, fontSize: "0.75rem" }}>REMOVED</span>
                      ) : post.is_locked ? (
                        <span style={{ color: "#856404", fontWeight: 600, fontSize: "0.75rem" }}>LOCKED</span>
                      ) : (
                        <span style={{ color: "#198754", fontWeight: 600, fontSize: "0.75rem" }}>LIVE</span>
                      )}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        <button onClick={() => post.is_removed ? restorePost(post) : removePost(post)}
                          disabled={loading === post.id}
                          style={{ background: post.is_removed ? "#198754" : "#dc3545", color: "#fff",
                            border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer",
                            fontSize: "0.72rem", fontWeight: 700 }}>
                          {post.is_removed ? "Restore" : "Remove"}
                        </button>
                        <button onClick={() => pinPost(post)}
                          disabled={loading === post.id}
                          style={{ background: post.is_pinned ? "#856404" : "#f0ece4", color: post.is_pinned ? "#fff" : "#555",
                            border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: "0.72rem" }}>
                          {post.is_pinned ? "Unpin" : "📌 Pin"}
                        </button>
                        <button onClick={() => lockPost(post)}
                          disabled={loading === post.id}
                          style={{ background: "#f0ece4", color: "#555",
                            border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: "0.72rem" }}>
                          {post.is_locked ? "🔓 Unlock" : "🔒 Lock"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Rooms ── */}
        {tab === "rooms" && (
          <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
            <h2 style={{ color: NAVY, margin: "0 0 1rem", fontSize: "1rem" }}>All Rooms</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0ece4" }}>
                  {["Room", "Category", "Members", "Posts", "Status", "Actions"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roomList.map((room, i) => (
                  <tr key={room.id} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff" }}>
                    <td style={{ padding: "8px" }}>
                      <Link href={`/community/r/${room.slug}`}
                        style={{ color: NAVY, textDecoration: "none", fontWeight: 500 }}>
                        {room.icon} {room.name}
                      </Link>
                      {room.is_official && (
                        <span style={{ marginLeft: "0.4rem", fontSize: "0.65rem", background: "#e8f0fe",
                          color: "#3b5bdb", padding: "1px 5px", borderRadius: 6, fontWeight: 600 }}>
                          OFFICIAL
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "8px", color: "#666" }}>{room.category}</td>
                    <td style={{ padding: "8px", color: "#666" }}>{room.member_count.toLocaleString()}</td>
                    <td style={{ padding: "8px", color: "#666" }}>{room.post_count}</td>
                    <td style={{ padding: "8px" }}>
                      {room.is_locked ? (
                        <span style={{ color: "#856404", fontWeight: 600, fontSize: "0.75rem" }}>LOCKED</span>
                      ) : (
                        <span style={{ color: "#198754", fontWeight: 600, fontSize: "0.75rem" }}>OPEN</span>
                      )}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <button onClick={() => lockRoom(room)}
                        disabled={loading === room.id}
                        style={{ background: "#f0ece4", color: "#555", border: "none",
                          borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: "0.72rem" }}>
                        {room.is_locked ? "🔓 Unlock" : "🔒 Lock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Bans ── */}
        {tab === "bans" && (
          <div>
            {/* Ban a user */}
            <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: "1rem" }}>
              <h3 style={{ color: NAVY, margin: "0 0 0.75rem", fontSize: "0.95rem" }}>Ban a User</h3>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input value={banUserId} onChange={e => setBanUserId(e.target.value)}
                  placeholder="User ID (UUID from Supabase)"
                  style={{ flex: 2, minWidth: 200, padding: "0.5rem 0.75rem", border: "1px solid #ddd",
                    borderRadius: 8, fontSize: "0.875rem", fontFamily: "inherit" }} />
                <input value={banReason} onChange={e => setBanReason(e.target.value)}
                  placeholder="Reason (optional)"
                  style={{ flex: 1, minWidth: 150, padding: "0.5rem 0.75rem", border: "1px solid #ddd",
                    borderRadius: 8, fontSize: "0.875rem", fontFamily: "inherit" }} />
                <button onClick={banUserAction}
                  style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 8,
                    padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 700, fontSize: "0.875rem" }}>
                  Ban User
                </button>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <h2 style={{ color: NAVY, margin: "0 0 1rem", fontSize: "1rem" }}>
                Banned Users ({banList.length})
              </h2>
              {banList.length === 0 ? (
                <p style={{ color: "#888", textAlign: "center", padding: "1.5rem" }}>No users currently banned</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f0ece4" }}>
                      {["User", "Reason", "Banned On", "Actions"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 8px", color: "#888", fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {banList.map((b, i) => (
                      <tr key={b.user_id} style={{ background: i % 2 === 0 ? "#fafaf8" : "#fff" }}>
                        <td style={{ padding: "8px", color: NAVY }}>
                          {b.display_name ?? b.user_id.slice(0, 12) + "..."}
                        </td>
                        <td style={{ padding: "8px", color: "#666" }}>{b.reason ?? "—"}</td>
                        <td style={{ padding: "8px", color: "#888", whiteSpace: "nowrap" }}>
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: "8px" }}>
                          <button onClick={() => unbanUserAction(b.user_id)}
                            style={{ background: "#198754", color: "#fff", border: "none",
                              borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700 }}>
                            Unban
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
