"use client";

import { useState } from "react";

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";

const EPISODE_URL  = "https://echotvstudios.com/#/player/69572/800299";
const SITE_URL     = "https://echotvstudios.com";

export default function EchoTVCard() {
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-5"
      style={{ border: "1px solid #e8d5b0", boxShadow: "0 4px 20px rgba(201,149,42,0.10)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: NAVY }}
      >
        <div className="flex items-center gap-3">
          {/* TV icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(201,149,42,0.18)", border: "1px solid rgba(201,149,42,0.35)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="17 2 12 7 7 2"/>
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              Featured Ministry
            </p>
            <p className="text-sm font-black text-white leading-tight">Echo TV Studios</p>
          </div>
        </div>

        {/* External link */}
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

      {/* Body */}
      <div className="bg-white px-5 py-5">
        <p className="text-sm leading-relaxed mb-4" style={{ color: "#4b5563" }}>
          Echo TV Studios is a Christian television and video ministry dedicated to sharing the Gospel through powerful media. Watch inspiring messages, worship, and teachings — all rooted in God&apos;s Word.
        </p>

        {/* Watch button / embed toggle */}
        {!showEmbed && !embedError && (
          <button
            onClick={() => setShowEmbed(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition hover:brightness-110"
            style={{ background: GOLD, boxShadow: "0 4px 16px rgba(201,149,42,0.35)" }}
          >
            {/* Play icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Watch Featured Episode
          </button>
        )}

        {/* Embedded player */}
        {showEmbed && !embedError && (
          <div>
            <div
              className="rounded-xl overflow-hidden mb-3"
              style={{ position: "relative", paddingBottom: "56.25%", height: 0, background: "#000" }}
            >
              <iframe
                src={EPISODE_URL}
                title="Echo TV Studios — Featured Episode"
                allow="autoplay; fullscreen"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                onError={() => setEmbedError(true)}
              />
            </div>

            <div className="flex gap-2">
              <a
                href={EPISODE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition hover:brightness-110"
                style={{ background: `rgba(201,149,42,0.12)`, color: GOLD }}
              >
                Open in new tab
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
              <button
                onClick={() => setShowEmbed(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold transition hover:opacity-70"
                style={{ background: "#faf8f3", border: "1px solid #ede8de", color: "#9ca3af" }}
              >
                Hide
              </button>
            </div>
          </div>
        )}

        {/* Fallback if embed errors */}
        {embedError && (
          <a
            href={EPISODE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition hover:brightness-110"
            style={{ background: GOLD }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Watch on Echo TV Studios →
          </a>
        )}

        {/* Divider + footer link */}
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
