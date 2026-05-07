"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getDailyWord,
  loadWordleState,
  saveWordleState,
  type WordleEntry,
} from "@/data/wordleWords";

// ── Design tokens ─────────────────────────────────────────────────────────────
const GOLD   = "#C9952A";
const NAVY   = "#1a2640";
const CREAM  = "#faf8f3";
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// ── Tile state type ────────────────────────────────────────────────────────────
type TileState = "correct" | "present" | "absent" | "empty" | "active";

// ── Evaluate a guess against the answer ───────────────────────────────────────
function evaluateGuess(guess: string, answer: string): TileState[] {
  const result: TileState[] = Array(WORD_LENGTH).fill("absent");
  const answerArr = answer.split("");
  const guessArr  = guess.split("");

  // Pass 1 — exact matches (green)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i]    = "correct";
      answerArr[i] = "#";
      guessArr[i]  = "*";
    }
  }

  // Pass 2 — present but wrong position (yellow)
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === "*") continue;
    const idx = answerArr.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i]       = "present";
      answerArr[idx]  = "#";
    }
  }

  return result;
}

// ── Derive keyboard letter states from all guesses ────────────────────────────
function buildKeyStates(
  guesses: string[],
  answer: string
): Record<string, TileState> {
  const states: Record<string, TileState> = {};
  for (const guess of guesses) {
    const eval_ = evaluateGuess(guess, answer);
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = guess[i];
      const cur    = states[letter];
      const next   = eval_[i];
      // Priority: correct > present > absent
      if (cur === "correct") continue;
      if (cur === "present" && next !== "correct") continue;
      states[letter] = next;
    }
  }
  return states;
}

// ── Tile colours ──────────────────────────────────────────────────────────────
function tileStyle(state: TileState, revealed: boolean): React.CSSProperties {
  if (!revealed) {
    return {
      background: state === "active" ? "#fff" : CREAM,
      border: `2px solid ${state === "active" ? GOLD : "#d1c9b8"}`,
      color: NAVY,
    };
  }
  switch (state) {
    case "correct": return { background: "#4a7c59", border: "2px solid #4a7c59", color: "#fff" };
    case "present": return { background: "#c9952a", border: "2px solid #c9952a", color: "#fff" };
    default:        return { background: "#6b7280", border: "2px solid #6b7280", color: "#fff" };
  }
}

function keyStyle(state: TileState | undefined): React.CSSProperties {
  switch (state) {
    case "correct": return { background: "#4a7c59", color: "#fff", border: "none" };
    case "present": return { background: GOLD,      color: "#fff", border: "none" };
    case "absent":  return { background: "#6b7280", color: "#fff", border: "none" };
    default:        return { background: "#e8e0d4", color: NAVY,   border: "none" };
  }
}

// ── Keyboard rows ─────────────────────────────────────────────────────────────
const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function BibleWordle() {
  const [entry,        setEntry]        = useState<WordleEntry | null>(null);
  const [guesses,      setGuesses]      = useState<string[]>([]);
  const [current,      setCurrent]      = useState("");
  const [status,       setStatus]       = useState<"playing" | "won" | "lost">("playing");
  const [shake,        setShake]        = useState(false);
  const [reveal,       setReveal]       = useState<number | null>(null); // row being revealed
  const [showHint,     setShowHint]     = useState(true);
  const [notification, setNotification] = useState("");

  // Load daily word + saved state
  useEffect(() => {
    const word = getDailyWord();
    setEntry(word);

    const saved = loadWordleState();
    if (saved) {
      setGuesses(saved.guesses);
      setStatus(saved.status);
    }
  }, []);

  // Persist whenever guesses/status changes
  useEffect(() => {
    if (!entry) return;
    saveWordleState({ date: "", guesses, status });
  }, [guesses, status, entry]);

  // Flash notification helper
  const notify = (msg: string, duration = 2000) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), duration);
  };

  const submitGuess = useCallback(() => {
    if (!entry || status !== "playing") return;
    if (current.length !== WORD_LENGTH) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      notify("Word must be 5 letters");
      return;
    }

    const newGuesses = [...guesses, current];
    const rowIndex   = guesses.length;
    setReveal(rowIndex);
    setTimeout(() => setReveal(null), WORD_LENGTH * 350 + 100);

    setGuesses(newGuesses);
    setCurrent("");

    if (current === entry.word) {
      setTimeout(() => {
        setStatus("won");
        const msgs = ["Amazing! 🎉", "Blessed! 🙏", "Well done! ✨", "Glory to God! 🌟", "Wonderful! 🕊️"];
        notify(msgs[Math.min(rowIndex, msgs.length - 1)], 3000);
      }, WORD_LENGTH * 350 + 200);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => {
        setStatus("lost");
        notify(`The word was ${entry.word}`, 5000);
      }, WORD_LENGTH * 350 + 200);
    }
  }, [entry, status, current, guesses]);

  const handleKey = useCallback((key: string) => {
    if (!entry || status !== "playing") return;
    if (key === "ENTER") { submitGuess(); return; }
    if (key === "⌫" || key === "BACKSPACE") {
      setCurrent(c => c.slice(0, -1));
      return;
    }
    if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) {
      setCurrent(c => c + key);
    }
  }, [entry, status, current, submitGuess]);

  // Physical keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  if (!entry) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm" style={{ color: "#9ca3af" }}>Loading today&apos;s word…</div>
      </div>
    );
  }

  const keyStates = buildKeyStates(guesses, entry.word);

  // Build grid rows (6 rows, 5 cols)
  const rows: { letter: string; state: TileState; revealed: boolean }[][] = [];
  for (let r = 0; r < MAX_GUESSES; r++) {
    const guess   = guesses[r] ?? "";
    const isFuture = r > guesses.length;
    const isCurrent = r === guesses.length && status === "playing";
    const displayWord = isCurrent ? current : guess;
    const evaluated   = guess ? evaluateGuess(guess, entry.word) : null;
    const isRevealing = reveal === r;

    const row = [];
    for (let c = 0; c < WORD_LENGTH; c++) {
      const letter  = displayWord[c] ?? "";
      let state: TileState = "empty";
      if (evaluated) {
        state = evaluated[c];
      } else if (isCurrent && letter) {
        state = "active";
      } else if (isFuture || !letter) {
        state = "empty";
      }

      row.push({
        letter,
        state,
        revealed: !!evaluated && !isRevealing ? true : isRevealing && c < (Date.now() % 1000) / 350 ? true : !!evaluated && !isRevealing,
      });
    }
    rows.push(row);
  }

  // Simplified: reveal is just whether the row has been guessed
  const buildRows = () => {
    const result = [];
    for (let r = 0; r < MAX_GUESSES; r++) {
      const guess       = guesses[r] ?? "";
      const isCurrent   = r === guesses.length && status === "playing";
      const displayWord = isCurrent ? current : guess;
      const evaluated   = guess ? evaluateGuess(guess, entry.word) : null;
      const isThisReveal = reveal === r;

      result.push(
        <div
          key={r}
          className="flex gap-2 justify-center"
          style={{ animation: r === guesses.length && shake ? "shake 0.5s ease" : undefined }}
        >
          {Array.from({ length: WORD_LENGTH }, (_, c) => {
            const letter = displayWord[c] ?? "";
            let tileState: TileState = "empty";
            if (evaluated) {
              tileState = evaluated[c];
            } else if (isCurrent && letter) {
              tileState = "active";
            }

            // Tile reveal: tiles in a completed row flip one by one
            const revealDelay = isThisReveal ? c * 350 : 0;
            const isRevealed  = !!evaluated && !isThisReveal;

            return (
              <div
                key={c}
                className="flex items-center justify-center font-black text-xl rounded-lg select-none transition-all"
                style={{
                  width: 52,
                  height: 52,
                  ...tileStyle(tileState, isRevealed),
                  transitionDelay: `${revealDelay}ms`,
                  transitionProperty: "background, border-color",
                  transitionDuration: "300ms",
                  animation: isCurrent && letter && c === current.length - 1
                    ? "pop 0.1s ease"
                    : undefined,
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      );
    }
    return result;
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6" style={{ background: CREAM }}>

      {/* ── Notification toast ─────────────────────────────────────────────── */}
      {notification && (
        <div
          className="fixed top-20 left-1/2 z-50 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg"
          style={{ transform: "translateX(-50%)", background: NAVY, pointerEvents: "none" }}
        >
          {notification}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-md mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">✝️</span>
          <h1 className="text-2xl font-black" style={{ color: NAVY }}>Bible Wordle</h1>
        </div>
        <p className="text-xs" style={{ color: "#6b7280" }}>
          Guess today&apos;s Bible word in 6 tries · New word at midnight
        </p>
      </div>

      {/* ── Verse hint card ─────────────────────────────────────────────────── */}
      <div className="w-full max-w-md mb-5 rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e8d5b0", boxShadow: "0 2px 12px rgba(201,149,42,0.10)" }}>
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          style={{ background: "linear-gradient(135deg, #1a2640 0%, #2a3a5c 100%)" }}
          onClick={() => setShowHint(h => !h)}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📖</span>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: GOLD }}>
              Scripture Hint
            </span>
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            {showHint ? "▲ hide" : "▼ show"}
          </span>
        </button>

        {showHint && (
          <div className="px-4 py-4 bg-white">
            <p className="text-sm leading-relaxed italic mb-2" style={{ color: "#374151" }}>
              &ldquo;{entry.hint}&rdquo;
            </p>
            <p className="text-xs font-semibold text-right" style={{ color: GOLD }}>
              — {entry.ref}
            </p>
          </div>
        )}
      </div>

      {/* ── Guess grid ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 mb-6">
        {buildRows()}
      </div>

      {/* ── Win / Lost banner ───────────────────────────────────────────────── */}
      {status === "won" && (
        <div className="w-full max-w-md mb-4 rounded-2xl px-5 py-4 text-center"
          style={{ background: "linear-gradient(135deg, #4a7c59, #3a6148)", color: "#fff" }}>
          <p className="text-lg font-black mb-1">🎉 You got it!</p>
          <p className="text-sm opacity-80">
            Today&apos;s word was <strong>{entry.word}</strong>
          </p>
          <p className="text-xs mt-2 opacity-60">Come back tomorrow for a new word</p>
        </div>
      )}

      {status === "lost" && (
        <div className="w-full max-w-md mb-4 rounded-2xl px-5 py-4 text-center"
          style={{ background: "linear-gradient(135deg, #374151, #4b5563)", color: "#fff" }}>
          <p className="text-lg font-black mb-1">The answer was</p>
          <p className="text-2xl font-black mb-1" style={{ color: GOLD }}>{entry.word}</p>
          <p className="text-xs opacity-60">{entry.ref}</p>
          <p className="text-xs mt-2 opacity-60">Come back tomorrow for a new word</p>
        </div>
      )}

      {/* ── Virtual keyboard ────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm flex flex-col gap-1.5 items-center">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5 justify-center">
            {row.map((key) => {
              const isWide = key === "ENTER" || key === "⌫";
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className="flex items-center justify-center rounded-lg font-bold text-xs transition-all active:scale-95 select-none"
                  style={{
                    width: isWide ? 56 : 34,
                    height: 46,
                    fontSize: key === "ENTER" ? 10 : 14,
                    ...keyStyle(keyStates[key]),
                    cursor: status !== "playing" ? "default" : "pointer",
                  }}
                  disabled={status !== "playing"}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Category badge ─────────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center gap-2">
        <span className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
          style={{ background: "#f3ede0", color: GOLD, border: `1px solid ${GOLD}33` }}>
          Category: {entry.category}
        </span>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: "#9ca3af" }}>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "#4a7c59" }} />
          Correct position
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded" style={{ background: GOLD }} />
          Wrong position
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded" style={{ background: "#6b7280" }} />
          Not in word
        </span>
      </div>

      {/* ── Keyframe animations ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
        @keyframes pop {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
