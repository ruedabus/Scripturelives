"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ShareVerse = {
  reference: string;
  text: string;
  version: string;
};

type Theme = {
  id: string;
  label: string;
  from: string;
  to: string;
  textColor: string;
  refColor: string;
  quoteColor: string;
  borderColor: string;
  watermarkColor: string;
  accentColor: string;
};

// ── Themes — all aligned with the site's GOLD / NAVY / CREAM palette ──────────
const THEMES: Theme[] = [
  {
    id: "parchment",
    label: "Parchment",
    from: "#faf8f3",
    to: "#f0e8d5",
    textColor: "#1a2640",
    refColor: "#C9952A",
    quoteColor: "rgba(201,149,42,0.12)",
    borderColor: "rgba(201,149,42,0.40)",
    accentColor: "#C9952A",
    watermarkColor: "rgba(26,38,64,0.22)",
  },
  {
    id: "navy",
    label: "Navy",
    from: "#1a2640",
    to: "#0f1a30",
    textColor: "#faf8f3",
    refColor: "#C9952A",
    quoteColor: "rgba(201,149,42,0.18)",
    borderColor: "rgba(201,149,42,0.38)",
    accentColor: "#C9952A",
    watermarkColor: "rgba(250,248,243,0.22)",
  },
  {
    id: "gold",
    label: "Gold",
    from: "#C9952A",
    to: "#a57520",
    textColor: "#faf8f3",
    refColor: "#ffffff",
    quoteColor: "rgba(255,255,255,0.18)",
    borderColor: "rgba(255,255,255,0.35)",
    accentColor: "#ffffff",
    watermarkColor: "rgba(255,255,255,0.28)",
  },
  {
    id: "olive",
    label: "Olive",
    from: "#2e3a1f",
    to: "#4a5e2e",
    textColor: "#f5f0e4",
    refColor: "#C9952A",
    quoteColor: "rgba(201,149,42,0.18)",
    borderColor: "rgba(201,149,42,0.38)",
    accentColor: "#C9952A",
    watermarkColor: "rgba(245,240,228,0.22)",
  },
  {
    id: "stone",
    label: "Stone",
    from: "#4a3f35",
    to: "#2e2520",
    textColor: "#faf8f3",
    refColor: "#C9952A",
    quoteColor: "rgba(201,149,42,0.15)",
    borderColor: "rgba(201,149,42,0.35)",
    accentColor: "#C9952A",
    watermarkColor: "rgba(250,248,243,0.22)",
  },
];

// ── Canvas drawing ────────────────────────────────────────────────────────────

const SIZE    = 1080;
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

  // ── Background gradient ───────────────────────────────────────────────────
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, theme.from);
  grad.addColorStop(1, theme.to);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Subtle radial depth overlay
  const radial = ctx.createRadialGradient(SIZE / 2, SIZE / 2, SIZE * 0.15, SIZE / 2, SIZE / 2, SIZE * 0.85);
  radial.addColorStop(0, "rgba(255,255,255,0.06)");
  radial.addColorStop(1, "rgba(0,0,0,0.14)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Decorative double border ──────────────────────────────────────────────
  const B = 28;
  ctx.strokeStyle = theme.borderColor;
  ctx.lineWidth   = 1.5;
  ctx.strokeRect(B,     B,     SIZE - B * 2,         SIZE - B * 2);
  ctx.strokeRect(B + 8, B + 8, SIZE - (B + 8) * 2,  SIZE - (B + 8) * 2);

  // ── Giant decorative quote mark ───────────────────────────────────────────
  ctx.font        = `bold 320px Georgia, serif`;
  ctx.fillStyle   = theme.quoteColor;
  ctx.textBaseline = "top";
  ctx.fillText("“", PADDING - 20, PADDING - 20);

  // ── Dynamic font size based on verse length ───────────────────────────────
  const textLen = verse.text.length;
  let verseFontSize = 52;
  if (textLen > 200) verseFontSize = 42;
  if (textLen > 300) verseFontSize = 36;
  if (textLen > 400) verseFontSize = 32;

  const maxTextWidth = SIZE - PADDING * 2;

  // ── Verse text ─────────────────────────────────────────────────────────────
  ctx.font        = `italic ${verseFontSize}px Georgia, serif`;
  ctx.fillStyle   = theme.textColor;
  ctx.textBaseline = "top";

  const lines      = wrapText(ctx, verse.text, maxTextWidth);
  const lineHeight = verseFontSize * 1.55;
  const totalTextH = lines.length * lineHeight;
  const topY       = (SIZE - totalTextH - 160) / 2 + 20;

  lines.forEach((line, i) => {
    ctx.fillText(line, PADDING, topY + i * lineHeight);
  });

  // ── Accent divider line ───────────────────────────────────────────────────
  const afterText = topY + totalTextH + 24;
  ctx.strokeStyle = theme.accentColor;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(PADDING,        afterText);
  ctx.lineTo(SIZE - PADDING, afterText);
  ctx.stroke();

  // ── Reference ─────────────────────────────────────────────────────────────
  ctx.font        = `bold ${Math.max(32, verseFontSize - 4)}px Georgia, serif`;
  ctx.fillStyle   = theme.refColor;
  ctx.textBaseline = "top";
  ctx.fillText(`— ${verse.reference}`, PADDING, afterText + 20);

  // ── Version badge ──────────────────────────────────────────────────────────
  const versionY = afterText + 20 + Math.max(32, verseFontSize - 4) * 1.4 + 6;
  ctx.font        = `24px Georgia, serif`;
  ctx.fillStyle   = theme.refColor;
  ctx.globalAlpha = 0.65;
  ctx.fillText(verse.version, PADDING, versionY);
  ctx.globalAlpha = 1;

  // ── Cross ornament (top-right) ────────────────────────────────────────────
  const cx = SIZE - PADDING - 22;
  const cy = PADDING + 50;
  const armH = 28, armV = 38, thick = 5;
  ctx.fillStyle   = theme.accentColor;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(cx - thick / 2, cy - armV,  thick,      armV * 2);
  ctx.fillRect(cx - armH,      cy - thick / 2, armH * 2, thick);
  ctx.globalAlpha = 1;

  // ── Watermark ─────────────────────────────────────────────────────────────
  ctx.font        = `18px Arial, sans-serif`;
  ctx.fillStyle   = theme.watermarkColor;
  ctx.textBaseline = "bottom";
  const wm  = "scripturelives.com";
  const wmW = ctx.measureText(wm).width;
  ctx.fillText(wm, SIZE / 2 - wmW / 2, SIZE - PADDING + 8);
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const GOLD  = "#C9952A";
const NAVY  = "#1a2640";
const CREAM = "#faf8f3";

type Props = { verse: ShareVerse; onClose: () => void };

export default function VerseShareModal({ verse, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [copied,   setCopied]   = useState(false);
  const [sharing,  setSharing]  = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [fbDone,   setFbDone]   = useState(false);

  const theme = THEMES[themeIdx];

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share && !!navigator.canShare);
  }, []);

  useEffect(() => {
    if (canvasRef.current) drawVerseImage(canvasRef.current, verse, theme);
  }, [verse, theme]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const getBlob = useCallback((): Promise<Blob> =>
    new Promise((resolve, reject) => {
      if (!canvasRef.current) return reject(new Error("No canvas"));
      canvasRef.current.toBlob((b) => b ? resolve(b) : reject(new Error("toBlob failed")), "image/png");
    }), []);

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

  const handleShareFacebook = useCallback(async () => {
    await handleDownload();
    const text  = `"${verse.text}" — ${verse.reference} (${verse.version})`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php`
      + `?u=${encodeURIComponent("https://scripturelives.com")}`
      + `&quote=${encodeURIComponent(text)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer,width=600,height=500");
    setFbDone(true);
    setTimeout(() => setFbDone(false), 3000);
  }, [handleDownload, verse]);

  const handleShareSMS = useCallback(() => {
    const body = `"${verse.text}" — ${verse.reference} (${verse.version}) | scripturelives.com`;
    const sep  = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "&" : "?";
    window.open(`sms:${sep}body=${encodeURIComponent(body)}`, "_self");
  }, [verse]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(10,16,30,0.88)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden flex flex-col"
        style={{ background: CREAM, boxShadow: "0 25px 80px rgba(0,0,0,0.55)", border: "1px solid #ede8de" }}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid #ede8de" }}
        >
          <div>
            <h2 className="font-black text-base" style={{ color: NAVY }}>Share Verse</h2>
            <p className="text-xs font-semibold mt-0.5" style={{ color: GOLD }}>{verse.reference}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full w-8 h-8 flex items-center justify-center transition hover:opacity-70 text-sm font-bold"
            style={{ background: "#ede8de", color: NAVY }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Canvas preview ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center px-4 py-4"
          style={{ background: "#f0ece3" }}
        >
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className="rounded-xl w-full shadow-md"
            style={{ maxWidth: "380px", aspectRatio: "1 / 1" }}
          />
        </div>

        {/* ── Theme picker ────────────────────────────────────────────────── */}
        <div className="px-5 py-3" style={{ borderTop: "1px solid #ede8de" }}>
          <p className="text-xs font-black uppercase tracking-widest mb-2.5" style={{ color: NAVY, opacity: 0.5 }}>
            Theme
          </p>
          <div className="flex gap-2 flex-wrap items-center">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeIdx(i)}
                title={t.label}
                className="rounded-full transition-all"
                style={{
                  width: 32,
                  height: 32,
                  background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
                  border: themeIdx === i
                    ? `3px solid ${GOLD}`
                    : "2px solid rgba(26,38,64,0.15)",
                  transform: themeIdx === i ? "scale(1.15)" : "scale(1)",
                  boxShadow: themeIdx === i ? `0 0 0 2px ${CREAM}, 0 0 0 4px ${GOLD}` : "none",
                }}
                aria-label={t.label}
              />
            ))}
            <span className="text-xs font-semibold ml-1" style={{ color: GOLD }}>
              {theme.label}
            </span>
          </div>
        </div>

        {/* ── Action buttons ──────────────────────────────────────────────── */}
        <div className="px-5 pt-3 pb-2 flex flex-wrap gap-2" style={{ borderTop: "1px solid #ede8de" }}>
          {canShare && (
            <button
              type="button"
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center gap-2 rounded-xl font-black text-sm px-4 py-2.5 transition disabled:opacity-60 hover:brightness-110"
              style={{ background: GOLD, color: "#fff" }}
            >
              {sharing ? "Sharing…" : "⬆ Share Image"}
            </button>
          )}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-xl font-semibold text-sm px-4 py-2.5 transition hover:opacity-80"
            style={{ background: NAVY, color: "#fff" }}
          >
            ⬇ Download PNG
          </button>
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center gap-2 rounded-xl font-semibold text-sm px-4 py-2.5 transition"
            style={copied
              ? { background: "#4a7c59", color: "#fff" }
              : { background: "#ede8de", color: NAVY }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Text"}
          </button>
        </div>

        {/* ── Social / SMS ────────────────────────────────────────────────── */}
        <div className="px-5 pb-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-widest w-full -mb-0.5" style={{ color: NAVY, opacity: 0.4 }}>
            Share to
          </span>

          <button
            type="button"
            onClick={handleShareFacebook}
            title="Share to Facebook (downloads image + opens share dialog)"
            className="flex items-center gap-2 rounded-xl font-bold text-sm px-4 py-2.5 transition hover:brightness-110 text-white"
            style={{ background: fbDone ? "#4a7c59" : "#1877F2" }}
          >
            {fbDone ? "✓ Image saved!" : (
              <>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.018 1.793-4.688 4.533-4.688 1.313 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.927-1.956 1.877v2.255h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </>
            )}
          </button>
          {fbDone && (
            <span className="text-xs" style={{ color: "#6b7280" }}>Image downloaded — attach it in the Facebook post!</span>
          )}

          <button
            type="button"
            onClick={handleShareSMS}
            title="Send via SMS / Messages app"
            className="flex items-center gap-2 rounded-xl font-bold text-sm px-4 py-2.5 transition hover:brightness-110 text-white"
            style={{ background: "#22c55e" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
              <path d="M20 2H4c-1.103 0-2 .897-2 2v18l4-4h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-3 9H7V9h10v2zm0-4H7V5h10v2z"/>
            </svg>
            SMS
          </button>
        </div>
      </div>
    </div>
  );
}
