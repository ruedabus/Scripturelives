"use client";

import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function FindAChurchPage() {
  const [zip, setZip] = useState("");
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!zip.trim()) return;
    setSearched(true);
    window.open(
      `https://www.google.com/maps/search/Bible+believing+church+near+${encodeURIComponent(zip)}`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center" style={{ background: "#f9f7f2", fontFamily: "Georgia, serif" }}>

      {/* ── Hero ── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-16 text-center"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #2d1f3d 60%, #1a2640 100%)` }}
      >
        <div className="mb-6 text-6xl select-none">⛪</div>
        <h1
          className="text-4xl sm:text-5xl font-black leading-tight mb-4 text-white"
          style={{ textShadow: `0 2px 20px rgba(201,149,42,0.4)` }}
        >
          Find a <span style={{ color: GOLD }}>Church Near You</span>
        </h1>
        <p className="text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
          You don't have to walk this out alone. Enter your zip code and find a Bible-believing church in your area.
        </p>
      </section>

      {/* ── Search ── */}
      <section className="w-full max-w-xl px-6 py-14 flex flex-col gap-8">

        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <label
            htmlFor="zip"
            className="text-sm font-black uppercase tracking-widest text-center"
            style={{ color: NAVY }}
          >
            Enter Your Zip Code
          </label>
          <div className="flex gap-3">
            <input
              id="zip"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="e.g. 90210"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              className="flex-1 px-5 py-4 rounded-2xl text-lg font-bold border-2 outline-none transition focus:scale-[1.01]"
              style={{
                borderColor: GOLD,
                color: NAVY,
                background: "white",
                fontFamily: "Georgia, serif",
              }}
            />
            <button
              type="submit"
              className="px-6 py-4 rounded-2xl font-black text-base transition hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ background: GOLD, color: NAVY, whiteSpace: "nowrap" }}
            >
              Search →
            </button>
          </div>
          <p className="text-xs text-center" style={{ color: "#9a8f80" }}>
            Opens Google Maps with churches near your location
          </p>
        </form>

        {/* ── After search tips ── */}
        {searched && (
          <div
            className="rounded-3xl p-6 flex flex-col gap-4"
            style={{ background: NAVY, border: `1px solid rgba(201,149,42,0.3)` }}
          >
            <p className="text-sm font-black uppercase tracking-widest text-center" style={{ color: GOLD }}>
              Tips for Finding the Right Church
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Look for a church that preaches directly from the Bible",
                "Visit a few times before deciding — it's okay to take your time",
                "Look for genuine community, not just a big building",
                "Ask if they have a new believers' class or small groups",
                "Trust your gut — you'll know when it feels like home",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: GOLD, color: NAVY }}>
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Also try ── */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-widest text-center" style={{ color: "#9a8f80" }}>
            Also try these directories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Church Finder", url: "https://www.churchfinder.com", desc: "Large US church directory" },
              { name: "Find a Church", url: "https://www.findachurch.com", desc: "Search by denomination" },
              { name: "The Gospel Coalition", url: "https://www.thegospelcoalition.org/churches", desc: "Gospel-centered churches" },
            ].map((dir) => (
              <a
                key={dir.name}
                href={dir.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl p-4 flex flex-col gap-1 text-center transition hover:opacity-90"
                style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <span className="text-sm font-black" style={{ color: NAVY }}>{dir.name}</span>
                <span className="text-xs" style={{ color: "#7a6f60" }}>{dir.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Back to Gospel ── */}
      <section className="pb-16 text-center">
        <Link
          href="/gospel"
          className="text-sm font-bold underline hover:opacity-70 transition"
          style={{ color: NAVY }}
        >
          ← Back to the Gospel
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer
        className="w-full py-8 px-6 text-center text-xs"
        style={{ color: "#9ca3af", borderTop: "1px solid #ede8de" }}
      >
        <p style={{ color: "#c0b89a" }}>© 2026 Scripture Lives / Faith Tails &nbsp;·&nbsp; info@scripturelives.com</p>
      </footer>
    </main>
  );
}
