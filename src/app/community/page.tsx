"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authClient";
import AuthModal from "@/components/AuthModal";
import type { CommunityRoom, CommunityPost } from "@/lib/community";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";
const CREAM = "#faf8f4";

const CATEGORIES = ["All", "General", "Old Testament", "New Testament", "Study", "Life"];

export default function CommunityPage() {
  const { user } = useAuth();
  const [rooms, setRooms]       = useState<CommunityRoom[]>([]);
  const [posts, setPosts]       = useState<CommunityPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort]         = useState<"new" | "top">("new");
  const [loading, setLoading]   = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [mobileTab, setMobileTab] = useState<"feed" | "rooms">("feed");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const cat = activeCategory === "All" ? "" : activeCategory;
    fetch(`/api/community/rooms${cat ? `?category=${encodeURIComponent(cat)}` : ""}`)
      .then(r => r.json()).then(setRooms).catch(console.error);
  }, [activeCategory]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/community/posts?sort=${sort}&limit=30`)
      .then(r => r.json()).then((data: CommunityPost[]) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sort]);

  // ── Shared: feed column ────────────────────────────────────────────────────
  const feedColumn = (
    <div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        {(["new", "top"] as const).map(s => (
          <button key={s} onClick={() => setSort(s)}
            style={{ padding: "0.4rem 1rem", borderRadius: 20, border: "none", cursor: "pointer",
              background: sort === s ? NAVY : "#e8e0d0", color: sort === s ? GOLD : "#555",
              fontWeight: sort === s ? 700 : 400, fontSize: "0.875rem" }}>
            {s === "new" ? "🕐 New" : "🔥 Top"}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading...</div>
      ) : posts.length === 0 ? (
        <EmptyFeed onSignIn={() => setShowAuth(true)} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} onRequireAuth={() => setShowAuth(true)} />
          ))}
        </div>
      )}
    </div>
  );

  // ── Shared: rooms list (used in both mobile tab and desktop sidebar) ────────
  const roomsList = (mobile: boolean) => (
    <>
      {/* Category chips — horizontal scroll on mobile, wrap on desktop */}
      <div style={{
        display: "flex", gap: "0.4rem", marginBottom: "0.75rem",
        ...(mobile
          ? { overflowX: "auto", paddingBottom: "0.25rem", scrollbarWidth: "none" as const }
          : { flexWrap: "wrap" as const }),
      }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: mobile ? "0.4rem 0.9rem" : "0.25rem 0.65rem",
              borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: mobile ? "0.82rem" : "0.78rem", whiteSpace: "nowrap" as const, flexShrink: 0,
              background: activeCategory === cat ? GOLD : (mobile ? "#e8e0d0" : "#f0ece4"),
              color: activeCategory === cat ? NAVY : "#555",
              fontWeight: activeCategory === cat ? 700 : 400 }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Room cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: mobile ? "0.5rem" : 0 }}>
        {rooms.map(room => (
          <Link key={room.id} href={`/community/r/${room.slug}`}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              textDecoration: "none",
              ...(mobile
                ? { background: "#fff", borderRadius: 12, padding: "0.875rem 1rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ede8e0" }
                : { padding: "0.75rem 1rem", borderBottom: "1px solid #f8f4ee" }),
            }}
            onMouseEnter={e => (e.currentTarget.style.background = mobile ? "#fffbf4" : "#faf6ef")}
            onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
            <span style={{ fontSize: mobile ? "1.75rem" : "1.4rem", lineHeight: 1 }}>{room.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: NAVY, fontWeight: mobile ? 700 : 600,
                fontSize: mobile ? "0.925rem" : "0.875rem",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {room.name}
              </div>
              <div style={{ color: "#888", fontSize: "0.75rem", marginTop: mobile ? "0.15rem" : 0 }}>
                {room.member_count.toLocaleString()} members · {room.post_count} posts
              </div>
            </div>
            {room.is_official && (
              <span style={{ fontSize: "0.65rem", background: "#e8f0fe", color: "#3b5bdb",
                padding: "2px 6px", borderRadius: 8, fontWeight: 600, flexShrink: 0 }}>OFFICIAL</span>
            )}
            {mobile && <span style={{ color: "#ccc", fontSize: "1rem", flexShrink: 0 }}>›</span>}
          </Link>
        ))}
      </div>

      {/* Create room CTA */}
      <div style={{ padding: mobile ? "1rem 0 0" : "0.75rem" }}>
        {user ? (
          <Link href="/community/create-room"
            style={{ display: "block", textAlign: "center", background: GOLD, color: NAVY,
              padding: mobile ? "0.75rem" : "0.5rem",
              borderRadius: mobile ? 12 : 8, fontWeight: 700, textDecoration: "none",
              fontSize: mobile ? "0.9rem" : "0.85rem",
              ...(mobile ? { boxShadow: "0 2px 8px rgba(201,149,42,0.3)" } : {}) }}>
            + Create a New Room
          </Link>
        ) : (
          <button onClick={() => setShowAuth(true)}
            style={{ display: "block", width: "100%", textAlign: "center", background: GOLD, color: NAVY,
              padding: mobile ? "0.75rem" : "0.5rem",
              borderRadius: mobile ? 12 : 8, fontWeight: 700, border: "none", cursor: "pointer",
              fontSize: mobile ? "0.9rem" : "0.85rem",
              ...(mobile ? { boxShadow: "0 2px 8px rgba(201,149,42,0.3)" } : {}) }}>
            + Create a New Room
          </button>
        )}
      </div>
    </>
  );

  // ── Desktop sidebar wrapper ────────────────────────────────────────────────
  const desktopSidebar = (
    <aside>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)", position: "sticky", top: "80px" }}>
        <div style={{ background: NAVY, padding: "0.875rem 1rem" }}>
          <h2 style={{ color: GOLD, margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>📚 Study Rooms</h2>
        </div>
        <div style={{ padding: "0.75rem", borderBottom: "1px solid #f0ece4" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: "0.25rem 0.65rem", borderRadius: 12, border: "none", cursor: "pointer", fontSize: "0.78rem",
                  background: activeCategory === cat ? GOLD : "#f0ece4",
                  color: activeCategory === cat ? NAVY : "#555",
                  fontWeight: activeCategory === cat ? 700 : 400 }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div style={{ maxHeight: 480, overflowY: "auto" }}>
          {rooms.map(room => (
            <Link key={room.id} href={`/community/r/${room.slug}`}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem",
                textDecoration: "none", borderBottom: "1px solid #f8f4ee" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#faf6ef")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <span style={{ fontSize: "1.4rem", lineHeight: 1 }}>{room.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: NAVY, fontWeight: 600, fontSize: "0.875rem",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.name}</div>
                <div style={{ color: "#888", fontSize: "0.75rem" }}>
                  {room.member_count.toLocaleString()} members · {room.post_count} posts
                </div>
              </div>
              {room.is_official && (
                <span style={{ fontSize: "0.65rem", background: "#e8f0fe", color: "#3b5bdb",
                  padding: "2px 6px", borderRadius: 8, fontWeight: 600 }}>OFFICIAL</span>
              )}
            </Link>
          ))}
        </div>
        <div style={{ padding: "0.75rem" }}>
          {user ? (
            <Link href="/community/create-room"
              style={{ display: "block", textAlign: "center", background: GOLD, color: NAVY,
                padding: "0.5rem", borderRadius: 8, fontWeight: 700, textDecoration: "none", fontSize: "0.85rem" }}>
              + Create New Room
            </Link>
          ) : (
            <button onClick={() => setShowAuth(true)}
              style={{ display: "block", width: "100%", textAlign: "center", background: GOLD, color: NAVY,
                padding: "0.5rem", borderRadius: 8, fontWeight: 700, border: "none",
                cursor: "pointer", fontSize: "0.85rem" }}>
              + Create New Room
            </button>
          )}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 12, padding: "1rem", marginTop: "1rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
        <h3 style={{ color: NAVY, margin: "0 0 0.5rem", fontSize: "0.9rem" }}>📖 Community Guidelines</h3>
        <ul style={{ margin: 0, padding: "0 0 0 1.1rem", color: "#555", fontSize: "0.82rem", lineHeight: 1.7 }}>
          <li>Be kind and respectful</li>
          <li>Stay on-topic for each room</li>
          <li>No spam or self-promotion</li>
          <li>Cite scripture references</li>
          <li>Disagree graciously</li>
        </ul>
      </div>
    </aside>
  );

  return (
    <main style={{ background: CREAM, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            const next = encodeURIComponent(window.location.pathname);
            window.location.href = `/profile/setup?next=${next}`;
          }}
        />
      )}

      {/* Hero — compact on mobile */}
      <div style={{ background: NAVY,
        padding: isMobile ? "1.25rem 1rem 1rem" : "2.5rem 1.5rem 2rem",
        textAlign: "center" }}>
        <div style={{ fontSize: isMobile ? "1.75rem" : "2.5rem", marginBottom: "0.3rem" }}>🕊️</div>
        <h1 style={{ color: GOLD, margin: "0 0 0.3rem",
          fontSize: isMobile ? "1.35rem" : "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 800 }}>
          Bible Study Community
        </h1>
        <p style={{ color: "#ccc", margin: 0, fontSize: isMobile ? "0.85rem" : "1rem" }}>
          Discuss Scripture, ask questions, and grow together in faith.
        </p>
        {/* On mobile the "Create a Room" button lives in the Rooms tab */}
        {!isMobile && (
          user ? (
            <Link href="/community/create-room"
              style={{ display: "inline-block", marginTop: "1rem", background: GOLD, color: NAVY,
                padding: "0.5rem 1.25rem", borderRadius: 20, fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>
              + Create a Room
            </Link>
          ) : (
            <button onClick={() => setShowAuth(true)}
              style={{ display: "inline-block", marginTop: "1rem", background: GOLD, color: NAVY,
                padding: "0.5rem 1.25rem", borderRadius: 20, fontWeight: 700, border: "none",
                cursor: "pointer", fontSize: "0.9rem" }}>
              + Create a Room
            </button>
          )
        )}
      </div>

      {/* Mobile: sticky tab bar */}
      {isMobile && (
        <div style={{ background: "#fff", borderBottom: "1px solid #ede8e0",
          display: "flex", position: "sticky", top: 0, zIndex: 20,
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
          {(["feed", "rooms"] as const).map(tab => (
            <button key={tab} onClick={() => setMobileTab(tab)}
              style={{ flex: 1, padding: "0.85rem 0", border: "none", background: "none",
                cursor: "pointer", fontWeight: 700, fontSize: "0.9rem",
                color: mobileTab === tab ? GOLD : "#999",
                borderBottom: `3px solid ${mobileTab === tab ? GOLD : "transparent"}`,
                transition: "color 0.15s, border-color 0.15s" }}>
              {tab === "feed" ? "📰 Feed" : "📚 Rooms"}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ maxWidth: isMobile ? "100%" : 1100, margin: "0 auto",
        padding: isMobile ? "1rem" : "1.5rem 1rem" }}>
        {isMobile ? (
          // Mobile: single-column tab content
          mobileTab === "feed" ? feedColumn : roomsList(true)
        ) : (
          // Desktop: 2-column grid
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
            {feedColumn}
            {desktopSidebar}
          </div>
        )}
      </div>
    </main>
  );
}

function PostCard({ post, onRequireAuth }: { post: CommunityPost; onRequireAuth: () => void }) {
  const [votes, setVotes]   = useState(post.upvote_count);
  const [voted, setVoted]   = useState(post.user_voted ?? false);
  const [voting, setVoting] = useState(false);
  const { user }            = useAuth();

  const typeIcon = post.post_type === "question" ? "❓" : post.post_type === "scripture" ? "📖" : "💬";

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) { onRequireAuth(); return; }
    if (voting) return;
    setVoting(true);
    const res = await fetch("/api/community/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ targetId: post.id, targetType: "post" }),
    });
    if (res.ok) {
      const { voted: v } = await res.json();
      setVoted(v);
      setVotes(prev => v ? prev + 1 : prev - 1);
    }
    setVoting(false);
  }

  return (
    <Link href={`/community/post/${post.id}`} style={{ textDecoration: "none" }}>
      <article style={{ background: "#fff", borderRadius: 10, padding: "0.875rem 1rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ede8e0",
        display: "flex", gap: "0.75rem", transition: "box-shadow 0.15s" }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 3px 12px rgba(0,0,0,0.1)")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")}>

        {/* Vote column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", minWidth: 32 }}>
          <button onClick={handleVote}
            style={{ background: "none", border: "none", cursor: "pointer",
              fontSize: "1.1rem", padding: "2px", color: voted ? GOLD : "#bbb" }}>
            ▲
          </button>
          <span style={{ fontWeight: 700, fontSize: "0.85rem", color: voted ? GOLD : NAVY }}>{votes}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
            {post.is_pinned && (
              <span style={{ fontSize: "0.68rem", background: "#fff3cd", color: "#856404",
                padding: "1px 5px", borderRadius: 6, fontWeight: 600 }}>📌 PINNED</span>
            )}
            {post.room_slug && (
              <span style={{ fontSize: "0.72rem", color: "#5c7cfa", fontWeight: 600 }}>
                {post.room_icon} {post.room_name}
              </span>
            )}
            <span style={{ fontSize: "0.72rem", color: "#bbb" }}>{typeIcon}</span>
          </div>
          <h3 style={{ margin: "0 0 0.25rem", color: NAVY, fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.35 }}>
            {post.title}
          </h3>
          {post.body && (
            <p style={{ margin: "0 0 0.4rem", color: "#666", fontSize: "0.82rem", lineHeight: 1.45,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {post.body}
            </p>
          )}
          <div style={{ display: "flex", gap: "0.75rem", color: "#aaa", fontSize: "0.75rem", flexWrap: "wrap" }}>
            <span>👤 {post.author_name}</span>
            <span>💬 {post.comment_count}</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function EmptyFeed({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem", color: "#888" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
      <p style={{ fontSize: "1.05rem", fontWeight: 600, color: NAVY }}>No posts yet</p>
      <p style={{ fontSize: "0.875rem" }}>Be the first to start a discussion!</p>
      <button onClick={onSignIn}
        style={{ marginTop: "0.75rem", background: GOLD, color: NAVY, border: "none",
          borderRadius: 20, padding: "0.5rem 1.25rem", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
        Sign In to Post
      </button>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
