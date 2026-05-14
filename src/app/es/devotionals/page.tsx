import type { Metadata } from "next";
import Link from "next/link";
import { DEVOTIONALS_ES } from "@/data/devotionals-es";
import DevotionalSignupES from "@/components/DevotionalSignupES";
import TodayDevotionalES from "@/components/TodayDevotionalES";

// Always render server-side so "today's" devotional reflects the actual current date
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Devocionales Diarios | Scripture Lives",
  description:
    "Devocionales bíblicos diarios en español — reflexiones, versículos y oraciones para profundizar tu caminar con Cristo.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// Rotating Unsplash photos — same pool as the English devotionals page
const CARD_PHOTOS = [
  "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=640&q=75",
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=640&q=75",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=640&q=75",
  "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=640&q=75",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=75",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640&q=75",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=640&q=75",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640&q=75",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=640&q=75",
  "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=640&q=75",
];

export default function DevotionalsESPage() {
  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

      {/* ── Language bar ── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Idioma:</span>
        <Link
          href="/devotionals"
          className="px-3 py-1 rounded-full text-xs font-black transition hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.15)", color: "white" }}
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
      <nav
        className="sticky top-0 z-10 bg-white px-5 py-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid #ede8de" }}
      >
        <Link
          href="/es"
          className="text-sm font-semibold transition hover:opacity-70"
          style={{ color: GOLD }}
        >
          ← Inicio
        </Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Devocionales</span>
      </nav>

      {/* ── Hero header ── */}
      <header
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid #ede8de" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1400&q=75"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.35)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(26,36,64,0.6) 0%, rgba(26,36,64,0.85) 100%)" }}
        />

        <div className="relative z-10 px-5 py-20 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: GOLD }} />
            <span
              className="text-[10px] font-black uppercase tracking-[0.25em]"
              style={{ color: GOLD }}
            >
              Scripture Lives
            </span>
            <div className="h-px w-10" style={{ background: GOLD }} />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Devocionales<br />
            <span style={{ color: GOLD }}>Diarios</span>
          </h1>

          <p
            className="text-base leading-relaxed max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Reflexiones originales para ayudarte a profundizar en la Palabra de Dios —
            versículos clave, meditaciones y oraciones para cada día.
          </p>

          <p className="text-sm mt-4" style={{ color: "rgba(255,255,255,0.45)" }}>
            30 devocionales · Ciclo diario rotativo
          </p>
        </div>
      </header>

      {/* ── Email signup ── */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-2">
        <DevotionalSignupES variant="banner" />
      </div>

      {/* ── Today's devotional (client component — always uses browser date) ── */}
      <TodayDevotionalES />

      {/* ── All 30 devotionals grid ── */}
      <main className="max-w-6xl mx-auto px-4 pb-16 pt-6">
        <p
          className="text-xs font-semibold mb-6 uppercase tracking-widest"
          style={{ color: "#9ca3af" }}
        >
          Los 30 devocionales
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEVOTIONALS_ES.map((dev, idx) => (
            <Link
              key={idx}
              href={`/es/devotionals/${idx + 1}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden transition hover:-translate-y-1"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #ede8de" }}
            >
              {/* Photo header */}
              <div className="relative h-40 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CARD_PHOTOS[idx % CARD_PHOTOS.length]}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                {/* Scrim */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />
                {/* Day badge over photo */}
                <span
                  className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.92)", color: GOLD }}
                >
                  Día {idx + 1}
                </span>
                {/* Icon over photo */}
                <span className="absolute top-3 right-3 text-2xl select-none">{dev.icon}</span>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-5 gap-2">
                <h2
                  className="font-bold leading-snug transition-colors group-hover:opacity-75"
                  style={{ fontSize: "0.95rem", color: NAVY }}
                >
                  {dev.title}
                </h2>
                <p className="text-xs font-semibold" style={{ color: GOLD }}>
                  {dev.reference}
                </p>
                <p className="text-xs leading-relaxed italic line-clamp-2" style={{ color: "#6b7280" }}>
                  "{dev.verse}"
                </p>

                {/* Footer */}
                <div
                  className="mt-auto pt-3 flex items-center justify-between"
                  style={{ borderTop: "1px solid #f0ece3" }}
                >
                  <span className="text-xs" style={{ color: "#9ca3af" }}>Devocional</span>
                  <span className="text-xs font-bold transition-opacity group-hover:opacity-60" style={{ color: GOLD }}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="bg-white px-5 py-8 text-center mt-4"
        style={{ borderTop: "1px solid #ede8de" }}
      >
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Devocionales originales por{" "}
          <span className="font-bold" style={{ color: GOLD }}>Scripture Lives</span>
        </p>
        <Link
          href="/bible"
          className="mt-2 inline-block text-sm font-bold hover:opacity-70 transition"
          style={{ color: NAVY }}
        >
          ← Volver al Lector Bíblico
        </Link>
      </footer>
    </div>
  );
}

