"use client";

import { useState } from "react";

const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";
const BORDER = "#ede8de";

type Props = {
  variant?: "banner" | "compact";
};

export default function DevotionalSignupES({ variant = "banner" }: Props) {
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      const res  = await fetch("/api/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), name: name.trim(), language: "es" }),
      });
      const data = await res.json();
      if (data.alreadySubscribed) { setStatus("duplicate"); return; }
      if (!res.ok) { setErrMsg(data.error ?? "Algo salió mal."); setStatus("error"); return; }
      setStatus("success");
    } catch {
      setErrMsg("Error de red. Inténtalo de nuevo.");
      setStatus("error");
    }
  };

  // ── Success ───────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: `${GOLD}55`, background: "#fdf6e8" }}
      >
        <p className="text-2xl mb-2">🎉</p>
        <p className="font-bold text-base mb-1" style={{ color: NAVY }}>¡Estás suscrito!</p>
        <p className="text-sm text-gray-500">
          Revisa tu correo para el mensaje de bienvenida. Tu primer devocional está en camino.
        </p>
      </div>
    );
  }

  // ── Duplicate ─────────────────────────────────────────────────────────────────
  if (status === "duplicate") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{ borderColor: BORDER, background: CREAM }}
      >
        <p className="text-2xl mb-2">✅</p>
        <p className="font-bold text-base mb-1" style={{ color: NAVY }}>¡Ya estás suscrito!</p>
        <p className="text-sm text-gray-500">
          Ya estás en la lista — los devocionales seguirán llegando a tu correo.
        </p>
      </div>
    );
  }

  // ── Banner variant ────────────────────────────────────────────────────────────
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
              📖 Recibe Devocionales Diarios en Tu Correo
            </p>
            <p className="text-sm mt-1" style={{ color: "#a8bbd0" }}>
              Un versículo, una reflexión y una oración — cada mañana, gratis.
            </p>
          </div>
          <span
            className="shrink-0 self-start sm:self-auto text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: `${GOLD}33`, color: GOLD }}
          >
            Gratis
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 bg-white flex flex-col sm:flex-row gap-3 items-start sm:items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>
              Nombre <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              maxLength={80}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition"
              style={{ borderColor: BORDER, color: NAVY }}
              onFocus={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`; }}
              onBlur={(e)  => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
          <div className="flex-[2] w-full">
            <label className="block text-xs font-semibold mb-1" style={{ color: NAVY }}>
              Correo electrónico <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
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
            {status === "loading" ? "Suscribiendo…" : "Suscribirme →"}
          </button>
        </form>

        {status === "error" && (
          <p className="px-6 pb-4 text-xs text-red-500">{errMsg}</p>
        )}

        <p className="px-6 pb-4 text-xs text-gray-400 bg-white">
          Sin spam, nunca. Cancela cuando quieras.
        </p>
      </div>
    );
  }

  // ── Compact variant ───────────────────────────────────────────────────────────
  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: BORDER, background: "#ffffff" }}
    >
      <div className="flex items-start gap-3 mb-4">
        <span className="text-xl shrink-0">📖</span>
        <div>
          <p className="text-sm font-bold" style={{ color: NAVY }}>
            Recibe Devocionales Diarios
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Un versículo y reflexión en tu correo cada mañana — gratis.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
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
          {status === "loading" ? "Suscribiendo…" : "Suscribirme a los Devocionales Diarios →"}
        </button>
        {status === "error" && (
          <p className="text-xs text-red-500">{errMsg}</p>
        )}
        <p className="text-xs text-gray-400 text-center">Sin spam, nunca. Cancela cuando quieras.</p>
      </form>
    </div>
  );
}
