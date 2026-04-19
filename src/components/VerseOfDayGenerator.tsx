"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Download, Share2, RefreshCw, Palette, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { VERSE_POOL, getVerseOfDay, formatDate, DailyVerse } from "@/data/verseOfDay";

// ── Card themes ────────────────────────────────────────────────────────────────
interface Theme {
  id: string;
  name: string;
  preview: string; // Tailwind gradient class for preview chip
  // Canvas draw function receives (ctx, w, h) and sets up background
  drawBackground: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  verseColor: string;
  refColor: string;
  brandColor: string;
  themeColor: string;
  dividerColor: string;
}

const THEMES: Theme[] = [
  {
    id: "midnight",
    name: "Midnight",
    preview: "from-stone-900 to-stone-700",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#1c1917");
      grad.addColorStop(1, "#292524");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // Subtle corner glow
      const glow = ctx.createRadialGradient(w * 0.85, h * 0.15, 0, w * 0.85, h * 0.15, w * 0.5);
      glow.addColorStop(0, "rgba(251,191,36,0.08)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#fef3c7",
    refColor: "#fbbf24",
    brandColor: "#78716c",
    themeColor: "#f59e0b",
    dividerColor: "rgba(251,191,36,0.3)",
  },
  {
    id: "dawn",
    name: "Golden Dawn",
    preview: "from-amber-400 to-orange-500",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#fef3c7");
      grad.addColorStop(0.5, "#fde68a");
      grad.addColorStop(1, "#fbbf24");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#451a03",
    refColor: "#92400e",
    brandColor: "#b45309",
    themeColor: "#92400e",
    dividerColor: "rgba(146,64,14,0.3)",
  },
  {
    id: "ocean",
    name: "Deep Ocean",
    preview: "from-sky-700 to-indigo-900",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#0c4a6e");
      grad.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(w * 0.5, 0, 0, w * 0.5, 0, h * 0.8);
      glow.addColorStop(0, "rgba(56,189,248,0.12)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#e0f2fe",
    refColor: "#38bdf8",
    brandColor: "#7dd3fc",
    themeColor: "#38bdf8",
    dividerColor: "rgba(56,189,248,0.3)",
  },
  {
    id: "forest",
    name: "Forest",
    preview: "from-emerald-700 to-green-900",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#064e3b");
      grad.addColorStop(1, "#14532d");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#ecfdf5",
    refColor: "#6ee7b7",
    brandColor: "#34d399",
    themeColor: "#6ee7b7",
    dividerColor: "rgba(110,231,183,0.3)",
  },
  {
    id: "parchment",
    name: "Parchment",
    preview: "from-stone-200 to-amber-100",
    drawBackground(ctx, w, h) {
      ctx.fillStyle = "#faf7f2";
      ctx.fillRect(0, 0, w, h);
      // Subtle texture lines
      ctx.strokeStyle = "rgba(180,160,120,0.08)";
      ctx.lineWidth = 1;
      for (let y = 40; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      // Edge vignette
      const vign = ctx.createRadialGradient(w/2, h/2, h*0.3, w/2, h/2, h*0.9);
      vign.addColorStop(0, "rgba(0,0,0,0)");
      vign.addColorStop(1, "rgba(180,140,80,0.12)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#292524",
    refColor: "#92400e",
    brandColor: "#a8a29e",
    themeColor: "#b45309",
    dividerColor: "rgba(146,64,14,0.25)",
  },
  {
    id: "purple",
    name: "Royal",
    preview: "from-purple-800 to-violet-950",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#3b0764");
      grad.addColorStop(1, "#4c1d95");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      const glow = ctx.createRadialGradient(0, h, 0, 0, h, w * 0.7);
      glow.addColorStop(0, "rgba(167,139,250,0.15)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#ede9fe",
    refColor: "#c4b5fd",
    brandColor: "#a78bfa",
    themeColor: "#c4b5fd",
    dividerColor: "rgba(196,181,253,0.3)",
  },
  {
    id: "rose",
    name: "Rose",
    preview: "from-rose-700 to-pink-900",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#881337");
      grad.addColorStop(1, "#500724");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#fff1f2",
    refColor: "#fda4af",
    brandColor: "#fb7185",
    themeColor: "#fda4af",
    dividerColor: "rgba(253,164,175,0.3)",
  },
  {
    id: "slate",
    name: "Stone & Silver",
    preview: "from-slate-600 to-slate-800",
    drawBackground(ctx, w, h) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "#334155");
      grad.addColorStop(1, "#1e293b");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    },
    verseColor: "#f1f5f9",
    refColor: "#94a3b8",
    brandColor: "#64748b",
    themeColor: "#cbd5e1",
    dividerColor: "rgba(148,163,184,0.3)",
  },
];

// ── Text wrapping helper ───────────────────────────────────────────────────────
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
  return currentY;
}

// ── Canvas dimensions ─────────────────────────────────────────────────────────
const CARD_W = 1080;
const CARD_H = 1080;
const PAD = 80;

// ── Main component ─────────────────────────────────────────────────────────────
export default function VerseOfDayGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [verse, setVerse] = useState<DailyVerse>(getVerseOfDay());
  const [customVerse, setCustomVerse] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customRef, setCustomRef] = useState("");
  const [verseIdx, setVerseIdx] = useState<number | "today">("today");
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);
  const [showBranding, setShowBranding] = useState(true);
  const [showDate, setShowDate] = useState(true);

  const theme = THEMES[themeIdx];

  const displayVerse: DailyVerse = customVerse && customText && customRef
    ? { reference: customRef, text: customText, theme: "Custom" }
    : verse;

  // ── Draw canvas ──────────────────────────────────────────────────────────
  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = CARD_W;
    const h = CARD_H;
    canvas.width = w;
    canvas.height = h;

    // Background
    theme.drawBackground(ctx, w, h);

    // Left accent bar
    ctx.fillStyle = theme.themeColor;
    ctx.beginPath();
    ctx.roundRect(PAD, PAD, 6, h - PAD * 2, 3);
    ctx.fill();

    const contentX = PAD + 30;
    const contentW = w - PAD - 30 - PAD;
    let y = PAD + 20;

    // Theme label + date
    ctx.font = `600 28px -apple-system, "Helvetica Neue", sans-serif`;
    ctx.fillStyle = theme.themeColor;
    ctx.textAlign = "left";
    ctx.fillText(`✦ ${displayVerse.theme.toUpperCase()}`, contentX, y);

    if (showDate) {
      ctx.font = `400 24px -apple-system, "Helvetica Neue", sans-serif`;
      ctx.fillStyle = theme.brandColor;
      ctx.textAlign = "right";
      ctx.fillText(formatDate(), w - PAD, y);
      ctx.textAlign = "left";
    }

    y += 56;

    // "Verse of the Day" label
    ctx.font = `400 26px -apple-system, "Helvetica Neue", sans-serif`;
    ctx.fillStyle = theme.brandColor;
    ctx.fillText("VERSE OF THE DAY", contentX, y);
    y += 14;

    // Divider line
    ctx.strokeStyle = theme.dividerColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(contentX, y);
    ctx.lineTo(w - PAD, y);
    ctx.stroke();
    y += 60;

    // Opening quote mark
    ctx.font = `bold 120px Georgia, serif`;
    ctx.fillStyle = theme.themeColor;
    ctx.globalAlpha = 0.25;
    ctx.fillText("\u201C", contentX - 10, y);
    ctx.globalAlpha = 1;
    y += 20;

    // Verse text — large, italic
    const fontSize = displayVerse.text.length > 200 ? 36 : displayVerse.text.length > 120 ? 42 : 48;
    ctx.font = `italic ${fontSize}px Georgia, "Times New Roman", serif`;
    ctx.fillStyle = theme.verseColor;
    ctx.lineWidth = 1;
    const endY = wrapText(ctx, `\u201C${displayVerse.text}\u201D`, contentX, y, contentW, fontSize * 1.5);
    y = endY + 60;

    // Closing divider
    ctx.strokeStyle = theme.dividerColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentX, y);
    ctx.lineTo(contentX + 120, y);
    ctx.stroke();
    y += 40;

    // Reference
    ctx.font = `bold 38px -apple-system, "Helvetica Neue", sans-serif`;
    ctx.fillStyle = theme.refColor;
    ctx.fillText(`— ${displayVerse.reference}`, contentX, y);
    y += 56;

    // Branding
    if (showBranding) {
      ctx.strokeStyle = theme.dividerColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(contentX, h - PAD - 14);
      ctx.lineTo(w - PAD, h - PAD - 14);
      ctx.stroke();

      ctx.font = `600 24px -apple-system, "Helvetica Neue", sans-serif`;
      ctx.fillStyle = theme.themeColor;
      ctx.textAlign = "left";
      ctx.fillText("Scripture Lives", contentX, h - PAD + 16);

      ctx.font = `400 22px -apple-system, "Helvetica Neue", sans-serif`;
      ctx.fillStyle = theme.brandColor;
      ctx.textAlign = "right";
      ctx.fillText("scripturelives.com", w - PAD, h - PAD + 16);
      ctx.textAlign = "left";
    }
  }, [theme, displayVerse, showBranding, showDate]);

  useEffect(() => { drawCard(); }, [drawCard]);

  // ── Download PNG ─────────────────────────────────────────────────────────
  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `scripture-lives-${displayVerse.reference.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }

  // ── Share ─────────────────────────────────────────────────────────────────
  async function handleShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "verse-of-the-day.png", { type: "image/png" });
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${displayVerse.reference} — Scripture Lives`,
            text: `"${displayVerse.text}" — ${displayVerse.reference}`,
            files: [file],
          });
        } else {
          // Fallback: copy text
          await navigator.clipboard.writeText(`"${displayVerse.text}" — ${displayVerse.reference}\n\nscripturelives.com`);
          setShared(true);
          setTimeout(() => setShared(false), 2000);
        }
      }, "image/png");
    } catch {
      // ignore cancelled share
    }
  }

  // ── Share to Facebook ────────────────────────────────────────────────────
  const [fbTip, setFbTip] = useState(false);

  function handleShareFacebook() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Auto-download the image
    const link = document.createElement("a");
    link.download = `scripture-lives-${displayVerse.reference.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    // 2. Open Facebook create-post in a new tab
    window.open("https://www.facebook.com/", "_blank", "noopener");

    // 3. Show tip
    setFbTip(true);
    setTimeout(() => setFbTip(false), 6000);
  }

  // ── Cycle verses ──────────────────────────────────────────────────────────
  function cycleVerse(dir: 1 | -1) {
    const currentIdx = typeof verseIdx === "number" ? verseIdx : VERSE_POOL.indexOf(getVerseOfDay());
    const next = (currentIdx + dir + VERSE_POOL.length) % VERSE_POOL.length;
    setVerseIdx(next);
    setVerse(VERSE_POOL[next]);
    setCustomVerse(false);
  }

  function resetToToday() {
    setVerseIdx("today");
    setVerse(getVerseOfDay());
    setCustomVerse(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2">
          <Sparkles size={18} /> Verse of the Day — Image Generator
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">Create shareable quote cards for social media</p>
      </div>

      {/* Canvas preview */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-100">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ display: "block" }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition"
        >
          <Download size={16} />
          {downloaded ? "Saved!" : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:border-amber-400 hover:text-amber-600 transition"
          title="Share via OS share sheet"
        >
          <Share2 size={16} />
          {shared ? "Copied!" : "Share"}
        </button>
      </div>

      {/* Facebook share button */}
      <button
        type="button"
        onClick={handleShareFacebook}
        className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#1877F2] py-3 text-sm font-semibold text-white hover:bg-[#1464d3] transition"
      >
        {/* Facebook logo */}
        <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.887v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
        </svg>
        Share to Facebook
      </button>

      {/* Facebook tip banner */}
      {fbTip && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
          <span className="text-lg shrink-0">📸</span>
          <div>
            <p className="font-semibold">Image downloaded!</p>
            <p className="text-xs text-blue-600 mt-0.5">Facebook is open in a new tab. Create a new post and upload the downloaded image to share it with your followers.</p>
          </div>
        </div>
      )}

      {/* ── Theme picker ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
          <Palette size={12} /> Theme
        </p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setThemeIdx(i)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border transition ${
                themeIdx === i
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${t.preview} shrink-0`} />
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Verse picker ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Verse</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => cycleVerse(-1)} className="rounded-xl border border-gray-200 p-2 hover:border-amber-400 transition">
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
          <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center">
            <p className="text-xs font-bold text-amber-700">{displayVerse.reference}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1 italic">{displayVerse.theme}</p>
          </div>
          <button type="button" onClick={() => cycleVerse(1)} className="rounded-xl border border-gray-200 p-2 hover:border-amber-400 transition">
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          {verseIdx !== "today" && (
            <button type="button" onClick={resetToToday} title="Today's verse" className="rounded-xl border border-gray-200 p-2 hover:border-amber-400 transition">
              <RefreshCw size={16} className="text-gray-400" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-center text-gray-400 mt-1">
          {verseIdx === "today" ? `Today's verse (${VERSE_POOL.indexOf(getVerseOfDay()) + 1} of ${VERSE_POOL.length})` : `Verse ${(verseIdx as number) + 1} of ${VERSE_POOL.length}`}
        </p>
      </div>

      {/* ── Options ───────────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Options</p>
        <div className="flex gap-3 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showBranding}
              onChange={(e) => setShowBranding(e.target.checked)}
              className="rounded accent-amber-500"
            />
            <span className="text-sm text-gray-600">Show branding</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showDate}
              onChange={(e) => setShowDate(e.target.checked)}
              className="rounded accent-amber-500"
            />
            <span className="text-sm text-gray-600">Show date</span>
          </label>
        </div>
      </div>

      {/* ── Custom verse ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Custom Verse</p>
        <div className="space-y-2">
          <input
            type="text"
            value={customRef}
            onChange={(e) => { setCustomRef(e.target.value); setCustomVerse(true); }}
            placeholder="Reference — e.g. John 3:16"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
          />
          <textarea
            value={customText}
            onChange={(e) => { setCustomText(e.target.value); setCustomVerse(true); }}
            placeholder="Paste your verse text here…"
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none resize-none"
          />
          {customVerse && (
            <button
              type="button"
              onClick={resetToToday}
              className="text-xs text-gray-400 hover:text-amber-600 transition"
            >
              ← Back to daily verse
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-2">
        1080×1080px · Perfect for Instagram, Facebook, and Twitter/X
      </p>
    </div>
  );
}
