"use client";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const EPISODE_URL = "https://echotvstudios.com/#/player/69572/800299";
const SITE_URL    = "https://echotvstudios.com";

export default function EchoTVCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-5"
      style={{ border: "1px solid #e8d5b0", boxShadow: "0 4px 20px rgba(201,149,42,0.10)" }}
    >
      {/* ── Header ── */}
      <div className="relative overflow-hidden px-5 py-4 flex items-center justify-between" style={{ minHeight: "72px" }}>
        {/* Banner photo as full-bleed background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/goneechotvbanner.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ objectPosition: "center center" }}
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,16,30,0.82) 0%, rgba(10,16,30,0.55) 60%, rgba(10,16,30,0.72) 100%)" }} />

        {/* Logo + label */}
        <div className="relative z-10 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/echotvlogo.png"
            alt="Echo TV Studios logo"
            className="h-9 w-auto object-contain shrink-0"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Featured Ministry</p>
            <p className="text-sm font-black text-white leading-tight">Echo TV Studios</p>
          </div>
        </div>

        {/* Visit site button */}
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          Visit site
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>

      {/* ── Video preview card ── */}
      <div className="bg-white px-5 py-5">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>
          Echo TV Studios is a Christian television and video ministry dedicated to sharing the Gospel through powerful media. Watch inspiring messages, worship, and teachings — all rooted in God&apos;s Word.
        </p>

        {/* Clickable thumbnail → opens episode in new tab */}
        <a
          href={EPISODE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden mb-4 group"
          style={{ textDecoration: "none" }}
        >
          <div
            className="relative flex flex-col items-center justify-center"
            style={{
              background: `linear-gradient(150deg, #0d1a2e 0%, #1a2e50 50%, #0d1a2e 100%)`,
              aspectRatio: "16/9",
            }}
          >
            {/* Subtle star field dots */}
            {[
              [12,18],[88,14],[25,72],[70,65],[45,88],[92,50],[6,45],[80,30],
              [55,10],[35,55],[65,80],[18,35],[95,78],[50,40],
            ].map(([x,y], i) => (
              <div key={i} className="absolute rounded-full"
                style={{ left:`${x}%`, top:`${y}%`, width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1, background:"rgba(255,255,255,0.35)" }} />
            ))}

            {/* Gold radial glow */}
            <div className="absolute inset-0 opacity-25"
              style={{ background: `radial-gradient(ellipse at 50% 55%, ${GOLD} 0%, transparent 65%)` }} />

            {/* Cross shape */}
            <div className="absolute opacity-[0.07]" aria-hidden="true">
              <svg width="220" height="220" viewBox="0 0 100 100" fill="white">
                <rect x="43" y="4"  width="14" height="92" rx="5"/>
                <rect x="4"  y="33" width="92" height="14" rx="5"/>
              </svg>
            </div>

            {/* Branding block */}
            <div className="relative z-10 flex flex-col items-center gap-2 px-6 text-center">
              {/* Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/echotvlogo.png"
                alt="Echo TV Studios"
                className="mb-1 object-contain"
                style={{ height: "36px", width: "auto", filter: "brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(5deg)" }}
              />

              {/* Logo text */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-0.5" style={{ color: GOLD }}>
                  Echo TV Studios
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <div className="h-px w-10" style={{ background: "rgba(201,149,42,0.4)" }} />
                  <p className="text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Christian Television
                  </p>
                  <div className="h-px w-10" style={{ background: "rgba(201,149,42,0.4)" }} />
                </div>
              </div>

              {/* Play button */}
              <div className="mt-2 w-12 h-12 rounded-full flex items-center justify-center transition group-hover:scale-110"
                style={{ background: GOLD, boxShadow: "0 4px 20px rgba(201,149,42,0.55)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "2px" }}>
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center justify-between"
              style={{ background: "linear-gradient(to top, rgba(8,14,26,0.90) 0%, transparent 100%)" }}>
              <span className="text-[10px] font-black text-white tracking-wide">Featured Episode</span>
              <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: GOLD }}>Watch Now →</span>
            </div>
          </div>
        </a>

        {/* CTA button */}
        <a
          href={EPISODE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition hover:brightness-110"
          style={{ background: GOLD, boxShadow: "0 4px 16px rgba(201,149,42,0.35)", textDecoration: "none" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Watch on Echo TV Studios
        </a>

        {/* Footer */}
        <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid #f0ece3" }}>
          <span className="text-xs" style={{ color: "#9ca3af" }}>Christian Television &amp; Video Ministry</span>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold transition hover:opacity-70"
            style={{ color: GOLD }}
          >
            echotvstudios.com →
          </a>
        </div>
      </div>
    </div>
  );
}
