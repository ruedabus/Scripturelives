"use client";

import { useState, useEffect } from "react";
import DevotionalSignup from "@/components/DevotionalSignup";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";
const BORDER = "#ede8de";

// ── Types ─────────────────────────────────────────────────────────────────────
type PrayerRequest = {
  id: string;
  name: string | null;
  message: string;
  pray_count: number;
  created_at: string;
};

// ── localStorage helpers for "already prayed" tracking ───────────────────────
const PRAYED_KEY = "scripture-lives-prayed";
function getPrayedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(PRAYED_KEY) ?? "[]")); }
  catch { return new Set(); }
}
function markPrayed(id: string) {
  const s = getPrayedSet(); s.add(id);
  localStorage.setItem(PRAYED_KEY, JSON.stringify([...s]));
}

// ── Prayer card ───────────────────────────────────────────────────────────────
function PrayerCard({
  request,
  hasPrayed,
  onPray,
}: {
  request: PrayerRequest;
  hasPrayed: boolean;
  onPray: (id: string) => void;
}) {
  const date = new Date(request.created_at).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      className="rounded-2xl border p-5 transition-all bg-white"
      style={{ borderColor: BORDER }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: NAVY }}>
            {request.name?.trim() || "Anonymous"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <span
          className="text-xs rounded-full px-2.5 py-1 font-medium shrink-0"
          style={{ background: "#fdf6e8", color: GOLD }}
        >
          🙏 Prayer Request
        </span>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed" style={{ color: NAVY }}>
        {request.message}
      </p>

      {/* Pray button */}
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => !hasPrayed && onPray(request.id)}
          disabled={hasPrayed}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
          style={
            hasPrayed
              ? { background: "#fdf6e8", color: GOLD, cursor: "default" }
              : { background: GOLD, color: "#ffffff" }
          }
        >
          🙏 {hasPrayed ? "Praying" : "I'm Praying"}
        </button>
        <span className="text-sm text-gray-400">
          {request.pray_count > 0
            ? `${request.pray_count} ${request.pray_count === 1 ? "person" : "people"} praying`
            : "Be the first to pray"}
        </span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PrayerPage() {
  // Form state
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");
  const [isPublic, setIsPublic]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  // Prayer wall state
  const [requests, setRequests]   = useState<PrayerRequest[]>([]);
  const [loading, setLoading]     = useState(true);
  const [prayedSet, setPrayedSet] = useState<Set<string>>(new Set());

  useEffect(() => { setPrayedSet(getPrayedSet()); }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/prayer");
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (message.trim().length < 10) {
      setFormError("Please write a bit more about your prayer request.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, isPublic }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error ?? "Something went wrong."); return; }
      setSubmitted(true);
      setName(""); setEmail(""); setMessage(""); setIsPublic(true);
      if (isPublic) fetchRequests();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePray = async (id: string) => {
    markPrayed(id);
    setPrayedSet((prev) => new Set([...prev, id]));
    setRequests((prev) =>
      prev.map((r) => r.id === id ? { ...r, pray_count: r.pray_count + 1 } : r)
    );
    try { await fetch(`/api/prayer/${id}/pray`, { method: "POST" }); }
    catch { /* optimistic update already applied */ }
  };

  return (
    <main className="min-h-screen" style={{ background: CREAM }}>

      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden border-b"
        style={{ background: NAVY, borderColor: "#0f1a30", minHeight: 320 }}
      >
        {/* prayer-warriors — landscape, wide fade across the right half */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/prayer-warriors.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.18,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />

        {/* Left-to-right gradient so text side stays dark and readable */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to right, ${NAVY} 40%, transparent 80%)`,
            pointerEvents: "none",
          }}
        />

        {/* praying-hands — portrait, anchored to far right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/praying-hands.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            height: "115%",
            width: "auto",
            objectFit: "cover",
            objectPosition: "top",
            opacity: 0.55,
            pointerEvents: "none",
            userSelect: "none",
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.9) 0%, transparent 70%)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.9) 0%, transparent 70%)",
          }}
        />

        {/* Text content */}
        <div className="relative z-10 px-6 py-14 max-w-lg">
          <a
            href="/"
            className="inline-block text-xs mb-6 transition"
            style={{ color: "#6b7f99" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#6b7f99"; }}
          >
            ← Back to Scripture Lives
          </a>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Prayer Wall
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#c7d2e0" }}>
            Share your heart with God and this community. You don't need to leave
            your name — every prayer is heard.
          </p>
          <blockquote
            className="mt-6 text-sm italic border-l-2 pl-4"
            style={{ color: GOLD, borderColor: `${GOLD}88` }}
          >
            "Do not be anxious about anything, but in every situation, by prayer
            and petition, with thanksgiving, present your requests to God."
            <br />
            <span className="not-italic font-semibold text-xs" style={{ color: `${GOLD}cc` }}>
              — Philippians 4:6
            </span>
          </blockquote>
        </div>

        {/* Gold shimmer line at the bottom */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(to right, transparent, ${GOLD}66, transparent)` }}
        />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

        {/* ── Community guidelines notice ── */}
        <div
          className="rounded-2xl border p-4 flex gap-3 items-start"
          style={{ borderColor: BORDER, background: "#ffffff" }}
        >
          <span className="text-xl shrink-0 mt-0.5">✝️</span>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>
              A sacred space — please be respectful
            </p>
            <p className="text-xs leading-relaxed text-gray-500">
              This prayer wall is a place of faith, compassion, and community. We welcome
              all sincere prayer requests. Hateful, disrespectful, or inappropriate content
              will be removed. By submitting, you agree to keep this space holy and uplifting.
              Abuse of this feature will result in removal of your request and may block future
              submissions.
            </p>
          </div>
        </div>

        {/* ── Submit form ── */}
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: NAVY }}>
            Submit a Prayer Request
          </h2>

          {submitted ? (
            <div
              className="rounded-2xl border p-8 text-center"
              style={{ borderColor: `${GOLD}66`, background: "#fdf6e8" }}
            >
              <div className="text-4xl mb-3">✝️</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: NAVY }}>
                Your prayer has been received
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                We're lifting you up in prayer. May God's peace and comfort be with you.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition"
                style={{ background: GOLD }}
              >
                Submit another request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border p-6 space-y-4 bg-white"
              style={{ borderColor: BORDER }}
            >
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>
                    Name <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition"
                    style={{ borderColor: BORDER, color: NAVY }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>
                    Email <span className="font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    maxLength={254}
                    className="w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition"
                    style={{ borderColor: BORDER, color: NAVY }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
                    onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Prayer message */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: NAVY }}>
                  Prayer Request <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what's on your heart…"
                  rows={5}
                  maxLength={2000}
                  required
                  className="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition resize-none leading-relaxed"
                  style={{ borderColor: BORDER, color: NAVY }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
                  onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
                />
                <p className="text-right text-xs text-gray-400 mt-1">{message.length}/2000</p>
              </div>

              {/* Public / Private toggle */}
              <div
                className="flex items-start gap-3 rounded-xl p-4"
                style={{ background: CREAM, border: `1px solid ${BORDER}` }}
              >
                <button
                  type="button"
                  onClick={() => setIsPublic((v) => !v)}
                  className="shrink-0 mt-0.5 w-10 h-6 rounded-full transition-all relative"
                  style={{ background: isPublic ? GOLD : "#d1d5db" }}
                  aria-checked={isPublic}
                  role="switch"
                >
                  <span
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all"
                    style={{ left: isPublic ? "calc(100% - 20px)" : "4px" }}
                  />
                </button>
                <div>
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>
                    {isPublic ? "Share on Prayer Wall" : "Keep Private"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isPublic
                      ? "Your request will be visible so others can pray with you."
                      : "Only the site admin will see this — it won't appear publicly."}
                  </p>
                </div>
              </div>

              {/* Error */}
              {formError && (
                <p className="text-sm text-red-500 rounded-lg px-4 py-2.5 bg-red-50 border border-red-200">
                  {formError}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting || message.trim().length < 10}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition"
                style={{
                  background: submitting || message.trim().length < 10 ? "#d1d5db" : GOLD,
                  cursor: submitting || message.trim().length < 10 ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Submitting…" : "🙏 Submit Prayer Request"}
              </button>

              <p className="text-center text-xs text-gray-400">
                All prayer requests are treated with care and respect.
              </p>
            </form>
          )}
        </section>

        {/* ── Public Prayer Wall ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold" style={{ color: NAVY }}>Community Prayer Wall</h2>
            {!loading && requests.length > 0 && (
              <span className="text-xs text-gray-400">
                {requests.length} {requests.length === 1 ? "request" : "requests"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border p-5 animate-pulse bg-white" style={{ borderColor: BORDER }}>
                  <div className="h-4 bg-gray-100 rounded w-1/3 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-4/5 mb-4" />
                  <div className="h-8 bg-gray-100 rounded w-32" />
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div
              className="rounded-2xl border border-dashed p-12 text-center bg-white"
              style={{ borderColor: BORDER }}
            >
              <div className="text-4xl mb-3">🕊️</div>
              <p className="text-sm font-medium" style={{ color: NAVY }}>No public prayer requests yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to share a prayer request above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((r) => (
                <PrayerCard
                  key={r.id}
                  request={r}
                  hasPrayed={prayedSet.has(r.id)}
                  onPray={handlePray}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Daily devotional signup ── */}
        <DevotionalSignup variant="compact" />

        {/* Footer scripture */}
        <div className="text-center pb-6">
          <p className="text-xs italic text-gray-400">
            "Again I say to you, if two of you agree on earth about anything they ask,
            it will be done for them by my Father in heaven." — Matthew 18:19
          </p>
        </div>
      </div>
    </main>
  );
}
