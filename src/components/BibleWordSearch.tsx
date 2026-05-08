"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { wordSearchPuzzles, type WordSearchPuzzle } from "@/data/wordSearchPuzzles";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";
const BORDER = "#ede8de";

// ── Grid constants ────────────────────────────────────────────────────────────
const GRID_SIZE = 12;

// Colours cycling through found words
const WORD_COLORS = [
  { bg: "rgba(201,149,42,0.22)",  border: "#C9952A", text: NAVY },
  { bg: "rgba(59,130,246,0.20)",  border: "#3b82f6", text: "#1e40af" },
  { bg: "rgba(16,185,129,0.20)",  border: "#10b981", text: "#065f46" },
  { bg: "rgba(139,92,246,0.20)",  border: "#8b5cf6", text: "#5b21b6" },
  { bg: "rgba(236,72,153,0.20)",  border: "#ec4899", text: "#9d174d" },
  { bg: "rgba(239,68,68,0.20)",   border: "#ef4444", text: "#991b1b" },
  { bg: "rgba(245,158,11,0.20)",  border: "#f59e0b", text: "#92400e" },
  { bg: "rgba(20,184,166,0.20)",  border: "#14b8a6", text: "#115e59" },
  { bg: "rgba(99,102,241,0.20)",  border: "#6366f1", text: "#3730a3" },
  { bg: "rgba(34,197,94,0.20)",   border: "#22c55e", text: "#14532d" },
  { bg: "rgba(249,115,22,0.20)",  border: "#f97316", text: "#9a3412" },
  { bg: "rgba(168,85,247,0.20)",  border: "#a855f7", text: "#581c87" },
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Cell = { row: number; col: number };
type Direction = [number, number]; // [dRow, dCol]
type PlacedWord = {
  word: string;
  cells: Cell[];
  colorIdx: number;
};

// ── Seeded random (same as Wordle — deterministic daily puzzle) ───────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff);
  };
}

function getDayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function getPuzzle(): WordSearchPuzzle {
  const day = getDayIndex();
  return wordSearchPuzzles[day % wordSearchPuzzles.length];
}

function getPuzzleSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// ── Grid builder ──────────────────────────────────────────────────────────────
const DIRECTIONS: Direction[] = [
  [0, 1],   // right
  [0, -1],  // left
  [1, 0],   // down
  [-1, 0],  // up
  [1, 1],   // down-right
  [1, -1],  // down-left
  [-1, 1],  // up-right
  [-1, -1], // up-left
];

function buildGrid(words: string[], seed: number): { grid: string[][]; placed: PlacedWord[] } {
  const rng = seededRandom(seed);

  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill("")
  );

  const placed: PlacedWord[] = [];

  // Sort words longest-first for better fit
  const sorted = [...words].sort((a, b) => b.length - a.length);

  for (let wi = 0; wi < sorted.length; wi++) {
    const word = sorted[wi];
    let success = false;

    // Try up to 200 random placements
    for (let attempt = 0; attempt < 200 && !success; attempt++) {
      const dirIdx = Math.floor(rng() * DIRECTIONS.length);
      const [dr, dc] = DIRECTIONS[dirIdx];
      const row = Math.floor(rng() * GRID_SIZE);
      const col = Math.floor(rng() * GRID_SIZE);

      // Check fit
      const cells: Cell[] = [];
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) { fits = false; break; }
        const existing = grid[r][c];
        if (existing !== "" && existing !== word[i]) { fits = false; break; }
        cells.push({ row: r, col: c });
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          grid[cells[i].row][cells[i].col] = word[i];
        }
        placed.push({ word, cells, colorIdx: wi % WORD_COLORS.length });
        success = true;
      }
    }
    // If word couldn't be placed after 200 tries, skip it (shouldn't happen with 12x12 + 12 words)
  }

  // Fill empty cells with random uppercase letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = letters[Math.floor(rng() * letters.length)];
      }
    }
  }

  return { grid, placed };
}

// ── Local storage persistence ─────────────────────────────────────────────────
const LS_KEY = "scripture-lives-wordsearch";

interface SavedState {
  dateKey: string; // YYYY-MM-DD
  foundWords: string[];
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed: SavedState = JSON.parse(raw);
    if (parsed.dateKey !== getTodayKey()) return [];
    return parsed.foundWords ?? [];
  } catch { return []; }
}

function saveSaved(foundWords: string[]) {
  if (typeof window === "undefined") return;
  try {
    const state: SavedState = { dateKey: getTodayKey(), foundWords };
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function cellKey(r: number, c: number) { return `${r},${c}`; }

function cellsEqual(a: Cell, b: Cell) { return a.row === b.row && a.col === b.col; }

/** Returns true if cells a→b lie on the same line in any of the 8 directions */
function getLineCells(a: Cell, b: Cell): Cell[] | null {
  const dr = b.row - a.row;
  const dc = b.col - a.col;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [a];
  // Must be horizontal, vertical, or 45° diagonal
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  const sr = dr === 0 ? 0 : dr / Math.abs(dr);
  const sc = dc === 0 ? 0 : dc / Math.abs(dc);
  const cells: Cell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: a.row + sr * i, col: a.col + sc * i });
  }
  return cells;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BibleWordSearch() {
  const puzzle = getPuzzle();
  const seed   = getPuzzleSeed();

  // Grid is deterministic — compute once
  const { grid, placed } = useRef(buildGrid(puzzle.words, seed)).current;

  // Which words the user has found (by word string)
  const _savedWords = useRef<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);

  // Selection state: null = nothing selected, Cell = first cell chosen
  const [firstCell, setFirstCell]   = useState<Cell | null>(null);
  const [hoverCell, setHoverCell]   = useState<Cell | null>(null);
  const [flashWrong, setFlashWrong] = useState(false);
  const [flashWord,  setFlashWord]  = useState<string | null>(null); // just-found word
  const [showAll,    setShowAll]    = useState(false); // reveal mode

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadSaved();
    _savedWords.current = saved;
    setFoundWords(saved);
  }, []);

  // Persist when foundWords changes
  useEffect(() => {
    saveSaved(foundWords);
  }, [foundWords]);

  // ── Selection preview cells ───────────────────────────────────────────────
  const previewCells: Cell[] = (() => {
    if (!firstCell || !hoverCell) return firstCell ? [firstCell] : [];
    return getLineCells(firstCell, hoverCell) ?? [firstCell];
  })();

  // ── Check if selection matches a placed word ──────────────────────────────
  const checkSelection = useCallback((cells: Cell[]) => {
    if (cells.length < 2) return;

    for (const pw of placed) {
      if (foundWords.includes(pw.word)) continue;

      const forward  = pw.cells.every((c, i) => cellsEqual(c, cells[i]));
      const backward = pw.cells.every((c, i) => cellsEqual(c, cells[cells.length - 1 - i]));

      if ((forward || backward) && cells.length === pw.cells.length) {
        // Found!
        const next = [...foundWords, pw.word];
        setFoundWords(next);
        setFlashWord(pw.word);
        setTimeout(() => setFlashWord(null), 1200);
        return;
      }
    }

    // No match — flash wrong
    setFlashWrong(true);
    setTimeout(() => setFlashWrong(false), 500);
  }, [placed, foundWords]);

  // ── Cell click handler ────────────────────────────────────────────────────
  const handleCellClick = useCallback((r: number, c: number) => {
    const cell: Cell = { row: r, col: c };

    if (!firstCell) {
      // First tap: set start
      setFirstCell(cell);
      setHoverCell(null);
    } else if (cellsEqual(firstCell, cell)) {
      // Tapped same cell: deselect
      setFirstCell(null);
      setHoverCell(null);
    } else {
      // Second tap: attempt selection
      const line = getLineCells(firstCell, cell);
      if (line) {
        checkSelection(line);
      } else {
        // Not a valid line — start fresh from this cell
        setFirstCell(cell);
        setHoverCell(null);
        return;
      }
      setFirstCell(null);
      setHoverCell(null);
    }
  }, [firstCell, checkSelection]);

  // ── Colour map for found cells ────────────────────────────────────────────
  const foundCellMap = new Map<string, number>(); // key → colorIdx
  for (const pw of placed) {
    if (foundWords.includes(pw.word) || showAll) {
      for (const c of pw.cells) {
        foundCellMap.set(cellKey(c.row, c.col), pw.colorIdx);
      }
    }
  }

  const previewSet = new Set(previewCells.map((c) => cellKey(c.row, c.col)));
  const isFirstSelected = firstCell ? previewSet.has(cellKey(firstCell.row, firstCell.col)) : false;

  const allFound = foundWords.length === placed.length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center px-3 py-6 gap-6" style={{ background: CREAM, minHeight: "100%" }}>

      {/* ── Header ── */}
      <div className="text-center max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-px flex-1" style={{ background: BORDER }} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>
            Daily · {getTodayKey()}
          </span>
          <div className="h-px flex-1" style={{ background: BORDER }} />
        </div>
        <h2 className="text-xl font-black" style={{ color: NAVY }}>{puzzle.title}</h2>
        <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>Theme: {puzzle.theme}</p>
      </div>

      {/* ── Flash banner ── */}
      {flashWord && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-black text-white shadow-lg animate-bounce"
          style={{ background: GOLD, whiteSpace: "nowrap" }}
        >
          ✓ Found: {flashWord}!
        </div>
      )}

      {/* ── All found celebration ── */}
      {allFound && (
        <div
          className="w-full max-w-sm rounded-2xl p-5 text-center"
          style={{ background: "#fdf6e8", border: `1.5px solid ${GOLD}66` }}
        >
          <p className="text-3xl mb-2">🎉</p>
          <p className="font-black text-base" style={{ color: NAVY }}>Puzzle Complete!</p>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            You found all {placed.length} words. Come back tomorrow for a new puzzle!
          </p>
        </div>
      )}

      {/* ── Grid ── */}
      <div
        className="rounded-2xl overflow-hidden select-none"
        style={{
          border: `1.5px solid ${flashWrong ? "#ef4444" : BORDER}`,
          boxShadow: flashWrong
            ? "0 0 0 3px rgba(239,68,68,0.18)"
            : "0 4px 20px rgba(0,0,0,0.07)",
          transition: "border-color 0.2s, box-shadow 0.2s",
          background: "#fff",
        }}
      >
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((letter, c) => {
              const key = cellKey(r, c);
              const foundColorIdx = foundCellMap.get(key);
              const isFound  = foundColorIdx !== undefined;
              const isPreview = previewSet.has(key);
              const isFirst  = firstCell && cellsEqual(firstCell, { row: r, col: c });

              let bg     = "#fff";
              let color  = NAVY;
              let border = "1px solid #f0ece3";
              let fw: React.CSSProperties["fontWeight"] = 500;

              if (isFound) {
                const wc = WORD_COLORS[foundColorIdx!];
                bg     = wc.bg;
                color  = wc.text;
                border = `1px solid ${wc.border}44`;
                fw     = 700;
              } else if (isFirst) {
                bg     = NAVY;
                color  = "#fff";
                border = `1px solid ${NAVY}`;
                fw     = 700;
              } else if (isPreview) {
                bg     = `${GOLD}33`;
                color  = NAVY;
                border = `1px solid ${GOLD}88`;
                fw     = 700;
              }

              return (
                <button
                  key={c}
                  onClick={() => handleCellClick(r, c)}
                  onMouseEnter={() => firstCell && setHoverCell({ row: r, col: c })}
                  onMouseLeave={() => firstCell && setHoverCell(null)}
                  className="flex items-center justify-center font-mono transition-all duration-100"
                  style={{
                    width: "clamp(26px, 7.5vw, 40px)",
                    height: "clamp(26px, 7.5vw, 40px)",
                    fontSize: "clamp(10px, 3vw, 14px)",
                    background: bg,
                    color,
                    border,
                    fontWeight: fw,
                    cursor: "pointer",
                  }}
                  aria-label={`${letter} row ${r + 1} column ${c + 1}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Instructions (only before first cell selected) ── */}
      {!firstCell && !allFound && (
        <p className="text-xs text-center max-w-xs" style={{ color: "#9ca3af" }}>
          Tap a letter to start, then tap the end letter to select a word
        </p>
      )}
      {firstCell && (
        <p className="text-xs text-center font-semibold" style={{ color: GOLD }}>
          Now tap the last letter of the word ✦
        </p>
      )}

      {/* ── Word list ── */}
      <div className="w-full max-w-sm">
        <p className="text-[10px] font-black uppercase tracking-widest mb-3 text-center" style={{ color: "#9ca3af" }}>
          Find these {placed.length} words · {foundWords.length}/{placed.length} found
        </p>
        <div className="grid grid-cols-2 gap-2">
          {placed.map((pw) => {
            const isWordFound = foundWords.includes(pw.word);
            const wc = WORD_COLORS[pw.colorIdx];
            return (
              <div
                key={pw.word}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: isWordFound ? wc.bg : "#f9f5ef",
                  color:  isWordFound ? wc.text : "#9ca3af",
                  border: `1px solid ${isWordFound ? wc.border + "66" : "#ede8de"}`,
                  textDecoration: isWordFound ? "line-through" : "none",
                }}
              >
                {isWordFound ? (
                  <span style={{ color: wc.border }}>✓</span>
                ) : (
                  <span style={{ color: "#d1d5db" }}>○</span>
                )}
                {pw.word}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Reveal button ── */}
      {!allFound && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-xs font-semibold px-4 py-2 rounded-full transition"
          style={{
            background: showAll ? `${NAVY}15` : "transparent",
            color: showAll ? NAVY : "#9ca3af",
            border: `1px solid ${showAll ? NAVY + "33" : "#ede8de"}`,
          }}
        >
          {showAll ? "Hide Answers" : "Reveal Answers"}
        </button>
      )}

      {/* ── Share ── */}
      {allFound && (
        <button
          onClick={() => {
            const text = `📖 Bible Word Search — ${puzzle.title}\n🔠 Found all ${placed.length} words!\nscripturelives.com/games`;
            if (navigator.share) {
              navigator.share({ text }).catch(() => {});
            } else {
              navigator.clipboard.writeText(text).catch(() => {});
              alert("Results copied to clipboard!");
            }
          }}
          className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition hover:opacity-90"
          style={{ background: GOLD }}
        >
          Share Results 📤
        </button>
      )}

    </div>
  );
}
