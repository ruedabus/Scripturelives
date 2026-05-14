import type { Metadata } from "next";
import Link from "next/link";
import { DEVOTIONALS_ES } from "@/data/devotionals-es";

export const metadata: Metadata = {
  title: "Devocionales Diarios | Scripture Lives",
  description:
    "Devocionales bíblicos diarios en español — reflexiones, versículos y oraciones para profundizar tu caminar con Cristo.",
};

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// Category labels mapped from devotional themes
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  default: { bg: "rgba(201,149,42,0.15)", text: "#92400e" },
};

export default function DevotionalsESPage() {
  return (
    <div className="min-h-screen" style={{ background: "#faf8f3" }}>

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
        <div className="ml-auto">
          <Link
            href="/devotionals"
            className="text-xs font-bold px-3 py-1.5 rounded-full border transition hover:opacity-80"
            style={{ borderColor: "rgba(201,149,42,0.5)", color: GOLD }}
          >
            🇺🇸 English
          </Link>
        </div>
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

      {/* ── Today's devotional highlight ── */}
      <TodayHighlight />

      {/* ── All 30 devotionals grid ── */}
      <main className="max-w-6xl mx-auto px-4 pb-16 pt-6">
        <p
          className="text-xs font-semibold mb-6 uppercase tracking-widest"
          style={{ color: "#9ca3af" }}
        >
          Los 30 devocionales
        </p>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEVOTIONALS_ES.map((dev, idx) => (
            <Link
              key={idx}
              href={`/es/devotionals/${idx + 1}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden transition hover:-translate-y-1"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)", border: "1px solid #ede8de" }}
            >
              {/* Color banner */}
              <div
                className="h-2 w-full"
                style={{ background: `linear-gradient(90deg, ${GOLD}, ${NAVY})` }}
              />

              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Icon + day */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{dev.icon}</span>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(201,149,42,0.12)", color: "#92400e" }}
                  >
                    Día {idx + 1}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="font-bold leading-snug transition-colors group-hover:opacity-75"
                  style={{ fontSize: "0.95rem", color: NAVY }}
                >
                  {dev.title}
                </h2>

                {/* Reference */}
                <p className="text-xs font-semibold" style={{ color: GOLD }}>
                  {dev.reference}
                </p>

                {/* Verse snippet */}
                <p
                  className="text-xs leading-relaxed italic line-clamp-2"
                  style={{ color: "#6b7280" }}
                >
                  "{dev.verse}"
                </p>

                {/* Footer */}
                <div
                  className="mt-auto pt-3 flex items-center justify-end"
                  style={{ borderTop: "1px solid #f0ece3" }}
                >
                  <span
                    className="text-xs font-bold transition-opacity group-hover:opacity-60"
                    style={{ color: GOLD }}
                  >
                    Leer →
                  </span>
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
          href="/"
          className="mt-2 inline-block text-sm font-bold hover:opacity-70 transition"
          style={{ color: NAVY }}
        >
          ← Volver al Lector Bíblico
        </Link>
      </footer>
    </div>
  );
}

// ── Today's highlight (server component, day calculated at render) ─────────────
function TodayHighlight() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  const idx = ((dayOfYear - 1) % DEVOTIONALS_ES.length + DEVOTIONALS_ES.length) % DEVOTIONALS_ES.length;
  const today = DEVOTIONALS_ES[idx];
  const dayNum = idx + 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <p
        className="text-[10px] font-black uppercase tracking-widest mb-4 text-center"
        style={{ color: GOLD }}
      >
        ✦ Devocional de Hoy
      </p>
      <Link
        href={`/es/devotionals/${dayNum}`}
        className="group grid md:grid-cols-[auto_1fr] rounded-2xl overflow-hidden transition hover:-translate-y-0.5"
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          border: "1px solid #ede8de",
          background: "white",
        }}
      >
        {/* Icon panel */}
        <div
          className="flex items-center justify-center p-8 text-6xl"
          style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 100%)` }}
        >
          {today.icon}
        </div>

        {/* Text */}
        <div className="p-6 flex flex-col justify-center gap-3">
          <span
            className="self-start text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgba(201,149,42,0.12)", color: "#92400e" }}
          >
            Día {dayNum} · Devocional
          </span>
          <h2
            className="text-xl font-black leading-snug group-hover:opacity-75 transition"
            style={{ color: NAVY }}
          >
            {today.title}
          </h2>
          <p className="text-xs italic leading-relaxed line-clamp-2" style={{ color: "#6b7280" }}>
            "{today.verse}"
          </p>
          <p className="text-xs font-bold" style={{ color: GOLD }}>{today.reference}</p>
          <div
            className="flex items-center gap-4 mt-1 pt-4"
            style={{ borderTop: "1px solid #f0ece3" }}
          >
            <span className="text-sm font-bold" style={{ color: GOLD }}>
              Leer devoción de hoy →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
