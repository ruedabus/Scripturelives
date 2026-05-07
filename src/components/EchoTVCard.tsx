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
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: NAVY }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(201,149,42,0.18)", border: "1px solid rgba(201,149,42,0.35)" }}
          >
            {/* TV icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Featured Ministry</p>
            <p className="text-sm font-black text-white leading-tight">Echo TV Studios</p>
          </div>
        </div>

        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition hover:opacity-80"
          style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)", border: "1px solid rgba(255,255,255,0.12)" }}
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
          {/* Dark thumbnail with play button overlay */}
          <div
            className="relative flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #0f1a30 100%)`,
              aspectRatio: "16/9",
            }}
          >
            {/* Decorative cross / glow */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-10"
              aria-hidden="true"
            >
              <svg width="180" height="180" viewBox="0 0 100 100" fill="none">
                <rect x="44" y="5"  width="12" height="90" rx="4" fill="white"/>
                <rect x="5"  y="34" width="90" height="12" rx="4" fill="white"/>
              </svg>
            </div>

            {/* Gold rays */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(ellipse at center, ${GOLD} 0%, transparent 70%)`,
              }}
            />

            {/* Play button */}
            <div
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition group-hover:scale-110"
              style={{
                background: GOLD,
                boxShadow: "0 6px 30px rgba(201,149,42,0.6)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" style={{ marginLeft: "3px" }}>
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>

            {/* "Watch episode" label at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-between"
              style={{ background: "linear-gradient(to top, rgba(10,16,30,0.85) 0%, transparent 100%)" }}
            >
              <span className="text-xs font-black text-white">Featured Episode</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: GOLD }}>
                Watch Now →
              </span>
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
