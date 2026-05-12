"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const PUZZLES = [
  { id: 1, name: "Mav & Moony", image: "/FT-Tshirtfront.png", emoji: "🐾", desc: "The Faith Tails crew!" },
  { id: 2, name: "Detective Mav", image: "/FT-flatearth-tee.png", emoji: "🔍", desc: "Mav on the case!" },
  { id: 3, name: "Boricua for Jesus", image: "/Boriqua-Tee-front.png", emoji: "✝️", desc: "Representing Jesus!" },
];

const DIFFICULTIES = [
  { label: "Easy", grid: 3, emoji: "⭐" },
  { label: "Medium", grid: 4, emoji: "⭐⭐" },
  { label: "Hard", grid: 5, emoji: "⭐⭐⭐" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BiblePuzzle() {
  const [screen, setScreen] = useState<"pick-puzzle" | "pick-difficulty" | "playing" | "complete">("pick-puzzle");
  const [selectedPuzzle, setSelectedPuzzle] = useState(PUZZLES[0]);
  const [selectedDiff, setSelectedDiff] = useState(DIFFICULTIES[0]);

  // pieces[i] = the correct piece ID currently in slot i
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);

  const N = selectedDiff.grid;
  const total = N * N;
  const PUZZLE_SIZE = 360;
  const pieceSize = PUZZLE_SIZE / N;

  // Timer
  useEffect(() => {
    if (screen !== "playing" || complete) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 500);
    return () => clearInterval(id);
  }, [screen, complete, startTime]);

  function startGame() {
    const arr = shuffle(Array.from({ length: total }, (_, i) => i));
    setPieces(arr);
    setSelected(null);
    setMoves(0);
    setComplete(false);
    setStartTime(Date.now());
    setElapsed(0);
    setScreen("playing");
  }

  function handleTileClick(slotIndex: number) {
    if (complete) return;

    if (selected === null) {
      setSelected(slotIndex);
    } else {
      if (selected === slotIndex) {
        setSelected(null);
        return;
      }
      // Swap
      setPieces((prev) => {
        const next = [...prev];
        [next[selected], next[slotIndex]] = [next[slotIndex], next[selected]];
        return next;
      });
      setMoves((m) => m + 1);
      setSelected(null);
    }
  }

  // Check complete
  useEffect(() => {
    if (screen !== "playing" || pieces.length === 0) return;
    if (pieces.every((p, i) => p === i)) {
      setComplete(true);
    }
  }, [pieces, screen]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // ── Pick Puzzle Screen ────────────────────────────────────────────────────
  if (screen === "pick-puzzle") {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center">
          <div className="text-5xl mb-3">🧩</div>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>Pick Your Puzzle</h2>
          <p className="text-sm mt-1" style={{ color: "#7a6f60" }}>Choose a picture to put together!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl">
          {PUZZLES.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => { setSelectedPuzzle(puzzle); setScreen("pick-difficulty"); }}
              className="flex flex-col items-center rounded-3xl overflow-hidden transition hover:scale-105 active:scale-95"
              style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.10)", border: `2px solid transparent` }}
            >
              <div className="relative w-full" style={{ aspectRatio: "1/1", background: "#f5f5f5" }}>
                <Image src={puzzle.image} alt={puzzle.name} fill className="object-contain p-3" />
              </div>
              <div className="py-3 px-4 text-center w-full" style={{ background: NAVY }}>
                <p className="text-sm font-black text-white">{puzzle.emoji} {puzzle.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{puzzle.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Pick Difficulty Screen ────────────────────────────────────────────────
  if (screen === "pick-difficulty") {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        <div className="text-center">
          <div className="text-5xl mb-3">🎯</div>
          <h2 className="text-2xl font-black" style={{ color: NAVY }}>How Hard?</h2>
          <p className="text-sm mt-1" style={{ color: "#7a6f60" }}>Pick your challenge level</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-xl">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.label}
              onClick={() => { setSelectedDiff(diff); }}
              className="flex flex-col items-center gap-2 p-6 rounded-3xl transition hover:scale-105 active:scale-95"
              style={{
                background: selectedDiff.label === diff.label ? NAVY : "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: `3px solid ${selectedDiff.label === diff.label ? GOLD : "transparent"}`,
              }}
            >
              <span className="text-3xl">{diff.emoji}</span>
              <span className="font-black text-lg" style={{ color: selectedDiff.label === diff.label ? "white" : NAVY }}>
                {diff.label}
              </span>
              <span className="text-xs" style={{ color: selectedDiff.label === diff.label ? "rgba(255,255,255,0.7)" : "#9a8f80" }}>
                {diff.grid}×{diff.grid} = {diff.grid * diff.grid} pieces
              </span>
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setScreen("pick-puzzle")}
            className="px-6 py-3 rounded-2xl font-bold text-sm transition hover:opacity-80"
            style={{ background: "#e8e3d8", color: NAVY }}
          >
            ← Back
          </button>
          <button
            onClick={startGame}
            className="px-8 py-3 rounded-2xl font-black text-sm transition hover:opacity-90 hover:scale-105"
            style={{ background: GOLD, color: NAVY }}
          >
            Start Puzzle! 🧩
          </button>
        </div>
      </div>
    );
  }

  // ── Playing Screen ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-xl">
        <button
          onClick={() => setScreen("pick-puzzle")}
          className="text-xs font-bold px-4 py-2 rounded-xl transition hover:opacity-80"
          style={{ background: "#e8e3d8", color: NAVY }}
        >
          ← Menu
        </button>
        <div className="text-center">
          <p className="text-sm font-black" style={{ color: NAVY }}>{selectedPuzzle.emoji} {selectedPuzzle.name}</p>
          <p className="text-xs" style={{ color: "#9a8f80" }}>{selectedDiff.label} · {total} pieces</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold" style={{ color: "#9a8f80" }}>Moves</p>
          <p className="text-lg font-black" style={{ color: NAVY }}>{moves}</p>
        </div>
      </div>

      {/* Timer */}
      {!complete && (
        <div className="text-sm font-bold" style={{ color: "#9a8f80" }}>
          ⏱ {formatTime(elapsed)}
        </div>
      )}

      {/* Reference image */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#9a8f80" }}>Goal</p>
        <div
          className="relative rounded-xl overflow-hidden"
          style={{ width: 80, height: 80, border: `2px solid ${GOLD}` }}
        >
          <Image src={selectedPuzzle.image} alt="goal" fill className="object-contain" />
        </div>
      </div>

      {/* Puzzle grid */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: PUZZLE_SIZE,
          height: PUZZLE_SIZE,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          border: `3px solid ${GOLD}`,
        }}
      >
        {pieces.map((pieceId, slotIndex) => {
          const slotRow = Math.floor(slotIndex / N);
          const slotCol = slotIndex % N;
          const pieceRow = Math.floor(pieceId / N);
          const pieceCol = pieceId % N;
          const isSelected = selected === slotIndex;
          const isCorrect = pieceId === slotIndex;

          return (
            <button
              key={slotIndex}
              onClick={() => handleTileClick(slotIndex)}
              className="absolute transition-all"
              style={{
                width: pieceSize,
                height: pieceSize,
                left: slotCol * pieceSize,
                top: slotRow * pieceSize,
                backgroundImage: `url(${selectedPuzzle.image})`,
                backgroundSize: `${PUZZLE_SIZE}px ${PUZZLE_SIZE}px`,
                backgroundPosition: `-${pieceCol * pieceSize}px -${pieceRow * pieceSize}px`,
                outline: isSelected
                  ? `4px solid ${GOLD}`
                  : isCorrect && complete
                  ? `2px solid #22c55e`
                  : `1px solid rgba(255,255,255,0.3)`,
                filter: isSelected ? "brightness(1.15)" : "none",
                zIndex: isSelected ? 10 : 1,
                transform: isSelected ? "scale(1.04)" : "scale(1)",
                cursor: "pointer",
              }}
            />
          );
        })}

        {/* Complete overlay */}
        {complete && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl"
            style={{ background: "rgba(26,38,64,0.88)", zIndex: 20 }}
          >
            <div className="text-5xl animate-bounce">🎉</div>
            <p className="text-2xl font-black text-white">You did it!</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              {moves} moves · {formatTime(elapsed)}
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={startGame}
                className="px-5 py-2 rounded-xl font-black text-sm transition hover:opacity-90"
                style={{ background: GOLD, color: NAVY }}
              >
                Play Again
              </button>
              <button
                onClick={() => setScreen("pick-puzzle")}
                className="px-5 py-2 rounded-xl font-black text-sm transition hover:opacity-90"
                style={{ background: "white", color: NAVY }}
              >
                New Puzzle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      {!complete && (
        <p className="text-xs text-center" style={{ color: "#9a8f80" }}>
          Tap a piece to select it, then tap where you want it to go 👆
        </p>
      )}

      {/* New game button */}
      {!complete && (
        <button
          onClick={startGame}
          className="text-xs font-bold px-5 py-2 rounded-xl transition hover:opacity-80"
          style={{ background: "#e8e3d8", color: NAVY }}
        >
          🔀 Shuffle Again
        </button>
      )}
    </div>
  );
}
