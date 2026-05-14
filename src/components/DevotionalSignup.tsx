"use client";

import { useState } from "react";

const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";
const BORDER = "#ede8de";

type Props = {
  /** "banner" — full-width rich card (devotionals page top) */
  /** "compact" — smaller inline strip (prayer wall bottom)   */
  variant?: "banner" | "compact";
};

export default function DevotionalSignup({ variant = "banner" }: Props) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [language, setLang]   = useState<"en" | "es">("en");
  const [status, setStatus]   = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errMsg, setErrMsg]   = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res  = await fetch("/api/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), name: name.trim(), language }),
      });
      const data = await res.json();
      if (data.alreadySubscribed) { setStatus("duplicate"); return; }
      if (!res.ok) { setErrMsg(data.error ?? "Something went wrong."); setStatus("error"); return; }
      setStatus("success");
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  // ── Success state (shared) ────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: `${GOLD}55`, background: "#fdf6e8" }}
      >
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-bold text-base mb-1" style={{ color: NAVY }}>You're subscribed!</p>
        <p className="text-sm text-gray-500">
          Check your inbox for a welcome email. Your first {language === "es" ? "Spanish" : "English"} devotional is on its way.
        </p>
      </div>
    );
  }

  // ── Duplicate state ───────────────────────────────────────────────────────
  if (status === "duplicate") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: BORDER, background: CREAM }}
      >
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-base mb-1" style={{ color: NAVY }}>Already subscribed!</p>
        <p className="text-sm text-gray-500">
          You're already on the list — devotionals will keep arriving in your inbox.
        </p>
      </div>
    );
  }

  // ── Banner variant ────────────────────────────────────────────────────────
  if (variant === "banner") {
    return (
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: BORDER }}
      >
        {/* Top strip */}
        <div
          className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{ background: NAVY }}
        >
          <div className="flex-1">
            <p className="text-white font-bold text-lg leading-snug">
              📖 Get Daily Devotionals in Your Inbox
            </p>
            <p className="text-sm mt-1" style={{ color: "#a8bbd0" }}>
              A verse, a reflection, and a prayer — delivered every morning, free.
            </p>
          </div>
          {/* Language toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setLang("en")}
              className="px-3 py-1 rounded-full text-xs font-black transition"
              style={{
                background: language === "en" ? "white" : "rgba(255,255,255,0.15)",
                color:      language === "en" ? NAVY    : "rgba(255,255,255,0.7)",
              }}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              onClick={() => setLang("es")}
              className="px-3 py-1 rounded-full text-xs font-black transition"
              style={{
                background: language === "es" ? GOLD                    : "rgba(255,255,255,0.15)",
                color:      language === "es" ? NAVY                    : "rgba(255,255,255,0.7)",
              }}
            >
              🇪🇸 ES
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 bg-white flex flex-col sm:flex-row gap-3 items-start sm:items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>
              Name <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition"
              style={{ borderColor: BORDER, color: NAVY }}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>
              Email address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              maxLength={254}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition"
              style={{ borderColor: BORDER, color: NAVY }}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || !email.trim()}
            className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition whitespace-nowrap"
            style={{
              background: status === "loading" || !email.trim() ? "#d1d5db" : GOLD,
              cursor: status === "loading" || !email.trim() ? "not-allowed" : "pointer",
            }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe →"}
          </button>
        </form>

        {status === "error" && (
          <p className="px-6 pb-4 text-xs text-red-500">{errMsg}</p>
        )}

        <p className="px-6 pb-4 text-xs text-gray-400 bg-white">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  // ── Compact variant (prayer wall) ─────────────────────────────────────────
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: BORDER, background: "#ffffff" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-xl shrink-0">📖</span>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: NAVY }}>
            Get Daily Devotionals
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            A verse and reflection delivered to your inbox every morning — free.
          </p>
        </div>
        {/* Language toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setLang("en")}
            className="px-2.5 py-1 rounded-full text-[10px] font-black transition"
            style={{
              background: language === "en" ? NAVY                    : "rgba(0,0,0,0.07)",
              color:      language === "en" ? "white"                 : "#9ca3af",
            }}
          >
            🇺🇸 EN
          </button>
          <button
            type="button"
            onClick={() => setLang("es")}
            className="px-2.5 py-1 rounded-full text-[10px] font-black transition"
            style={{
              background: language === "es" ? GOLD   : "rgba(0,0,0,0.07)",
              color:      language === "es" ? NAVY   : "#9ca3af",
            }}
          >
            🇪🇸 ES
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          maxLength={254}
          className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition"
          style={{ borderColor: BORDER, color: NAVY }}
          onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
          onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
        />
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition"
          style={{
            background: status === "loading" || !email.trim() ? "#d1d5db" : GOLD,
            cursor: status === "loading" || !email.trim() ? "not-allowed" : "pointer",
          }}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe to Daily Devotionals →"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-500">{errMsg}</p>
        )}
        <p className="text-xs text-gray-400 text-center">No spam, ever. Unsubscribe anytime.</p>
      </form>
    </div>
  );
}
