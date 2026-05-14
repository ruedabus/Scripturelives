"use client";

import Link from "next/link";
import { DEVOTIONALS } from "@/data/devotionals";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

function getTodayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  const idx = ((dayOfYear - 1) % DEVOTIONALS.length + DEVOTIONALS.length) % DEVOTIONALS.length;
  return { idx, dayNum: idx + 1 };
}

export default function TodayDevotional() {
  const { idx, dayNum } = getTodayIndex();
  const dev = DEVOTIONALS[idx];

  return (
    <section className="w-full max-w-2xl mx-auto px-4 pt-8 pb-2">
      <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>
        🌅 Today&apos;s Devotional — Day {dayNum}
      </p>
      <Link
        href={`/devotionals/day/${dayNum}`}
        className="group flex flex-col sm:flex-row gap-5 rounded-2xl p-6 transition hover:opacity-95"
        style={{ background: NAVY, border: `1px solid rgba(201,149,42,0.3)`, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
      >
        <div className="text-5xl select-none self-start">{dev.icon}</div>
        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: GOLD }}>{dev.reference}</p>
          <h2 className="text-lg font-black text-white mb-2">{dev.title}</h2>
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.7)" }}>
            &ldquo;{dev.verse}&rdquo;
          </p>
        </div>
        <div className="self-end sm:self-center shrink-0">
          <span className="text-xs font-black px-4 py-2 rounded-xl" style={{ background: GOLD, color: NAVY }}>
            Read →
          </span>
        </div>
      </Link>
    </section>
  );
}
