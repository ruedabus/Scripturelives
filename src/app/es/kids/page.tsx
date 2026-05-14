import type { Metadata } from "next";
import Link from "next/link";
import ThemeSongPlayer from "@/components/ThemeSongPlayer";
import BiblePuzzle from "@/components/BiblePuzzle";

export const metadata: Metadata = {
  title: "Faith Tails Niños | Scripture Lives",
  description:
    "Faith Tails — ¡historias de aventura llenas de fe para niños! Acompaña a Mav y Moony mientras descubren la Biblia a través de emocionantes aventuras. Mira en YouTube y lee ebooks gratis.",
};

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";

// ── Book library data (Spanish) ────────────────────────────────────────────────
const BOOKS = [
  {
    slug:        "moon-adventure",
    title:       "Misión Piedra Lunar",
    subtitle:    "Mav, Moony y el Gigante de la Luna",
    description: "Cuando un gigante alienígena amenaza la luna, el miembro más pequeño de la tripulación — Moony — debe salvar el día. Basado en la historia de David y Goliat.",
    scripture:   "1 Samuel 17:37",
    ages:        "Edades 10–12",
    pages:       "10 páginas",
    theme:       "Valentía y Fe",
    coverEmoji:  "🚀",
    coverImage:  "/ebook1-thumbnail.png",
    coverBg:     "linear-gradient(135deg, #0f1f3d 0%, #1a3a6b 50%, #2d5a9e 100%)",
    accentColor: "#60a5fa",
    downloadUrl: "/books/mav-moony-moon-adventure.pdf",
    badge:       "NUEVO",
  },
  {
    slug:        "lions-den",
    title:       "Mav, Moony y el Foso de los Leones",
    subtitle:    "Firmes en la Fe — Basado en Daniel 6",
    description: "Cuando el Abuelo Martínez es lanzado al foso de los leones por negarse a dejar de orar, Mav y Moony deben confiar en Dios — incluso cuando todo parece imposible. Una historia de valentía, oración y fe inquebrantable.",
    scripture:   "Daniel 6:22",
    ages:        "Edades 4–12",
    pages:       "15 páginas",
    theme:       "Valentía y Oración",
    coverEmoji:  "🦁",
    coverImage:  "/ebook2-thumbnail.png",
    coverBg:     "linear-gradient(135deg, #1a2640 0%, #3d2010 60%, #5c3010 100%)",
    accentColor: "#C9952A",
    downloadUrl: "/books/mav-moony-lions-den-ebook.pdf",
    badge:       "NUEVO",
  },
];

// ── YouTube ────────────────────────────────────────────────────────────────────
const FEATURED_VIDEO_ID = "";
const CHANNEL_URL    = "https://www.youtube.com/@FaithTails";
const CHANNEL_HANDLE = "@FaithTails";

// ── Book card ──────────────────────────────────────────────────────────────────
function BookCard({ book }: { book: (typeof BOOKS)[number] }) {
  const isComingSoon = !book.downloadUrl;

  return (
    <div
      className="flex flex-col rounded-3xl overflow-hidden transition hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        border: "1px solid rgba(201,149,42,0.2)",
        background: "#fff",
      }}
    >
      {/* Cover */}
      <div
        className="relative flex flex-col items-center justify-center overflow-hidden"
        style={{ background: book.coverBg, height: book.coverImage ? 280 : 220, padding: book.coverImage ? 0 : "2rem 1.5rem" }}
      >
        {book.badge && (
          <span
            className="absolute top-3 right-3 z-10 text-xs font-black px-2 py-1 rounded-full"
            style={{
              background: book.badge === "NUEVO" ? "#22c55e" : "rgba(255,255,255,0.2)",
              color: book.badge === "NUEVO" ? "#fff" : "rgba(255,255,255,0.8)",
              letterSpacing: "0.08em",
            }}
          >
            {book.badge}
          </span>
        )}

        {book.coverImage ? (
          <div className="relative w-full h-full">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full"
              style={{ objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
            {!book.downloadUrl && (
              <div
                className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center py-3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)" }}
              >
                <span className="text-white font-black text-sm tracking-wide">Próximamente</span>
                <span className="text-xs font-semibold mt-0.5" style={{ color: GOLD }}>Mayo 15, 2026</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <span style={{ fontSize: 72, lineHeight: 1 }}>{book.coverEmoji}</span>
            <h3 className="text-center font-black mt-3 text-xl leading-tight" style={{ color: book.accentColor }}>
              {book.title}
            </h3>
            <p className="text-center text-sm mt-1" style={{ color: "rgba(255,255,255,0.75)" }}>
              {book.subtitle}
            </p>
          </>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex flex-wrap gap-2">
          {book.ages && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(201,149,42,0.12)", color: "#92400e" }}>
              {book.ages}
            </span>
          )}
          {book.theme && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.1)", color: "#1e40af" }}>
              {book.theme}
            </span>
          )}
          {book.pages && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: "#065f46" }}>
              {book.pages}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{book.description}</p>

        {book.scripture && (
          <p className="text-xs italic font-medium" style={{ color: GOLD }}>📖 {book.scripture}</p>
        )}

        <div className="mt-auto pt-2">
          {isComingSoon ? (
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition hover:opacity-80"
              style={{ background: "rgba(201,149,42,0.12)", color: GOLD }}
            >
              <span>🔔</span> Suscríbete para recibir notificaciones
            </a>
          ) : (
            <div className="flex gap-2">
              <a
                href={book.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #e6a830)` }}
              >
                <span>📖</span> Leer
              </a>
              <a
                href={book.downloadUrl}
                download
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition hover:opacity-90 active:scale-95"
                style={{ background: "rgba(201,149,42,0.1)", color: GOLD, border: `1px solid rgba(201,149,42,0.35)` }}
                title="Descargar eBook"
              >
                <span>📥</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function KidsPageES() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 shrink-0"
        style={{
          background: "rgba(250,248,243,0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #ede8de",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold transition hover:opacity-70"
          style={{ color: NAVY }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Scripture Lives
        </Link>

        <div className="flex items-center gap-2">
          <span style={{ fontSize: 18 }}>🐾</span>
          <span className="text-sm font-black" style={{ color: NAVY }}>Faith Tails Niños</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <Link
            href="/kids"
            className="text-xs font-bold px-2.5 py-1.5 rounded-full border transition hover:opacity-80"
            style={{ borderColor: "rgba(201,149,42,0.5)", color: GOLD }}
          >
            🇺🇸 EN
          </Link>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full text-white transition hover:opacity-80"
            style={{ background: "#ff0000" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>
              <polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98"/>
            </svg>
            Suscribirse
          </a>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${NAVY} 0%, #0f3460 50%, #162447 100%)`,
          padding: "4rem 1.5rem 5rem",
        }}
      >
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              background: "rgba(255,255,255,0.6)",
              top: `${(i * 37) % 80}%`,
              left: `${(i * 53) % 95}%`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-4">
          <img
            src="/FT_logo.png"
            alt="Faith Tails logo"
            style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 20 }}
          />

          <div>
            <h1 className="text-4xl font-black text-white" style={{ letterSpacing: "-0.02em" }}>
              Faith Tails
            </h1>
            <p className="text-lg font-semibold mt-1" style={{ color: GOLD }}>
              Historias de Aventura para Niños
            </p>
          </div>

          <p className="text-base leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.75)" }}>
            Acompaña a <strong style={{ color: "white" }}>Mav</strong> el Bullmastiff de gran corazón y
            {" "}<strong style={{ color: "white" }}>Moony</strong> el sabio Dachshund en aventuras llenas
            de fe inspiradas en historias reales de la Biblia. ¡Mira en YouTube y lee gratis abajo!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white transition hover:opacity-90 active:scale-95"
              style={{ background: "#ff0000" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8z"/>
                <polygon fill="white" points="9.75,15.02 15.5,12 9.75,8.98"/>
              </svg>
              Ver en YouTube
            </a>
            <a
              href="#books"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              📚 Leer eBooks Gratis
            </a>
          </div>
        </div>
      </section>

      {/* ── Theme Song Player ─────────────────────────────────────────────────── */}
      <div style={{ background: NAVY, marginTop: -1 }}>
        <ThemeSongPlayer />
      </div>

      {/* ── YouTube Feature ───────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto w-full px-4 py-12">
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <span style={{ fontSize: 32 }}>📺</span>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Ver Faith Tails</h2>
          <p className="text-sm" style={{ color: "#6b7280" }}>
            Nuevas aventuras cada semana en nuestro canal de YouTube
          </p>
        </div>

        {FEATURED_VIDEO_ID ? (
          <div className="rounded-2xl overflow-hidden w-full" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.15)", aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${FEATURED_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Faith Tails — Video Destacado"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: 0, display: "block" }}
            />
          </div>
        ) : (
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block rounded-2xl overflow-hidden transition hover:opacity-90 group"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.2)", textDecoration: "none" }}
          >
            <img
              src="/FT-poster.png"
              alt="Faith Tails — Ver en YouTube"
              className="w-full block"
              style={{ display: "block", maxHeight: 420, objectFit: "cover", objectPosition: "center top" }}
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,0.45)" }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width: 72, height: 72, background: "#ff0000", boxShadow: "0 4px 24px rgba(255,0,0,0.5)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                  <polygon points="9.75,15.02 15.5,12 9.75,8.98" />
                </svg>
              </div>
              <span className="text-white font-bold text-sm px-5 py-2 rounded-xl" style={{ background: "#ff0000" }}>
                Visitar Nuestro Canal →
              </span>
            </div>
          </a>
        )}

        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-6 py-4 px-6 rounded-2xl"
          style={{ background: "rgba(201,149,42,0.08)", border: "1px solid rgba(201,149,42,0.2)" }}
        >
          {[
            { icon: "🎬", label: "Nuevos episodios cada semana" },
            { icon: "📖", label: "Basado en historias reales de la Biblia" },
            { icon: "🐾", label: "Aventuras de Mav y Moony" },
            { icon: "✝️", label: "Mensajes de fe para niños" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span className="text-sm font-semibold" style={{ color: NAVY }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story Library ─────────────────────────────────────────────────────── */}
      <section id="books" className="max-w-4xl mx-auto w-full px-4 pb-16">
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <span style={{ fontSize: 32 }}>📚</span>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>eBooks Gratis</h2>
          <p className="text-sm max-w-md" style={{ color: "#6b7280" }}>
            Descarga y lee las aventuras de Mav y Moony — completamente gratis. Cada historia está
            inspirada en un relato bíblico y está llena de risas, corazón y fe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {BOOKS.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      </section>

      {/* ── Puzzle Game ───────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto w-full px-4 pb-16">
        <div className="flex flex-col items-center gap-2 text-center mb-6">
          <span style={{ fontSize: 32 }}>🧩</span>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Rompecabezas de Mav y Moony</h2>
          <p className="text-sm max-w-sm" style={{ color: "#6b7280" }}>
            ¡Arma el rompecabezas! Elige una imagen, selecciona tu dificultad y resuélvelo pieza por pieza.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: "1px solid rgba(201,149,42,0.15)" }}>
          <BiblePuzzle />
        </div>
      </section>

      {/* ── Faith Message Banner ──────────────────────────────────────────────── */}
      <section className="py-10 px-4" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #e6a830 100%)` }}>
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-3">
          <span style={{ fontSize: 36 }}>✝️</span>
          <h3 className="text-xl font-black text-white">Cada Aventura Apunta a Jesús</h3>
          <p className="text-sm leading-relaxed text-white" style={{ opacity: 0.9 }}>
            Las historias de Faith Tails están basadas en las Escrituras reales. Cada aventura cuenta
            una historia bíblica de una manera que los niños pueden entender — gran valentía, pequeños
            héroes y un Dios que siempre está con nosotros.
          </p>
          <a
            href="/"
            className="mt-2 px-6 py-3 rounded-xl font-bold text-sm transition hover:opacity-90"
            style={{ background: NAVY, color: "white" }}
          >
            Explorar la Biblia en Scripture Lives →
          </a>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 text-center text-xs" style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}>
        <p>
          Faith Tails es parte de{" "}
          <Link href="/" className="underline hover:opacity-70" style={{ color: GOLD }}>
            Scripture Lives
          </Link>
          {" "}— un recurso bíblico gratuito para todos.{" "}
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-70"
            style={{ color: GOLD }}
          >
            {CHANNEL_HANDLE}
          </a>
        </p>
        <p className="mt-3" style={{ color: "#c0b89a", fontSize: "0.65rem", letterSpacing: "0.04em" }}>
          © 2026 Faith Tails. Mav y Moony son personajes originales de Faith Tails. Todos los derechos reservados.
          <br />
          La reproducción o uso no autorizado de los personajes, historias o música de Faith Tails está prohibido.{" "}
          <a href="mailto:info@scripturelives.com" className="underline hover:opacity-70" style={{ color: GOLD }}>
            info@scripturelives.com
          </a>
        </p>
      </footer>

    </div>
  );
}
