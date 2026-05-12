"use client";

import { useState, useEffect } from "react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const PUZZLES = [
  { id: 1, name: "Mav & Moony", image: "/FT-Tshirtfront.png",    emoji: "🐾", desc: "The Faith Tails crew!" },
  { id: 2, name: "Detective Mav", image: "/FT-flatearth-tee.png", emoji: "🔍", desc: "Mav on the case!" },
  { id: 3, name: "Boricua for Jesus", image: "/Boriqua-Tee-front.png", emoji: "✝️", desc: "For Jesus!" },
];

const DIFFICULTIES = [
  { label: "Easy",   grid: 3, emoji: "⭐" },
  { label: "Medium", grid: 4, emoji: "⭐⭐" },
  { label: "Hard",   grid: 5, emoji: "⭐⭐⭐" },
];

// ── Jigsaw math ───────────────────────────────────────────────────────────────

type Side = 1 | -1 | 0;
interface Shape { top: Side; right: Side; bottom: Side; left: Side; }

function generateShapes(N: number): Shape[] {
  const hTabs = Array.from({ length: N - 1 }, () =>
    Array.from({ length: N }, () => (Math.random() > 0.5 ? 1 : -1))
  );
  const vTabs = Array.from({ length: N }, () =>
    Array.from({ length: N - 1 }, () => (Math.random() > 0.5 ? 1 : -1))
  );
  return Array.from({ length: N * N }, (_, i) => {
    const r = Math.floor(i / N), c = i % N;
    return {
      top:    r === 0     ? 0 : (-hTabs[r - 1][c] as Side),
      bottom: r === N - 1 ? 0 : (hTabs[r][c] as Side),
      left:   c === 0     ? 0 : (-vTabs[r][c - 1] as Side),
      right:  c === N - 1 ? 0 : (vTabs[r][c] as Side),
    };
  });
}

function jigsawPath(w: number, h: number, s: Shape, t: number): string {
  const p: string[] = ["M 0 0"];

  // Top (left → right)
  if (s.top === 0) p.push(`L ${w} 0`);
  else { const d = s.top;
    p.push(`L ${w*.3} 0 C ${w*.3} ${-d*t*.5} ${w*.45} ${-d*t} ${w*.5} ${-d*t} C ${w*.55} ${-d*t} ${w*.7} ${-d*t*.5} ${w*.7} 0 L ${w} 0`); }

  // Right (top → bottom)
  if (s.right === 0) p.push(`L ${w} ${h}`);
  else { const d = s.right;
    p.push(`L ${w} ${h*.3} C ${w+d*t*.5} ${h*.3} ${w+d*t} ${h*.45} ${w+d*t} ${h*.5} C ${w+d*t} ${h*.55} ${w+d*t*.5} ${h*.7} ${w} ${h*.7} L ${w} ${h}`); }

  // Bottom (right → left)
  if (s.bottom === 0) p.push(`L 0 ${h}`);
  else { const d = s.bottom;
    p.push(`L ${w*.7} ${h} C ${w*.7} ${h+d*t*.5} ${w*.55} ${h+d*t} ${w*.5} ${h+d*t} C ${w*.45} ${h+d*t} ${w*.3} ${h+d*t*.5} ${w*.3} ${h} L 0 ${h}`); }

  // Left (bottom → top)
  if (s.left === 0) p.push(`L 0 0`);
  else { const d = s.left;
    p.push(`L 0 ${h*.7} C ${-d*t*.5} ${h*.7} ${-d*t} ${h*.55} ${-d*t} ${h*.5} C ${-d*t} ${h*.45} ${-d*t*.5} ${h*.3} 0 ${h*.3} L 0 0`); }

  p.push("Z");
  return p.join(" ");
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Piece SVG ─────────────────────────────────────────────────────────────────

function PieceSVG({
  pieceId, N, image, shapes, puzzleSize,
  isSelected, isPlaced, flashWrong, onClick, uid,
}: {
  pieceId: number; N: number; image: string; shapes: Shape[]; puzzleSize: number;
  isSelected: boolean; isPlaced: boolean; flashWrong: boolean;
  onClick: () => void; uid: string;
}) {
  const r = Math.floor(pieceId / N), c = pieceId % N;
  const pw = puzzleSize / N;
  const t  = pw * 0.28;
  const m  = t + 2;
  const shape = shapes[pieceId];
  const path  = jigsawPath(pw, pw, shape, t);
  const svgSz = pw + 2 * m;

  const borderColor = flashWrong ? "#ef4444" : isSelected ? GOLD : isPlaced ? "#22c55e" : "rgba(255,255,255,0.55)";
  const borderWidth = isSelected || flashWrong || isPlaced ? 3 : 1;

  return (
    <svg
      width={svgSz} height={svgSz}
      viewBox={`${-m} ${-m} ${svgSz} ${svgSz}`}
      onClick={onClick}
      style={{ cursor: isPlaced ? "default" : "pointer", display: "block", overflow: "visible" }}
    >
      <defs>
        <clipPath id={`${uid}-cp-${pieceId}`}>
          <path d={path} />
        </clipPath>
      </defs>

      {/* Drop shadow for tray pieces */}
      {!isPlaced && (
        <path d={path} fill="rgba(0,0,0,0.18)" transform="translate(2,3)" />
      )}

      {/* Image clipped to jigsaw shape */}
      <image
        href={image}
        x={-c * pw} y={-r * pw}
        width={puzzleSize} height={puzzleSize}
        clipPath={`url(#${uid}-cp-${pieceId})`}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* Outline */}
      <path d={path} fill="none" stroke={borderColor} strokeWidth={borderWidth} />

      {/* Selection glow */}
      {isSelected && (
        <path d={path} fill="rgba(201,149,42,0.15)" />
      )}
    </svg>
  );
}

// ── Main Game ─────────────────────────────────────────────────────────────────

export default function BiblePuzzle() {
  const [screen, setScreen] = useState<"pick" | "difficulty" | "playing">("pick");
  const [puzzle, setPuzzle]   = useState(PUZZLES[0]);
  const [diff,   setDiff]     = useState(DIFFICULTIES[0]);
  const [shapes, setShapes]   = useState<Shape[]>([]);
  const [tray,   setTray]     = useState<number[]>([]);
  const [placed, setPlaced]   = useState<Set<number>>(new Set());
  const [selected,  setSelected]  = useState<number | null>(null);
  const [flashWrong, setFlashWrong] = useState<number | null>(null); // slotId that got wrong piece
  const [moves, setMoves]   = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [uid] = useState(() => Math.random().toString(36).slice(2));

  const N = diff.grid;
  const PUZZLE_SIZE = Math.min(300, typeof window !== "undefined" ? window.innerWidth - 48 : 300);
  const pw = PUZZLE_SIZE / N;
  const t  = pw * 0.28;
  const m  = t + 2;

  // Timer
  useEffect(() => {
    if (screen !== "playing" || placed.size === N * N) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(id);
  }, [screen, placed.size, N, startTime]);

  function startGame() {
    const s = generateShapes(diff.grid);
    const shuffled = shuffle(Array.from({ length: diff.grid * diff.grid }, (_, i) => i));
    setShapes(s);
    setTray(shuffled);
    setPlaced(new Set());
    setSelected(null);
    setFlashWrong(null);
    setMoves(0);
    setStartTime(Date.now());
    setElapsed(0);
    setScreen("playing");
  }

  function handleTrayClick(pieceId: number) {
    setSelected(s => s === pieceId ? null : pieceId);
    setFlashWrong(null);
  }

  function handleSlotClick(slotId: number) {
    if (selected === null) return;
    if (selected === slotId) {
      // Correct!
      setPlaced(p => new Set([...p, slotId]));
      setTray(t => t.filter(id => id !== slotId));
      setSelected(null);
      setMoves(m => m + 1);
    } else {
      // Wrong slot
      setFlashWrong(slotId);
      setMoves(m => m + 1);
      setTimeout(() => setFlashWrong(null), 600);
    }
  }

  function formatTime(s: number) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  }

  const complete = placed.size === N * N && screen === "playing";

  // ── Pick puzzle ──────────────────────────────────────────────────────────
  if (screen === "pick") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        <div className="text-center">
          <div className="text-5xl mb-2">🧩</div>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Pick Your Puzzle</h2>
          <p className="text-sm mt-1" style={{ color: "#7a6f60" }}>Choose a picture to put together!</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
          {PUZZLES.map(p => (
            <button
              key={p.id}
              onClick={() => { setPuzzle(p); setScreen("difficulty"); }}
              className="flex flex-col rounded-3xl overflow-hidden transition hover:scale-105 active:scale-95"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
            >
              <div className="relative w-full" style={{ aspectRatio: "1/1", background: "#f5f5f5" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4" />
              </div>
              <div className="py-3 px-3 text-center" style={{ background: NAVY }}>
                <p className="text-sm font-black text-white">{p.emoji} {p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Pick difficulty ──────────────────────────────────────────────────────
  if (screen === "difficulty") {
    return (
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        <div className="text-center">
          <div className="text-5xl mb-2">🎯</div>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>How Hard?</h2>
          <p className="text-sm mt-1" style={{ color: "#7a6f60" }}>Pick your challenge level</p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {DIFFICULTIES.map(d => (
            <button
              key={d.label}
              onClick={() => setDiff(d)}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl transition hover:scale-105"
              style={{
                background: diff.label === d.label ? NAVY : "white",
                border: `3px solid ${diff.label === d.label ? GOLD : "transparent"}`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            >
              <span className="text-2xl">{d.emoji}</span>
              <span className="font-black text-sm" style={{ color: diff.label === d.label ? "white" : NAVY }}>{d.label}</span>
              <span className="text-xs" style={{ color: diff.label === d.label ? "rgba(255,255,255,0.65)" : "#9a8f80" }}>
                {d.grid}×{d.grid}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setScreen("pick")}
            className="px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: "#e8e3d8", color: NAVY }}>
            ← Back
          </button>
          <button onClick={startGame}
            className="px-7 py-2.5 rounded-xl font-black text-sm transition hover:opacity-90 hover:scale-105"
            style={{ background: GOLD, color: NAVY }}>
            Start! 🧩
          </button>
        </div>
      </div>
    );
  }

  // ── Playing ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-5 py-6 px-4">

      {/* Header bar */}
      <div className="flex items-center justify-between w-full max-w-sm">
        <button onClick={() => setScreen("pick")}
          className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: "#e8e3d8", color: NAVY }}>
          ← Menu
        </button>
        <div className="text-center">
          <p className="text-sm font-black" style={{ color: NAVY }}>{puzzle.emoji} {puzzle.name}</p>
          <p className="text-xs" style={{ color: "#9a8f80" }}>{diff.label} · {N*N} pieces</p>
        </div>
        <div className="text-right text-xs font-bold" style={{ color: "#9a8f80" }}>
          <div>⏱ {formatTime(elapsed)}</div>
          <div>Moves: {moves}</div>
        </div>
      </div>

      {/* Reference image */}
      <div className="flex items-center gap-3 rounded-2xl px-4 py-2"
        style={{ background: "rgba(201,149,42,0.1)", border: `1px solid rgba(201,149,42,0.25)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={puzzle.image} alt="goal" style={{ width: 48, height: 48, objectFit: "contain", borderRadius: 8 }} />
        <p className="text-xs font-bold" style={{ color: NAVY }}>
          {selected !== null
            ? `Piece selected! Tap where it goes 👆`
            : complete
            ? `🎉 Puzzle complete!`
            : `Tap a piece below, then tap its spot`}
        </p>
      </div>

      {/* Board */}
      <div style={{ position: "relative", width: PUZZLE_SIZE + 2 * m, height: PUZZLE_SIZE + 2 * m, flexShrink: 0 }}>
        {Array.from({ length: N * N }, (_, slotId) => {
          const sr = Math.floor(slotId / N), sc = slotId % N;
          const shape = shapes[slotId] ?? { top: 0, bottom: 0, left: 0, right: 0 };
          const path  = jigsawPath(pw, pw, shape, t);
          const svgSz = pw + 2 * m;
          const isOcc = placed.has(slotId);
          const isFlash = flashWrong === slotId;

          return (
            <div key={slotId} style={{ position: "absolute", left: sc * pw, top: sr * pw }}>
              {isOcc ? (
                <PieceSVG
                  pieceId={slotId} N={N} image={puzzle.image} shapes={shapes}
                  puzzleSize={PUZZLE_SIZE} isSelected={false} isPlaced flashWrong={false}
                  onClick={() => {}} uid={uid}
                />
              ) : (
                <svg width={svgSz} height={svgSz} viewBox={`${-m} ${-m} ${svgSz} ${svgSz}`}
                  onClick={() => handleSlotClick(slotId)}
                  style={{ cursor: selected !== null ? "pointer" : "default", display: "block", overflow: "visible" }}>
                  <path d={path}
                    fill={isFlash ? "rgba(239,68,68,0.15)" : "rgba(201,149,42,0.06)"}
                    stroke={isFlash ? "#ef4444" : "rgba(201,149,42,0.35)"}
                    strokeWidth={isFlash ? 2.5 : 1.5}
                    strokeDasharray={isFlash ? "0" : "5 3"}
                  />
                </svg>
              )}
            </div>
          );
        })}

        {/* Complete overlay */}
        {complete && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ background: "rgba(26,38,64,0.88)", zIndex: 20 }}>
            <div className="text-5xl">🎉</div>
            <p className="text-2xl font-black text-white">You did it!</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              {moves} moves · {formatTime(elapsed)}
            </p>
            <div className="flex gap-3 mt-1">
              <button onClick={startGame}
                className="px-5 py-2 rounded-xl font-black text-sm"
                style={{ background: GOLD, color: NAVY }}>
                Play Again
              </button>
              <button onClick={() => setScreen("pick")}
                className="px-5 py-2 rounded-xl font-black text-sm"
                style={{ background: "white", color: NAVY }}>
                New Puzzle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tray */}
      {!complete && tray.length > 0 && (
        <div className="w-full max-w-lg">
          <p className="text-xs font-bold text-center mb-3 uppercase tracking-widest" style={{ color: "#9a8f80" }}>
            Pieces — tap one to pick it up
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {tray.map(pieceId => (
              <PieceSVG
                key={pieceId} pieceId={pieceId} N={N} image={puzzle.image}
                shapes={shapes} puzzleSize={PUZZLE_SIZE}
                isSelected={selected === pieceId} isPlaced={false}
                flashWrong={false}
                onClick={() => handleTrayClick(pieceId)} uid={uid}
              />
            ))}
          </div>
        </div>
      )}

      {/* Shuffle */}
      {!complete && (
        <button onClick={startGame}
          className="text-xs font-bold px-4 py-2 rounded-xl transition hover:opacity-80"
          style={{ background: "#e8e3d8", color: NAVY }}>
          🔀 New Shuffle
        </button>
      )}
    </div>
  );
}
