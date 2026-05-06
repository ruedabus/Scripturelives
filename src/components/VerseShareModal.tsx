"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ShareVerse = {
  reference: string; // "John 3:16"
  text: string;
  version: string;   // "KJV"
};

type Theme = {
  id: string;
  label: string;
  // Canvas gradient stops — two colours used for a linear diagonal gradient
  from: string;
  to: string;
  textColor: string;
  refColor: string;
  quoteColor: string;
  borderColor: string;
  watermarkColor: string;
  // Accent line colour
  accentColor: string;
};

const THEMES: Theme[] = [
  {
    id: "night",
    label: "Night",
    from: "#0f0c29",
    to: "#302b63",
    textColor: "#f0e6cc",
    refColor: "#f8c97e",
    quoteColor: "rgba(248,201,126,0.25)",
    borderColor: "rgba(248,201,126,0.35)",
    accentColor: "#f8c97e",
    watermarkColor: "rgba(240,230,204,0.25)",
  },
  {
    id: "dawn",
    label: "Dawn",
    from: "#b34700",
    to: "#7a0f2e",
    textColor: "#fff5e6",
    refColor: "#ffd89b",
    quoteColor: "rgba(255,216,155,0.2)",
    borderColor: "rgba(255,216,155,0.4)",
    accentColor: "#ffd89b",
    watermarkColor: "rgba(255,245,230,0.25)",
  },
  {
    id: "forest",
    label: "Forest",
    from: "#1a2e1a",
    to: "#2d5a27",
    textColor: "#e8f5e2",
    refColor: "#a8e063",
    quoteColor: "rgba(168,224,99,0.18)",
    borderColor: "rgba(168,224,99,0.35)",
    accentColor: "#a8e063",
    watermarkColor: "rgba(232,245,226,0.22)",
  },
  {
    id: "ocean",
    label: "Ocean",
    from: "#0a1628",
    to: "#0d4e6e",
    textColor: "#e0f4ff",
    refColor: "#7ecfed",
    quoteColor: "rgba(126,207,237,0.18)",
    borderColor: "rgba(126,207,237,0.35)",
    accentColor: "#7ecfed",
    watermarkColor: "rgba(224,244,255,0.22)",
  },
  {
    id: "parchment",
    label: "Parchment",
    from: "#c8a96e",
    to: "#8b6914",
    textColor: "#2c1a00",
    refColor: "#5a2d00",
    quoteColor: "rgba(44,26,0,0.1)",
    borderColor: "rgba(44,26,0,0.3)",
    accentColor: "#5a2d00",
    watermarkColor: "rgba(44,26,0,0.18)",
  },
];

// ── Canvas drawing ────────────────────────────────────────────────────────────

const SIZE = 1080;
const PADDING = 80;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawVerseImage(canvas: HTMLCanvasElement, verse: ShareVerse, theme: Theme) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width  = SIZE;
  canvas.height = SIZE;

  // ── Background gradient (diagonal) ──────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, theme.from);
  grad.addColorStop(1, theme.to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle radial depth overlay (centre slightly lighter)
  const radial = ctx.createRadialGradient(SIZE / 2, SIZE / 2, SIZE * 0.15, SIZE / 2, SIZE / 2, SIZE * 0.85);
  radial.addColorStop(0, "rgba(255,255,255,0.07)");
  radial.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Decorative border (double line) ──────────────────────────────────────
  const B = 28;
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(B, B, SIZE - B * 2, SIZE - B * 2);
  ctx.strokeRect(B + 8, B + 8, SIZE - (B + 8) * 2, SIZE - (B + 8) * 2);

  // ── Giant decorative quote mark ───────────────────────────────────────────
  ctx.font = `bold 320px Georgia, serif`;
  ctx.fillStyle = theme.quoteColor;
  ctx.textBaseline = "top";
  ctx.fillText("“", PADDING - 20, PADDING - 20);

  // ── Determine verse font size dynamically ──────────────────────────────────
  const textLen = verse.text.length;
  let verseFontSize = 52;
  if (textLen > 200) verseFontSize = 42;
  if (textLen > 300) verseFontSize = 36;
  if (textLen > 400) verseFontSize = 32;

  const maxTextWidth = SIZE - PADDING * 2;

  // ── Verse text ─────────────────────────────────────────────────────────────
  ctx.font = `italic ${verseFontSize}px Georgia, serif`;
  ctx.fillStyle = theme.textColor;
  ctx.textBaseline = "top";

  const lines = wrapText(ctx, verse.text, maxTextWidth);
  const lineHeight = verseFontSize * 1.55;
  const totalTextHeight = lines.length * lineHeight;

  // Vertical centre — shift down slightly to allow for bottom reference block
  const topY = (SIZE - totalTextHeight - 160) / 2 + 20;

  lines.forEach((line, i) => {
    ctx.fillText(line, PADDING, topY + i * lineHeight);
  });

  // ── Accent line below verse ───────────────────────────────────────────────
  const afterText = topY + totalTextHeight + 24;
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING, afterText);
  ctx.lineTo(SIZE - PADDING, afterText);
  ctx.stroke();

  // ── Reference (book · chapter:verse) ──────────────────────────────────────
  ctx.font = `bold ${Math.max(32, verseFontSize - 4)}px 'Georgia', serif`;
  ctx.fillStyle = theme.refColor;
  ctx.textBaseline = "top";
  ctx.fillText(`— ${verse.reference}`, PADDING, afterText + 20);

  // ── Version badge ──────────────────────────────────────────────────────────
  const versionY = afterText + 20 + Math.max(32, verseFontSize - 4) * 1.4 + 6;
  ctx.font = `${24}px 'Georgia', serif`;
  ctx.fillStyle = theme.refColor;
  ctx.globalAlpha = 0.7;
  ctx.fillText(verse.version, PADDING, versionY);
  ctx.globalAlpha = 1;

  // ── Small cross ornament (top-right corner area) ───────────────────────────
  const cx = SIZE - PADDING - 22;
  const cy = PADDING + 50;
  const armH = 28, armV = 38, thick = 5;
  ctx.fillStyle = theme.accentColor;
  ctx.globalAlpha = 0.6;
  // vertical bar
  ctx.fillRect(cx - thick / 2, cy - armV, thick, armV * 2);
  // horizontal bar
  ctx.fillRect(cx - armH, cy - thick / 2, armH * 2, thick);
  ctx.globalAlpha = 1;

  // ── Watermark ─────────────────────────────────────────────────────────────
  ctx.font = `18px 'Arial', sans-serif`;
  ctx.fillStyle = theme.watermarkColor;
  ctx.textBaseline = "bottom";
  const wm = "scripturelives.com";
  const wmW = ctx.measureText(wm).width;
  ctx.fillText(wm, SIZE / 2 - wmW / 2, SIZE - PADDING + 8);
}

// ── Modal Component ───────────────────────────────────────────────────────────

type Props = {
  verse: ShareVerse;
  onClose: () => void;
};

export default function VerseShareModal({ verse, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [themeIdx, setThemeIdx]     = useState(0);
  const [copied,   setCopied]       = useState(false);
  const [sharing,  setSharing]      = useState(false);
  const [canShare, setCanShare]     = useState(false);

  const theme = THEMES[themeIdx];

  // Check Web Share API availability on mount
  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share && !!navigator.canShare);
  }, []);

  // Redraw whenever verse or theme changes
  useEffect(() => {
    if (canvasRef.current) drawVerseImage(canvasRef.current, verse, theme);
  }, [verse, theme]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const getBlob = useCallback((): Promise<Blob> =>
    new Promise((resolve, reject) => {
      if (!canvasRef.current) return reject(new Error("No canvas"));
      canvasRef.current.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("toBlob failed"));
      }, "image/png");
    }),
  []);

  const handleDownload = useCallback(async () => {
    const blob = await getBlob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${verse.reference.replace(/\s+/g, "_")}_${theme.id}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getBlob, verse.reference, theme.id]);

  const handleShare = useCallback(async () => {
    if (!navigator.share) return;
    try {
      setSharing(true);
      const blob = await getBlob();
      const file = new File([blob], `${verse.reference.replace(/\s+/g, "_")}.png`, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: verse.reference, text: `${verse.text} — ${verse.reference} (${verse.version})` });
      } else {
        // Fallback: share text only
        await navigator.share({ title: verse.reference, text: `${verse.text} — ${verse.reference} (${verse.version})` });
      }
    } catch (e) {
      if (e instanceof Error && e.name !== "AbortError") console.error(e);
    } finally {
      setSharing(false);
    }
  }, [getBlob, verse]);

  const handleCopyText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference} (${verse.version})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [verse]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#1c1917", boxShadow: "0 25px 80px rgba(0,0,0,0.7)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-700">
          <div>
            <h2 className="text-white font-bold text-base">Share Verse</h2>
            <p className="text-amber-400 text-xs font-semibold mt-0.5">{verse.reference}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full w-8 h-8 flex items-center justify-center bg-stone-700 hover:bg-stone-600 text-stone-300 hover:text-white transition text-base"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Canvas preview */}
        <div className="flex items-center justify-center bg-stone-950 px-4 py-4">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="rounded-xl w-full"
            style={{ maxWidth: "400px", aspectRatio: "1 / 1" }}
          />
        </div>

        {/* Theme picker */}
        <div className="px-5 py-3 border-t border-stone-700">
          <p className="text-stone-400 text-xs font-semibold uppercase tracking-widest mb-2.5">Theme</p>
          <div className="flex gap-2 flex-wrap">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeIdx(i)}
                title={t.label}
                className={`rounded-full transition ring-offset-2 ring-offset-stone-900 ${themeIdx === i ? "ring-2 ring-amber-400 scale-110" : "hover:scale-105"}`}
                style={{
                  width: 32, height: 32,
                  background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
                  border: "2px solid rgba(255,255,255,0.15)",
                }}
                aria-label={t.label}
              />
            ))}
            <span className="text-stone-500 text-xs self-center ml-1">{theme.label}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 py-4 flex flex-wrap gap-2 border-t border-stone-700">
          {/* Share — only on mobile / when API available */}
          {canShare && (
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-900 font-bold text-sm px-4 py-2.5 transition disabled:opacity-60"
            >
              {sharing ? "Sharing…" : "⬆ Share Image"}
            </button>
          )}

          {/* Download */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-semibold text-sm px-4 py-2.5 transition"
          >
            ⬇ Download PNG
          </button>

          {/* Copy text */}
          <button
            type="button"
            onClick={handleCopyText}
            className={`flex items-center gap-2 rounded-xl font-semibold text-sm px-4 py-2.5 transition ${copied ? "bg-green-600 text-white" : "bg-stone-700 hover:bg-stone-600 text-white"}`}
          >
            {copied ? "✓ Copied!" : "📋 Copy Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
