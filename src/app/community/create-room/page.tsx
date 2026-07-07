"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/authClient";

const GOLD = "#C9952A";
const NAVY = "#1a2640";
const CREAM = "#faf8f4";

const CATEGORIES = ["General", "Old Testament", "New Testament", "Study", "Life"];
const ICONS = ["📖", "✝️", "🙏", "💬", "🔍", "💡", "🌿", "🔥", "⛪", "🕊️",
               "🌍", "🎵", "📜", "👁️", "🛡️", "🌟", "💛", "🗺️", "⚓", "🌈"];

export default function CreateRoomPage() {
  const { user } = useAuth();
  const router   = useRouter();

  const [name, setName]           = useState("");
  const [slug, setSlug]           = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory]   = useState("General");
  const [icon, setIcon]           = useState("📖");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState("");

  function handleNameChange(val: string) {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 50));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setError("You must be signed in."); return; }
    if (!name.trim()) { setError("Room name is required."); return; }
    if (!slug.trim()) { setError("Slug is required."); return; }

    setSubmitting(true); setError("");
    const res = await fetch("/api/community/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.access_token}` },
      body: JSON.stringify({ name, slug, description, category, icon }),
    });
    if (res.ok) {
      const room = await res.json();
      router.push(`/community/r/${room.slug}`);
    } else {
      const { error: err } = await res.json().catch(() => ({}));
      setError(err ?? "Failed to create room. The slug may already be taken.");
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <main style={{ minHeight: "100vh", background: CREAM, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: NAVY, fontWeight: 700 }}>You must be signed in to create a room.</p>
          <Link href="/auth/login" style={{ color: GOLD }}>Sign In</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: CREAM, minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "2rem 1rem" }}>

        <div style={{ marginBottom: "1.25rem" }}>
          <Link href="/community" style={{ color: GOLD, textDecoration: "none", fontSize: "0.875rem" }}>
            ← Back to Community
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: "2rem",
          boxShadow: "0 3px 16px rgba(0,0,0,0.08)" }}>

          <h1 style={{ color: NAVY, margin: "0 0 0.4rem", fontSize: "1.5rem", fontWeight: 800 }}>
            Create a Study Room
          </h1>
          <p style={{ color: "#888", margin: "0 0 1.5rem", fontSize: "0.875rem" }}>
            Start a new community around a Bible topic, book, or theme.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Icon picker */}
            <label style={{ display: "block", fontWeight: 600, color: NAVY, marginBottom: "0.4rem", fontSize: "0.875rem" }}>
              Icon
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.1rem" }}>
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setIcon(ic)}
                  style={{ fontSize: "1.4rem", padding: "6px", borderRadius: 8, border: "none",
                    cursor: "pointer", background: icon === ic ? "#fef3cd" : "#f4f1ea",
                    outline: icon === ic ? `2px solid ${GOLD}` : "none" }}>
                  {ic}
                </button>
              ))}
            </div>

            {/* Name */}
            <label style={{ display: "block", fontWeight: 600, color: NAVY, marginBottom: "0.4rem", fontSize: "0.875rem" }}>
              Room Name *
            </label>
            <input value={name} onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. Book of Job"
              maxLength={80}
              style={{ width: "100%", padding: "0.65rem 0.875rem", border: "1px solid #ddd", borderRadius: 8,
                fontSize: "0.95rem", marginBottom: "1rem", boxSizing: "border-box",
                fontFamily: "inherit", outline: "none" }} />

            {/* Slug */}
            <label style={{ display: "block", fontWeight: 600, color: NAVY, marginBottom: "0.25rem", fontSize: "0.875rem" }}>
              URL Slug *
            </label>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ background: "#f4f1ea", padding: "0.65rem 0.75rem", borderRadius: "8px 0 0 8px",
                border: "1px solid #ddd", borderRight: "none", color: "#888", fontSize: "0.85rem",
                whiteSpace: "nowrap" }}>
                /community/r/
              </span>
              <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="book-of-job"
                maxLength={50}
                style={{ flex: 1, padding: "0.65rem 0.875rem", border: "1px solid #ddd",
                  borderRadius: "0 8px 8px 0", fontSize: "0.9rem", boxSizing: "border-box",
                  fontFamily: "inherit", outline: "none" }} />
            </div>

            {/* Description */}
            <label style={{ display: "block", fontWeight: 600, color: NAVY, marginBottom: "0.4rem", fontSize: "0.875rem" }}>
              Description
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="What is this room about? What kinds of discussions belong here?"
              rows={3} maxLength={400}
              style={{ width: "100%", padding: "0.65rem 0.875rem", border: "1px solid #ddd", borderRadius: 8,
                fontSize: "0.9rem", marginBottom: "1rem", resize: "vertical", boxSizing: "border-box",
                fontFamily: "inherit", outline: "none" }} />

            {/* Category */}
            <label style={{ display: "block", fontWeight: 600, color: NAVY, marginBottom: "0.4rem", fontSize: "0.875rem" }}>
              Category
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => setCategory(cat)}
                  style={{ padding: "0.35rem 0.875rem", borderRadius: 16, border: "none", cursor: "pointer",
                    fontSize: "0.82rem", background: category === cat ? NAVY : "#f4f1ea",
                    color: category === cat ? GOLD : "#555", fontWeight: category === cat ? 700 : 400 }}>
                  {cat}
                </button>
              ))}
            </div>

            {error && (
              <p style={{ color: "#dc3545", fontSize: "0.85rem", marginBottom: "0.75rem" }}>{error}</p>
            )}

            <button type="submit" disabled={submitting}
              style={{ width: "100%", background: submitting ? "#ccc" : NAVY, color: GOLD,
                border: "none", borderRadius: 10, padding: "0.75rem", fontWeight: 800,
                fontSize: "1rem", cursor: submitting ? "default" : "pointer" }}>
              {icon} {submitting ? "Creating..." : "Create Room"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
