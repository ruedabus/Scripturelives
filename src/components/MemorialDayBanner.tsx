"use client";

import { useEffect, useState } from "react";

// Banner expires at midnight May 26, 2026 (Eastern Time)
const EXPIRES = new Date("2026-05-26T00:00:00").getTime();

export default function MemorialDayBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Date.now() < EXPIRES) {
      setVisible(true);
    }

    // Auto-hide exactly at midnight
    const ms = EXPIRES - Date.now();
    if (ms > 0) {
      const t = setTimeout(() => setVisible(false), ms);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="w-full flex flex-col sm:flex-row items-center overflow-hidden"
      style={{ background: "#0a1628", borderBottom: "3px solid #B22234" }}
    >
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/memorialday-banner.png"
        alt="Honoring Our Men and Women of the Armed Forces"
        className="w-full sm:w-52 md:w-60 shrink-0 object-cover"
        style={{ maxHeight: "180px", objectPosition: "top center" }}
      />

      {/* Text */}
      <div className="flex-1 flex flex-col items-center sm:items-start justify-center px-6 py-5 gap-2 text-center sm:text-left">

        {/* Stars */}
        <div className="flex items-center gap-2 select-none">
          <span style={{ color: "#B22234", fontSize: "18px" }}>★</span>
          <span style={{ color: "white",   fontSize: "18px" }}>★</span>
          <span style={{ color: "#B22234", fontSize: "18px" }}>★</span>
        </div>

        {/* Headline */}
        <p
          className="text-2xl sm:text-3xl font-black tracking-wide uppercase"
          style={{
            color: "#B22234",
            letterSpacing: "0.06em",
            textShadow: "0 1px 8px rgba(178,34,52,0.4)",
          }}
        >
          Happy Memorial Day
        </p>

        {/* Tribute */}
        <p
          className="text-sm sm:text-base font-semibold leading-snug"
          style={{ color: "rgba(255,255,255,0.92)" }}
        >
          ScriptureLives.com honors the brave men and women
          <br className="hidden sm:block" />
          {" "}who have fought and sacrificed for our country.
        </p>

        {/* Scripture */}
        <p
          className="text-xs font-semibold italic mt-0.5"
          style={{ color: "#C9952A" }}
        >
          &ldquo;Greater love has no one than this: to lay down one&apos;s life for one&apos;s friends.&rdquo; &mdash; John 15:13
        </p>

        {/* Flag stripe accent */}
        <div className="flex gap-1 mt-1">
          {["#B22234","#ffffff","#B22234","#ffffff","#3C3B6E","#3C3B6E"].map((c, i) => (
            <span key={i} className="block h-1.5 w-6 rounded-full" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  );
}
