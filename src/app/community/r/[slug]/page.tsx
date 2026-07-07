"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authClient";
import AuthModal from "@/components/AuthModal";
import type { CommunityRoom, CommunityPost } from "@/lib/community";

const GOLD = "#C9952A";
const NAVY = "#1a2640";
const CREAM = "#faf8f4";

const POST_TYPES = [
  { value: "discussion", label: "💬 Discussion" },
  { value: "question",   label: "❓ Question"   },
  { value: "scripture",  label: "📖 Scripture"  },
];

export default function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();

  const [room, setRoom]         = useState<CommunityRoom | null>(null);
  const [posts, setPosts]       = useState<CommunityPost[]>([]);
  const [sort, setSort]         = useState<"new" | "top">("new");
  const [loading, setLoading]   = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // New post form state
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [postType, setPostType] = useState("discussion");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    fetch(`/api/community/rooms?category=`)
      .then(r => r.json())
      .then((rooms: CommunityRoom[]) => {
        const found = rooms.find(r => r.slug === slug);
        if (found) setRoom(found);
      });
  }, [slug]);

  useEffect(() => {
    if (!room) return;
    setLoading(true);
    fetch(`/api/community/posts?roomId=${room.id}&sort=${sort}&limit=30`)
      .then(r => r.json())
      .then((data: CommunityPost[]) => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [room, sort]);

  // Check membership
  useEffect(() => {
    if (!user || !room) return;
    // We'll derive this from the local state after join/leave
  }, [user, room]);

  async function handleJoin() {
    if (!user || !room) return;
    const res = await fetch("/api/community/rooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ roomId: room.id, action: isMember ? "leave" : "join" }),
    });
    if (res.ok) {
      const { member } = await res.json();
      setIsMember(member);
      setRoom(prev => prev ? {
        ...prev, member_count: prev.member_count + (member ? 1 : -1)
      } : prev);
    }
  }

  async function handleSubmitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !room) return;
    if (!title.trim()) { setError("Title is required"); return; }
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/community/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ roomId: room.id, title, body, postType }),
    });
    if (res.ok) {
      const newPost = await res.json();
      setPosts(prev => [newPost, ...prev]);
      setTitle(""); setBody(""); setPostType("discussion");
      setShowNewPost(false);
    } else {
      const { error: err } = await res.json().catch(() => ({}));
      setError(err ?? "Failed to post. Please try again.");
    }
    setSubmitting(false);
  }

  if (!room) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: CREAM }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
          <p style={{ color: "#888" }}>Loading room...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: CREAM, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {/* Room header */}
      <div style={{ background: NAVY }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "2.5rem" }}>{room.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: "0.2rem" }}>
                <Link href="/community" style={{ color: GOLD, textDecoration: "none" }}>Community</Link> / r/{slug}
              </div>
              <h1 style={{ color: "#fff", margin: 0, fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 800 }}>
                {room.name}
              </h1>
              {room.description && (
                <p style={{ color: "#aaa", margin: "0.3rem 0 0", fontSize: "0.875rem" }}>{room.description}</p>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexShrink: 0 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: "1.1rem" }}>{room.member_count.toLocaleString()}</div>
                <div style={{ color: "#aaa", fontSize: "0.72rem" }}>members</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: GOLD, fontWeight: 800, fontSize: "1.1rem" }}>{room.post_count}</div>
                <div style={{ color: "#aaa", fontSize: "0.72rem" }}>posts</div>
              </div>
              {/* Join button — always visible, guests get auth prompt */}
              <button onClick={user ? handleJoin : () => setShowAuth(true)}
                style={{ background: isMember ? "transparent" : GOLD, color: isMember ? GOLD : NAVY,
                  border: `2px solid ${GOLD}`, padding: "0.4rem 1rem", borderRadius: 20,
                  fontWeight: 700, cursor: "pointer", fontSize: "0.875rem" }}>
                {isMember ? "✓ Joined" : "Join"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* New post button / form — always visible, guests get auth prompt */}
        {!room.is_locked && (
          <div style={{ marginBottom: "1.25rem" }}>
            {!showNewPost ? (
              <button onClick={() => user ? setShowNewPost(true) : setShowAuth(true)}
                style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%",
                  background: "#fff", border: "1px solid #ddd", borderRadius: 10, padding: "0.75rem 1rem",
                  cursor: "pointer", color: "#888", fontSize: "0.9rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: "1.2rem" }}>✍️</span>
                {user ? `Start a discussion in ${room.name}...` : "Sign in to post a discussion..."}
              </button>
            ) : (
              <form onSubmit={handleSubmitPost}
                style={{ background: "#fff", borderRadius: 12, padding: "1.25rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid #ede8e0" }}>
                <h3 style={{ color: NAVY, margin: "0 0 1rem", fontSize: "0.95rem" }}>New Post in {room.name}</h3>

                {/* Post type */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {POST_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setPostType(t.value)}
                      style={{ padding: "0.3rem 0.75rem", borderRadius: 16, border: "none", cursor: "pointer",
                        fontSize: "0.8rem", background: postType === t.value ? NAVY : "#f0ece4",
                        color: postType === t.value ? GOLD : "#555", fontWeight: postType === t.value ? 700 : 400 }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Title (required)"
                  maxLength={200}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #ddd", borderRadius: 8,
                    fontSize: "0.95rem", marginBottom: "0.6rem", boxSizing: "border-box",
                    fontFamily: "inherit", outline: "none" }} />

                <textarea value={body} onChange={e => setBody(e.target.value)}
                  placeholder="Body (optional) — share your thoughts, a verse, or a question..."
                  rows={4}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #ddd", borderRadius: 8,
                    fontSize: "0.9rem", marginBottom: "0.75rem", resize: "vertical", boxSizing: "border-box",
                    fontFamily: "inherit", outline: "none" }} />

                {error && <p style={{ color: "#dc3545", fontSize: "0.82rem", marginBottom: "0.5rem" }}>{error}</p>}

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button type="button" onClick={() => { setShowNewPost(false); setError(""); }}
                    style={{ padding: "0.4rem 1rem", borderRadius: 8, border: "1px solid #ccc",
                      background: "none", cursor: "pointer", fontSize: "0.875rem", color: "#555" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    style={{ padding: "0.4rem 1.25rem", borderRadius: 8, border: "none",
                      background: submitting ? "#ccc" : NAVY, color: GOLD, fontWeight: 700,
                      cursor: submitting ? "default" : "pointer", fontSize: "0.875rem" }}>
                    {submitting ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {room.is_locked && (
          <div style={{ background: "#fff3cd", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem",
            color: "#856404", fontSize: "0.875rem" }}>
            🔒 This room is locked — no new posts at this time.
          </div>
        )}

        {/* Sort */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          {(["new", "top"] as const).map(s => (
            <button key={s} onClick={() => setSort(s)}
              style={{ padding: "0.35rem 0.9rem", borderRadius: 16, border: "none", cursor: "pointer",
                background: sort === s ? NAVY : "#e8e0d0", color: sort === s ? GOLD : "#555",
                fontWeight: sort === s ? 700 : 400, fontSize: "0.82rem" }}>
              {s === "new" ? "🕐 New" : "🔥 Top"}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#888" }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#888" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📭</div>
            <p style={{ fontWeight: 600, color: NAVY }}>No posts yet in {room.name}</p>
            <p style={{ fontSize: "0.875rem" }}>Be the first to start a discussion!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {posts.map(post => <RoomPostCard key={post.id} post={post} user={user} onRequireAuth={() => setShowAuth(true)} />)}
          </div>
        )}
      </div>
    </main>
  );
}

function RoomPostCard({ post, user, onRequireAuth }: {
  post: CommunityPost;
  user: { access_token: string } | null;
  onRequireAuth: () => void;
}) {
  const [votes, setVotes]   = useState(post.upvote_count);
  const [voted, setVoted]   = useState(post.user_voted ?? false);
  const [voting, setVoting] = useState(false);
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
      setVoted(v); setVotes(prev => v ? prev + 1 : prev - 1);
    }
    setVoting(false);
  }

  return (
    <Link href={`/community/post/${post.id}`} style={{ textDecoration: "none" }}>
      <article style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ede8e0",
        display: "flex", gap: "0.875rem" }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 3px 12px rgba(0,0,0,0.1)")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", minWidth: 36 }}>
          <button onClick={handleVote}
            style={{ background: "none", border: "none", cursor: "pointer",
              fontSize: "1.2rem", padding: "2px", color: voted ? GOLD : "#bbb" }}>▲</button>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: voted ? GOLD : NAVY }}>{votes}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {post.is_pinned && (
            <span style={{ fontSize: "0.7rem", background: "#fff3cd", color: "#856404",
              padding: "2px 6px", borderRadius: 6, fontWeight: 600, marginBottom: "0.3rem", display: "inline-block" }}>
              📌 PINNED
            </span>
          )}
          <h3 style={{ margin: "0 0 0.3rem", color: NAVY, fontSize: "0.975rem", fontWeight: 600, lineHeight: 1.35 }}>
            {typeIcon} {post.title}
          </h3>
          {post.body && (
            <p style={{ margin: "0 0 0.5rem", color: "#555", fontSize: "0.84rem", lineHeight: 1.5,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {post.body}
            </p>
          )}
          <div style={{ display: "flex", gap: "1rem", color: "#888", fontSize: "0.78rem" }}>
            <span>👤 {post.author_name}</span>
            <span>💬 {post.comment_count} comments</span>
            <span>{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
