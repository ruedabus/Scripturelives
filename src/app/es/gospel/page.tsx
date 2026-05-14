"use client";

import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function GospelPageES() {
  const [prayed, setPrayed] = useState(false);

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: "#f9f7f2", fontFamily: "Georgia, serif" }}
    >
      {/* ── Language bar ──────────────────────────────────────────────────── */}
      <div
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.3)` }}
      >
        <span style={{ color: "rgba(255,255,255,0.6)" }}>🌐 Idioma:</span>
        <Link
          href="/gospel"
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

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-16 text-center"
        style={{
          background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)`,
        }}
      >
        {/* Cross icon */}
        <div className="mb-6 text-6xl select-none">✝</div>

        <h1
          className="text-4xl sm:text-5xl font-black leading-tight mb-4"
          style={{ color: "white", textShadow: `0 2px 20px rgba(201,149,42,0.4)` }}
        >
          La Mejor Noticia<br />
          <span style={{ color: GOLD }}>Que Jamás Escucharás</span>
        </h1>

        <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.85)" }}>
          Alguien con una camiseta te envió aquí. Eso no fue un accidente.
        </p>
        <p className="text-sm max-w-md leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
          Tómate dos minutos. Este mensaje ha cambiado miles de millones de vidas — incluyendo la de la persona que acabas de conocer.
        </p>

        {/* Scroll cue */}
        <div className="mt-10 flex flex-col items-center gap-1" style={{ color: GOLD }}>
          <span className="text-xs uppercase tracking-widest font-bold">Sigue Leyendo</span>
          <span className="text-2xl animate-bounce">↓</span>
        </div>
      </section>

      {/* ── The Gospel ────────────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl px-6 py-14 flex flex-col gap-12">

        {/* Paso 1 */}
        <GospelStep
          number="1"
          title="Dios te creó y te ama."
          verse='"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna."'
          reference="Juan 3:16"
          body="No eres un accidente. Dios te hizo con un propósito, para un propósito. Su amor por ti no se basa en lo que has hecho — es parte de quién Él es."
        />

        {/* Paso 2 */}
        <GospelStep
          number="2"
          title="Todos tenemos un problema — se llama pecado."
          verse='"Por cuanto todos pecaron, y están destituidos de la gloria de Dios."'
          reference="Romanos 3:23"
          body="El pecado es simplemente elegir nuestro propio camino en lugar del camino de Dios. Todos lo hemos hecho. Y esa separación de Dios es la raíz de todo lo que está roto en nuestras vidas."
        />

        {/* Paso 3 */}
        <GospelStep
          number="3"
          title="El precio del pecado es la muerte — pero Dios lo pagó."
          verse='"Mas Dios muestra su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros."'
          reference="Romanos 5:8"
          body="Jesús — el propio Hijo de Dios — tomó el castigo que nosotros merecíamos. Murió en la cruz, fue sepultado y resucitó de entre los muertos tres días después. Eso no es mitología. Es historia — y lo cambia todo."
        />

        {/* Paso 4 */}
        <GospelStep
          number="4"
          title="Puedes recibir Su regalo ahora mismo."
          verse='"Que si confesares con tu boca que Jesús es el Señor, y creyeres en tu corazón que Dios le levantó de los muertos, serás salvo."'
          reference="Romanos 10:9"
          body="No tienes que ganártelo. No tienes que arreglarte primero. Solo tienes que creer — y recibir."
        />
      </section>

      {/* ── Prayer ────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl mx-auto px-6 pb-16">
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: NAVY,
            border: `1px solid rgba(201,149,42,0.3)`,
          }}
        >
          <div className="text-center mb-8">
            <span className="text-4xl">🙏</span>
            <h2 className="text-2xl font-black mt-4 text-white">¿Listo para Orar?</h2>
            <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.65)" }}>
              Esta es una oración sencilla. Dios escucha el corazón, no las palabras perfectas.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 mb-6 italic text-sm leading-relaxed"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.9)",
              borderLeft: `3px solid ${GOLD}`,
            }}
          >
            <p>
              "Señor Jesús, creo que eres el Hijo de Dios. Creo que moriste por mis pecados y resucitaste de entre los muertos. Me aparto de mi pecado y pongo mi confianza en Ti. Entra en mi vida, perdóname y hazme nuevo. Quiero seguirte desde este día en adelante. Amén."
            </p>
          </div>

          {!prayed ? (
            <button
              onClick={() => setPrayed(true)}
              className="w-full py-4 rounded-2xl font-black text-base sm:text-lg transition hover:opacity-90 active:scale-95"
              style={{ background: GOLD, color: NAVY }}
            >
              Oré esta oración ✝
            </button>
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-xl font-black text-white mb-2">Bienvenido a la familia.</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                Esa decisión acaba de cambiar tu eternidad. El cielo está celebrando ahora mismo (Lucas 15:7). Cuéntaselo a alguien de confianza — y sigue leyendo abajo.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Plan de 7 Días ────────────────────────────────────────────── */}
      <section className="w-full max-w-2xl px-6 pb-16">
        <div className="text-center mb-8">
          <span className="text-3xl">🗓️</span>
          <h3
            className="text-xl font-black mt-3 mb-2"
            style={{ color: NAVY }}
          >
            Tus Primeros 7 Días
          </h3>
          <p className="text-sm" style={{ color: "#7a6f60" }}>
            Acabas de tomar la decisión más importante de tu vida. Aquí tienes un plan sencillo para comenzar.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              day: 1,
              icon: "📖",
              title: "Lee Juan 1",
              desc: "Abre el Evangelio de Juan — fue escrito para que puedas conocer a Jesús personalmente. Lee solo un capítulo hoy.",
              href: "/bible",
              label: "Abrir la Biblia",
            },
            {
              day: 2,
              icon: "🙏",
              title: "Habla con Dios",
              desc: "La oración es solo una conversación — no se necesitan palabras especiales. Dile a Dios lo que tienes en el corazón.",
              href: "/es/prayer",
              label: "Muro de Oración",
            },
            {
              day: 3,
              icon: "🌅",
              title: "Comienza un Devocional",
              desc: "Suscríbete a un versículo diario, reflexión y oración enviados a tu correo cada mañana — gratis.",
              href: "/es/devotionals",
              label: "Ver Devocionales",
            },
            {
              day: 4,
              icon: "💬",
              title: "Cuéntaselo a Alguien",
              desc: "Busca una persona de confianza — un amigo, familiar o compañero — y cuéntales lo que pasó. La fe crece en comunidad.",
              href: "/es/prayer",
              label: "Compartir en el Muro",
            },
            {
              day: 5,
              icon: "⛪",
              title: "Encuentra una Iglesia",
              desc: "No estás destinado a hacer esto solo. Encuentra una iglesia bíblica cerca de ti — busca por código postal.",
              href: "/es/find-a-church",
              label: "Buscar una Iglesia",
            },
            {
              day: 6,
              icon: "📚",
              title: "Comparte con tus Hijos",
              desc: "Si tienes hijos, Faith Tails tiene hermosas historias bíblicas ilustradas que les encantarán.",
              href: "/es/kids",
              label: "Ver Cuentos para Niños",
            },
            {
              day: 7,
              icon: "🎉",
              title: "Celebra y Sigue Adelante",
              desc: "Completaste tu primera semana. El cielo está celebrando por ti (Lucas 15:7). ¡Sigue leyendo Juan — tiene 21 capítulos!",
              href: "/bible",
              label: "Seguir Leyendo",
            },
          ].map(({ day, icon, title, desc, href, label }) => (
            <div
              key={day}
              className="flex items-start gap-4 rounded-2xl p-5 bg-white"
              style={{ border: "1px solid #ede8de", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: GOLD, color: NAVY }}
              >
                {day}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{icon}</span>
                  <h4 className="font-black text-sm" style={{ color: NAVY }}>{title}</h4>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#7a6f60" }}>{desc}</p>
                <Link
                  href={href}
                  className="inline-block text-xs font-black px-3 py-1.5 rounded-xl transition hover:opacity-80"
                  style={{ background: NAVY, color: "white" }}
                >
                  {label} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="w-full py-8 px-6 text-center text-xs"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p>
          Esta página es parte de{" "}
          <Link href="/" className="underline hover:opacity-70" style={{ color: GOLD }}>
            Scripture Lives
          </Link>
          {" "}— un recurso bíblico gratuito para todos.
        </p>
        <p className="mt-2" style={{ color: "#c0b89a" }}>
          © 2026 Scripture Lives / Faith Tails &nbsp;·&nbsp; info@scripturelives.com
        </p>
      </footer>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function GospelStep({
  number,
  title,
  verse,
  reference,
  body,
}: {
  number: string;
  title: string;
  verse: string;
  reference: string;
  body: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-black text-sm"
          style={{ background: GOLD, color: NAVY }}
        >
          {number}
        </div>
        <h2 className="text-xl font-black leading-snug" style={{ color: NAVY }}>
          {title}
        </h2>
      </div>

      <blockquote
        className="rounded-2xl p-5 italic text-sm leading-relaxed"
        style={{
          background: "#fff",
          borderLeft: `4px solid ${GOLD}`,
          color: "#3a3025",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <p>{verse}</p>
        <cite
          className="block mt-2 not-italic text-xs font-bold uppercase tracking-widest"
          style={{ color: GOLD }}
        >
          {reference}
        </cite>
      </blockquote>

      <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#5a4f3e" }}>
        {body}
      </p>
    </div>
  );
}

function NextStep({
  icon,
  title,
  desc,
  href,
  label,
  external,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 text-center"
      style={{ background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <span className="text-3xl">{icon}</span>
      <h4 className="font-black text-sm" style={{ color: NAVY }}>{title}</h4>
      <p className="text-xs leading-relaxed" style={{ color: "#7a6f60" }}>{desc}</p>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto py-2 px-4 rounded-xl text-xs font-bold transition hover:opacity-90"
          style={{ background: NAVY, color: "white" }}
        >
          {label}
        </a>
      ) : (
        <Link
          href={href}
          className="mt-auto py-2 px-4 rounded-xl text-xs font-bold transition hover:opacity-90"
          style={{ background: NAVY, color: "white" }}
        >
          {label}
        </Link>
      )}
    </div>
  );
}
