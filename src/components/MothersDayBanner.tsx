"use client";

import { useEffect, useState } from "react";

// Banner expires at midnight May 10, 2026
const EXPIRES = new Date("2026-05-11T00:00:00").getTime();

export default function MothersDayBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Date.now() < EXPIRES) {
      setVisible(true);
    }

    // Auto-hide at midnight
    const ms = EXPIRES - Date.now();
    if (ms > 0) {
      const t = setTimeout(() => setVisible(false), ms);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a2640 0%, #2d1f3d 40%, #4a1942 70%, #1a2640 100%)",
        borderBottom: "1px solid rgba(201,149,42,0.3)",
      }}
    >
      {/* Floating petals / decorative circles */}
      {[
        { top: "10%",  left: "3%",   size: 60,  opacity: 0.06 },
        { top: "60%",  left: "8%",   size: 40,  opacity: 0.08 },
        { top: "20%",  left: "15%",  size: 25,  opacity: 0.05 },
        { top: "70%",  right: "5%",  size: 55,  opacity: 0.06 },
        { top: "15%",  right: "12%", size: 35,  opacity: 0.07 },
        { top: "50%",  right: "20%", size: 20,  opacity: 0.05 },
        { top: "40%",  left: "45%",  size: 80,  opacity: 0.04 },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:   s.size,
            height:  s.size,
            top:     s.top,
            left:    "left" in s ? s.left : undefined,
            right:   "right" in s ? (s as {right: string}).right : undefined,
            background: "rgba(255,192,203,1)",
            opacity: s.opacity,
          }}
        />
      ))}

      {/* Sparkle dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`spark-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  i % 3 === 0 ? 4 : 2,
            height: i % 3 === 0 ? 4 : 2,
            top:    `${(i * 29 + 10) % 85}%`,
            left:   `${(i * 41 + 5) % 92}%`,
            background: "#C9952A",
            opacity: 0.4 + (i % 3) * 0.15,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 py-6 px-4 flex flex-col items-center text-center gap-3">

        {/* Flower row */}
        <div className="flex items-center gap-2 text-2xl select-none">
          <span>🌸</span><span>🌷</span><span>🌺</span><span>🌸</span><span>🌷</span>
        </div>

        {/* Main headline */}
        <div>
          <p
            className="text-2xl sm:text-3xl font-black tracking-tight leading-tight"
            style={{
              color: "white",
              textShadow: "0 2px 20px rgba(201,149,42,0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            Happy Mother&apos;s Day
          </p>
          <p
            className="text-sm font-bold uppercase tracking-widest mt-1"
            style={{ color: "#C9952A", letterSpacing: "0.2em" }}
          >
            from Scripture Lives
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ background: "rgba(201,149,42,0.4)" }} />
          <span style={{ color: "#C9952A", fontSize: 14 }}>✝</span>
          <div className="flex-1 h-px" style={{ background: "rgba(201,149,42,0.4)" }} />
        </div>

        {/* Scripture */}
        <div className="max-w-lg">
          <p
            className="text-sm sm:text-base leading-relaxed font-medium italic"
            style={{ color: "rgba(255,255,255,0.9)" }}
          >
            &ldquo;Her children arise and call her blessed; her husband also, and he praises her:
            &lsquo;Many women do noble things, but you surpass them all.&rsquo;&rdquo;
          </p>
          <p
            className="text-xs font-bold mt-2 uppercase tracking-widest"
            style={{ color: "#C9952A" }}
          >
            Proverbs 31:28–29
          </p>
        </div>

        {/* Bottom flower row */}
        <div className="flex items-center gap-2 text-xl select-none">
          <span>🌸</span><span>🌷</span><span>🌺</span><span>🌸</span><span>🌷</span>
        </div>

      </div>
    </div>
  );
}
