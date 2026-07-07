"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authClient";
import AuthModal from "@/components/AuthModal";
import type { CommunityPost, CommunityComment } from "@/lib/community";

const GOLD = "#C9952A";
const NAVY = "#1a2640";
const CREAM = "#faf8f4";

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();

  const [post, setPost]             = useState<CommunityPost | null>(null);
  const [comments, setComments]     = useState<CommunityComment[]>([]);
  const [loading, setLoading]       = useState(true);
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");
  const [votes, setVotes]           = useState(0);
  const [voted, setVoted]           = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showAuth, setShowAuth]     = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/community/posts/${id}`).then(r => r.json()),
      fetch(`/api/community/comments?postId=${id}`).then(r => r.json()),
    ]).then(([p, c]) => {
      setPost(p);
      setVotes(p.upvote_count ?? 0);
      setVoted(p.user_voted ?? false);
      setComments(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  async function handleVotePost() {
    if (!user) { setShowAuth(true); return; }
    const res = await fetch("/api/community/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ targetId: id, targetType: "post" }),
    });
    if (res.ok) {
      const { voted: v } = await res.json();
      setVoted(v); setVotes(prev => v ? prev + 1 : prev - 1);
    }
  }

  async function handleSubmitComment(e: React.FormEvent, parentId?: string | null) {
    e.preventDefault();
    if (!user) return;
    const body = commentBody.trim();
    if (!body) { setError("Comment cannot be empty"); return; }
    setSubmitting(true); setError("");
    const res = await fetch("/api/community/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ postId: id, body, parentCommentId: parentId ?? null }),
    });
    if (res.ok) {
      const newComment = await res.json();
      if (!parentId) {
        setComments(prev => [...prev, { ...newComment, replies: [] }]);
      } else {
        setComments(prev => addReply(prev, parentId, { ...newComment, replies: [] }));
      }
      setCommentBody("");
      setPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev);
    } else {
      const { error: err } = await res.json().catch(() => ({}));
      setError(err ?? "Failed to post comment");
    }
    setSubmitting(false);
  }

  async function handleReport() {
    if (!user || !reportReason.trim()) return;
    const res = await fetch("/api/community/report", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ targetId: id, targetType: "post", reason: reportReason }),
    });
    if (res.ok) { setShowReport(false); setReportReason(""); alert("Report submitted. Thank you."); }
    else { alert("Failed to report. You may have already reported this."); }
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#888" }}>Loading...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: NAVY, fontWeight: 700 }}>Post not found.</p>
          <Link href="/community" style={{ color: GOLD }}>← Back to Community</Link>
        </div>
      </main>
    );
  }

  const typeIcon = post.post_type === "question" ? "❓" : post.post_type === "scripture" ? "📖" : "💬";

  return (
    <main style={{ background: CREAM, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "1.5rem 1rem" }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: "1rem", fontSize: "0.82rem", color: "#888" }}>
          <Link href="/community" style={{ color: GOLD, textDecoration: "none" }}>Community</Link>
          {post.room_slug && (
            <>
              {" / "}
              <Link href={`/community/r/${post.room_slug}`} style={{ color: GOLD, textDecoration: "none" }}>
                {post.room_icon} {post.room_name}
              </Link>
            </>
          )}
        </div>

        {/* Post card */}
        <article style={{ background: "#fff", borderRadius: 12, padding: "1.5rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "1.5rem" }}>

          {/* Vote + title row */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <button onClick={handleVotePost}
                style={{ background: "none", border: "none", cursor: user ? "pointer" : "default",
                  fontSize: "1.4rem", padding: "4px", color: voted ? GOLD : "#bbb" }}>▲</button>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: voted ? GOLD : NAVY }}>{votes}</span>
            </div>
            <div style={{ flex: 1 }}>
              {post.is_pinned && (
                <span style={{ fontSize: "0.72rem", background: "#fff3cd", color: "#856404",
                  padding: "2px 6px", borderRadius: 6, fontWeight: 600, marginBottom: "0.5rem", display: "inline-block" }}>
                  📌 PINNED
                </span>
              )}
              <h1 style={{ color: NAVY, margin: "0 0 0.6rem", fontSize: "clamp(1.1rem, 3vw, 1.4rem)", fontWeight: 700, lineHeight: 1.3 }}>
                {typeIcon} {post.title}
              </h1>
              {post.body && (
                <p style={{ color: "#333", margin: "0 0 1rem", fontSize: "0.95rem", lineHeight: 1.65,
                  whiteSpace: "pre-wrap" }}>
                  {post.body}
                </p>
              )}
              <div style={{ display: "flex", gap: "1rem", color: "#888", fontSize: "0.8rem", flexWrap: "wrap" }}>
                <span>👤 {post.author_name}</span>
                <span>💬 {post.comment_count} comments</span>
                <span>{timeAgo(post.created_at)}</span>
                {user && (
                  <button onClick={() => setShowReport(!showReport)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa",
                      fontSize: "0.78rem", padding: 0 }}>
                    🚩 Report
                  </button>
                )}
              </div>

              {/* Report form */}
              {showReport && (
                <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#fff8f0", borderRadius: 8, border: "1px solid #fde8c0" }}>
                  <p style={{ margin: "0 0 0.5rem", fontSize: "0.82rem", color: "#555" }}>Why are you reporting this post?</p>
                  <textarea value={reportReason} onChange={e => setReportReason(e.target.value)}
                    placeholder="Describe the issue..."
                    rows={2}
                    style={{ width: "100%", padding: "0.4rem", border: "1px solid #ddd", borderRadius: 6,
                      fontSize: "0.82rem", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical" }} />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button onClick={handleReport}
                      style={{ background: "#dc3545", color: "#fff", border: "none", borderRadius: 6,
                        padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700 }}>
                      Submit Report
                    </button>
                    <button onClick={() => { setShowReport(false); setReportReason(""); }}
                      style={{ background: "none", border: "1px solid #ccc", borderRadius: 6,
                        padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", color: "#555" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Comments section */}
        <section>
          <h2 style={{ color: NAVY, fontSize: "1rem", fontWeight: 700, marginBottom: "1rem" }}>
            💬 {post.comment_count} Comments
          </h2>

          {/* Comment form */}
          {user ? (
            post.is_locked ? (
              <div style={{ background: "#fff3cd", borderRadius: 8, padding: "0.75rem 1rem",
                marginBottom: "1rem", color: "#856404", fontSize: "0.875rem" }}>
                🔒 Comments are locked on this post.
              </div>
            ) : (
              <form onSubmit={e => handleSubmitComment(e, null)}
                style={{ background: "#fff", borderRadius: 10, padding: "1rem",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)", marginBottom: "1.5rem" }}>
                <textarea value={commentBody} onChange={e => setCommentBody(e.target.value)}
                  placeholder="Share your thoughts, insight, or encouragement..."
                  rows={3}
                  style={{ width: "100%", padding: "0.6rem 0.75rem", border: "1px solid #ddd", borderRadius: 8,
                    fontSize: "0.9rem", marginBottom: "0.6rem", resize: "vertical",
                    boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
                {error && <p style={{ color: "#dc3545", fontSize: "0.82rem", margin: "0 0 0.4rem" }}>{error}</p>}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={submitting}
                    style={{ background: submitting ? "#ccc" : NAVY, color: GOLD, border: "none",
                      borderRadius: 8, padding: "0.45rem 1.25rem", fontWeight: 700,
                      cursor: submitting ? "default" : "pointer", fontSize: "0.875rem" }}>
                    {submitting ? "Posting..." : "Comment"}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem",
              marginBottom: "1.5rem", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
              <p style={{ color: NAVY, fontWeight: 700, margin: "0 0 0.25rem", fontSize: "0.95rem" }}>
                Join the conversation 💬
              </p>
              <p style={{ color: "#888", margin: "0 0 0.875rem", fontSize: "0.85rem" }}>
                Create a free account to comment, ask questions, and connect with believers worldwide.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setShowAuth(true)}
                  style={{ background: GOLD, color: NAVY, padding: "0.45rem 1.5rem", borderRadius: 20,
                    border: "none", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer" }}>
                  Sign Up — It&apos;s Free
                </button>
                <button onClick={() => setShowAuth(true)}
                  style={{ background: "transparent", color: NAVY, padding: "0.45rem 1.25rem", borderRadius: 20,
                    border: `2px solid ${NAVY}`, fontWeight: 700, fontSize: "0.875rem", cursor: "pointer" }}>
                  Sign In
                </button>
              </div>
            </div>
          )}

          {/* Comment thread */}
          {comments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "#aaa", fontSize: "0.9rem" }}>
              No comments yet — be the first!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {comments.map(c => (
                <CommentCard key={c.id} comment={c} user={user} postId={id}
                  onRequireAuth={() => setShowAuth(true)}
                  onReplyAdded={(parentId, newComment) => {
                    setComments(prev => addReply(prev, parentId, { ...newComment, replies: [] }));
                    setPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : prev);
                  }} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CommentCard({ comment, user, postId, depth = 0, onReplyAdded, onRequireAuth }: {
  comment: CommunityComment;
  user: { access_token: string } | null;
  postId: string;
  depth?: number;
  onReplyAdded: (parentId: string, newComment: CommunityComment) => void;
  onRequireAuth: () => void;
}) {
  const [votes, setVotes]     = useState(comment.upvote_count);
  const [voted, setVoted]     = useState(comment.user_voted ?? false);
  const [showReply, setShowReply] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleVote() {
    if (!user) { onRequireAuth(); return; }
    const res = await fetch("/api/community/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ targetId: comment.id, targetType: "comment" }),
    });
    if (res.ok) {
      const { voted: v } = await res.json();
      setVoted(v); setVotes(prev => v ? prev + 1 : prev - 1);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !replyBody.trim()) return;
    setSubmitting(true);
    const res = await fetch("/api/community/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ postId, body: replyBody.trim(), parentCommentId: comment.id }),
    });
    if (res.ok) {
      const newComment = await res.json();
      onReplyAdded(comment.id, newComment);
      setReplyBody(""); setShowReply(false);
    }
    setSubmitting(false);
  }

  const borderLeft = depth > 0 ? `3px solid ${depth === 1 ? GOLD : "#e0d8cc"}` : "none";

  return (
    <div style={{ paddingLeft: depth > 0 ? "1rem" : 0 }}>
      <div style={{ background: "#fff", borderRadius: 8, padding: "0.875rem 1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderLeft,
        border: depth === 0 ? "1px solid #ede8e0" : undefined }}>

        {/* Author + time */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: NAVY,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: GOLD, fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>
            {(comment.author_name ?? "?")[0].toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, color: NAVY, fontSize: "0.83rem" }}>{comment.author_name}</span>
          <span style={{ color: "#aaa", fontSize: "0.75rem" }}>{timeAgo(comment.created_at)}</span>
        </div>

        <p style={{ margin: "0 0 0.6rem", color: "#333", fontSize: "0.9rem", lineHeight: 1.6,
          whiteSpace: "pre-wrap" }}>
          {comment.body}
        </p>

        {/* Actions — always visible, guests get prompted */}
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button onClick={handleVote}
            style={{ background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "4px", padding: 0,
              color: voted ? GOLD : "#aaa", fontSize: "0.8rem" }}>
            <span style={{ fontSize: "1rem" }}>▲</span>
            <span style={{ fontWeight: voted ? 700 : 400 }}>{votes}</span>
          </button>
          {depth < 2 && (
            <button onClick={() => user ? setShowReply(!showReply) : onRequireAuth()}
              style={{ background: "none", border: "none", cursor: "pointer",
                color: "#888", fontSize: "0.78rem", padding: 0 }}>
              💬 Reply
            </button>
          )}
        </div>

        {/* Reply form */}
        {showReply && (
          <form onSubmit={handleReply} style={{ marginTop: "0.75rem" }}>
            <textarea value={replyBody} onChange={e => setReplyBody(e.target.value)}
              placeholder={`Replying to ${comment.author_name}...`}
              rows={2}
              style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: 6,
                fontSize: "0.87rem", resize: "vertical", boxSizing: "border-box",
                fontFamily: "inherit", outline: "none", marginBottom: "0.4rem" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="submit" disabled={submitting}
                style={{ background: NAVY, color: GOLD, border: "none", borderRadius: 6,
                  padding: "0.3rem 0.875rem", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem" }}>
                {submitting ? "..." : "Reply"}
              </button>
              <button type="button" onClick={() => setShowReply(false)}
                style={{ background: "none", border: "1px solid #ccc", borderRadius: 6,
                  padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.8rem", color: "#555" }}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {comment.replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} user={user} postId={postId}
              depth={depth + 1} onReplyAdded={onReplyAdded} onRequireAuth={onRequireAuth} />
          ))}
        </div>
      )}
    </div>
  );
}

function addReply(comments: CommunityComment[], parentId: string, newReply: CommunityComment): CommunityComment[] {
  return comments.map(c => {
    if (c.id === parentId) return { ...c, replies: [...(c.replies ?? []), newReply] };
    if (c.replies?.length) return { ...c, replies: addReply(c.replies, parentId, newReply) };
    return c;
  });
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
