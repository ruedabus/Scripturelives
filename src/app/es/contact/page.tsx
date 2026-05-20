"use client";

import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function ContactPageES() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errMsg,  setErrMsg]  = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      const res  = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al enviar");
      setStatus("sent");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Algo salió mal. Por favor intenta de nuevo.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3" }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Idioma:</span>
        <Link
          href="/contact"
          className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }}
        >
          🇺🇸 English
        </Link>
        <span
          className="px-3 py-1 rounded-full text-xs font-black"
          style={{ background: GOLD, color: NAVY }}
        >
          🇪🇸 Español
        </span>
      </div>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/es" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>← Inicio</Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Contáctanos</span>
      </nav>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden text-center" style={{ background: NAVY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bible-hero.jpg" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.08 }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,38,64,0.5) 0%, #faf8f3 100%)" }} />
        <div className="relative z-10 px-4 pt-12 pb-20 max-w-lg mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Contácta<span style={{ color: GOLD }}>nos</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Preguntas, peticiones de oración o simplemente quieres saludar — nos encantaría escucharte.
          </p>
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 -mt-6">
        <div className="w-full max-w-md">
          {status === "sent" ? (
            <div
              className="rounded-2xl bg-white px-8 py-10 text-center"
              style={{ border: "1px solid #ede8de", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
            >
              <div className="text-5xl mb-4">🙏</div>
              <h2 className="text-xl font-black mb-2" style={{ color: NAVY }}>¡Mensaje recibido!</h2>
              <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
                Gracias por comunicarte. Te responderemos a <strong>{email}</strong> lo antes posible.
              </p>
              <Link
                href="/es"
                className="inline-block px-6 py-3 rounded-xl font-black text-sm transition hover:brightness-110"
                style={{ background: GOLD, color: NAVY }}
              >
                ← Volver a Scripture Lives
              </Link>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-2xl bg-white px-8 py-8 flex flex-col gap-5"
              style={{ border: "1px solid #ede8de", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
            >

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>
                  Tu Nombre
                </label>
                <input
                  required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Juan García"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>
                  Correo Electrónico
                </label>
                <input
                  required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>
                  Tu Mensaje
                </label>
                <textarea
                  required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje aquí…"
                  className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }}
                />
              </div>

              {status === "error" && (
                <p className="text-sm font-semibold" style={{ color: "#ef4444" }}>{errMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3.5 rounded-xl font-black text-sm transition hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: GOLD, color: NAVY }}
              >
                {status === "sending" ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Enviando…
                  </>
                ) : "Enviar Mensaje"}
              </button>

              <p className="text-center text-xs" style={{ color: "#9ca3af" }}>
                O escríbenos directamente a{" "}
                <a href="mailto:info@scripturelives.com" className="font-semibold transition hover:opacity-70" style={{ color: GOLD }}>
                  info@scripturelives.com
                </a>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="bg-white px-5 py-6 text-center" style={{ borderTop: "1px solid #ede8de" }}>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span> · info@scripturelives.com
        </p>
      </footer>
    </div>
  );
}
