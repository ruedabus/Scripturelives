"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ── Design tokens ──────────────────────────────────────────────
const NAVY = "#1a2640";
const GOLD = "#C9952A";

// ── Color palette ──────────────────────────────────────────────
const PALETTE = [
  "#000000", "#ffffff", "#ef4444", "#f97316", "#eab308",
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
  "#a16207", "#6b7280", "#fde68a", "#bbf7d0", "#bfdbfe",
  "#fecaca", "#fed7aa", "#e9d5ff", "#fce7f3", "#ccfbf1",
];

type Tool = "brush" | "fill" | "eraser";

interface ColoringToolProps {
  bookSlug:   string;
  bookTitle:  string;
  totalPages: number;
  onClose:    () => void;
}

// ── Flood fill (paint bucket) ──────────────────────────────────
function floodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fillColor: string,
) {
  const canvas = ctx.canvas;
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const idx = (px: number, py: number) => (py * canvas.width + px) * 4;
  const start = idx(Math.floor(x), Math.floor(y));

  const targetR = data[start];
  const targetG = data[start + 1];
  const targetB = data[start + 2];
  const targetA = data[start + 3];

  // Parse fill colour
  const tmp = document.createElement("canvas");
  tmp.width = tmp.height = 1;
  const tc = tmp.getContext("2d")!;
  tc.fillStyle = fillColor;
  tc.fillRect(0, 0, 1, 1);
  const [fr, fg, fb, fa] = tc.getImageData(0, 0, 1, 1).data;

  // Don't refill same colour
  if (targetR === fr && targetG === fg && targetB === fb && targetA === fa) return;

  const tolerance = 30;
  const matches = (i: number) =>
    Math.abs(data[i]     - targetR) <= tolerance &&
    Math.abs(data[i + 1] - targetG) <= tolerance &&
    Math.abs(data[i + 2] - targetB) <= tolerance &&
    Math.abs(data[i + 3] - targetA) <= tolerance;

  const queue: number[] = [Math.floor(x) + Math.floor(y) * canvas.width];
  const visited = new Uint8Array(canvas.width * canvas.height);

  while (queue.length) {
    const pos = queue.pop()!;
    if (visited[pos]) continue;
    visited[pos] = 1;

    const i = pos * 4;
    if (!matches(i)) continue;

    data[i]     = fr;
    data[i + 1] = fg;
    data[i + 2] = fb;
    data[i + 3] = fa;

    const px = pos % canvas.width;
    const py = Math.floor(pos / canvas.width);
    if (px > 0)                  queue.push(pos - 1);
    if (px < canvas.width - 1)   queue.push(pos + 1);
    if (py > 0)                  queue.push(pos - canvas.width);
    if (py < canvas.height - 1)  queue.push(pos + canvas.width);
  }

  ctx.putImageData(imgData, 0, 0);
}

// ── Component ──────────────────────────────────────────────────
export default function ColoringTool({
  bookSlug,
  bookTitle,
  totalPages,
  onClose,
}: ColoringToolProps) {
  const [page,       setPage]       = useState(1);
  const [tool,       setTool]       = useState<Tool>("fill");
  const [color,      setColor]      = useState("#3b82f6");
  const [brushSize,  setBrushSize]  = useState(12);
  const [imgLoaded,  setImgLoaded]  = useState(false);

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const baseImgRef  = useRef<HTMLImageElement | null>(null);
  const historyRef  = useRef<ImageData[]>([]);
  const isDrawing   = useRef(false);

  const imgSrc = `/coloring/episode${
    // map slug → episode number
    ({
      "moon-adventure":           1,
      "lions-den":                2,
      "riders-of-the-ark":        3,
      "camping-adventure":        4,
      "big-fish-adventure":       5,
      "great-american-road-trip": 6,
      "miracle-at-the-tomb":      7,
      "giant-storm":              8,
    } as Record<string, number>)[bookSlug] ?? 1
  }/page-${page}.jpg`;

  // ── Load image onto canvas ─────────────────────────────────
  const loadImageToCanvas = useCallback((src: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setImgLoaded(false);
    historyRef.current = [];

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      baseImgRef.current = img;
      historyRef.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
      setImgLoaded(true);
    };
    img.src = src;
  }, []);

  useEffect(() => { loadImageToCanvas(imgSrc); }, [imgSrc, loadImageToCanvas]);

  // ── Save history snapshot ──────────────────────────────────
  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    historyRef.current = [
      ...historyRef.current.slice(-19),
      ctx.getImageData(0, 0, canvas.width, canvas.height),
    ];
  }, []);

  // ── Undo ──────────────────────────────────────────────────
  const undo = useCallback(() => {
    if (historyRef.current.length <= 1) return;
    historyRef.current.pop();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(historyRef.current[historyRef.current.length - 1], 0, 0);
  }, []);

  // ── Canvas coordinates ────────────────────────────────────
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  };

  // ── Draw ──────────────────────────────────────────────────
  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fillStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.fill();
  }, [tool, color, brushSize]);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !imgLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getPos(e);

    if (tool === "fill") {
      saveSnapshot();
      floodFill(ctx, x, y, color);
    } else {
      saveSnapshot();
      isDrawing.current = true;
      draw(x, y);
    }
  }, [tool, color, imgLoaded, draw, saveSnapshot]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const { x, y } = getPos(e);
    draw(x, y);
  }, [draw]);

  const handlePointerUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  // ── Print ─────────────────────────────────────────────────
  const handlePrint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>${bookTitle} — Page ${page}</title>
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        img  { max-width: 100%; max-height: 100vh; }
        @media print { body { margin: 0; } }
      </style></head>
      <body><img src="${dataUrl}" onload="window.print()"/></body></html>
    `);
    win.document.close();
  }, [bookTitle, page]);

  // ── Download ──────────────────────────────────────────────
  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${bookSlug}-page-${page}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }, [bookSlug, page]);

  // ── Keyboard shortcuts ────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
      if (e.key === "b") setTool("brush");
      if (e.key === "f") setTool("fill");
      if (e.key === "e") setTool("eraser");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, undo]);

  const toolBtn = (t: Tool, label: string, shortcut: string) => (
    <button
      onClick={() => setTool(t)}
      title={`${label} (${shortcut})`}
      className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs font-bold transition"
      style={{
        background: tool === t ? GOLD : "rgba(255,255,255,0.08)",
        color:      tool === t ? NAVY : "rgba(255,255,255,0.7)",
      }}
    >
      <span style={{ fontSize: 16 }}>
        {t === "brush" ? "✏️" : t === "fill" ? "🪣" : "⬜"}
      </span>
      {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(10,15,28,0.97)" }}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-3 py-2 shrink-0 gap-2 flex-wrap"
        style={{ background: NAVY, borderBottom: `1px solid rgba(201,149,42,0.2)` }}
      >
        <span className="text-sm font-bold truncate" style={{ color: GOLD }}>
          🎨 {bookTitle}
        </span>

        {/* Tools */}
        <div className="flex items-center gap-1.5">
          {toolBtn("fill",   "Fill",   "F")}
          {toolBtn("brush",  "Brush",  "B")}
          {toolBtn("eraser", "Eraser", "E")}
        </div>

        {/* Brush size (only for brush/eraser) */}
        {tool !== "fill" && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Size</span>
            <input
              type="range" min={4} max={40} value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-20 accent-yellow-400"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
            title="Undo (Ctrl+Z)"
          >
            ↩ Undo
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
          >
            🖨 Print
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
          >
            💾 Save
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full transition hover:opacity-70 ml-1"
            style={{ width: 30, height: 30, background: "rgba(255,255,255,0.08)", color: "white" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Color palette ── */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 flex-wrap shrink-0"
        style={{ background: "rgba(0,0,0,0.4)", borderBottom: `1px solid rgba(255,255,255,0.05)` }}
      >
        {PALETTE.map((c) => (
          <button
            key={c}
            onClick={() => { setColor(c); if (tool === "eraser") setTool("fill"); }}
            className="rounded-full transition hover:scale-110 active:scale-95"
            style={{
              width:  28,
              height: 28,
              background: c,
              border: c === color
                ? `3px solid ${GOLD}`
                : c === "#ffffff"
                ? "2px solid rgba(255,255,255,0.3)"
                : "2px solid transparent",
              boxShadow: c === color ? `0 0 0 1px ${NAVY}` : undefined,
            }}
            title={c}
          />
        ))}
        {/* Custom color picker */}
        <label
          className="rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
          style={{ width: 28, height: 28, background: "rgba(255,255,255,0.1)", border: "2px dashed rgba(255,255,255,0.3)" }}
          title="Custom color"
        >
          <span style={{ fontSize: 14 }}>＋</span>
          <input
            type="color"
            className="sr-only"
            value={color}
            onChange={(e) => { setColor(e.target.value); if (tool === "eraser") setTool("fill"); }}
          />
        </label>
      </div>

      {/* ── Canvas area ── */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4">
        {!imgLoaded && (
          <div className="flex items-center justify-center w-full h-full">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: `${GOLD} transparent transparent transparent` }}
            />
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-2xl"
          style={{
            maxWidth:    "100%",
            cursor:      tool === "fill" ? "crosshair" : "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\"><circle cx=\"8\" cy=\"8\" r=\"7\" fill=\"none\" stroke=\"black\" stroke-width=\"1.5\"/></svg>') 8 8, crosshair",
            touchAction: "none",
            display:     imgLoaded ? "block" : "none",
            background:  "#ffffff",
          }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />
      </div>

      {/* ── Bottom nav bar ── */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-2"
        style={{ background: NAVY, borderTop: `1px solid rgba(201,149,42,0.2)` }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="flex items-center justify-center rounded-full transition hover:opacity-80 disabled:opacity-20"
          style={{ width: 40, height: 40, background: "rgba(255,255,255,0.08)", color: "white", fontSize: 16 }}
        >
          ◀
        </button>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
            Page {page} of {totalPages}
          </span>
          {/* Progress bar */}
          <div className="w-40 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div
              className="h-1 rounded-full transition-all"
              style={{ background: GOLD, width: `${(page / totalPages) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="flex items-center justify-center rounded-full transition hover:opacity-80 disabled:opacity-20"
          style={{ width: 40, height: 40, background: "rgba(255,255,255,0.08)", color: "white", fontSize: 16 }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
