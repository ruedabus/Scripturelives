"use client";

import React, { useState, useCallback } from "react";
import {
  Brain, Plus, Trash2, ChevronLeft, ChevronRight, RotateCcw,
  Check, X, Star, BookOpen, Shuffle, Trophy,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Flashcard {
  id: string;
  reference: string;
  text: string;
  version: string;
  addedAt: number;
  // spaced repetition
  box: 0 | 1 | 2 | 3 | 4 | 5;   // Leitner box 0–5
  nextReview: number;             // timestamp
  streak: number;
  totalReviews: number;
  correct: number;
}

type SessionMode = "learn" | "review" | "starred";

const STORAGE_KEY = "scripture-lives-flashcards";

// ── Seed cards ────────────────────────────────────────────────────────────────
const SEED_CARDS: Flashcard[] = [
  { id: "s1", reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", version: "NIV", addedAt: Date.now() - 7 * 86400000, box: 2, nextReview: Date.now() - 3600000, streak: 3, totalReviews: 5, correct: 4 },
  { id: "s2", reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", version: "KJV", addedAt: Date.now() - 5 * 86400000, box: 3, nextReview: Date.now() - 3600000, streak: 5, totalReviews: 7, correct: 6 },
  { id: "s3", reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", version: "NIV", addedAt: Date.now() - 4 * 86400000, box: 1, nextReview: Date.now() - 3600000, streak: 1, totalReviews: 3, correct: 2 },
  { id: "s4", reference: "Philippians 4:13", text: "I can do all this through him who gives me strength.", version: "NIV", addedAt: Date.now() - 3 * 86400000, box: 0, nextReview: Date.now() - 3600000, streak: 0, totalReviews: 1, correct: 0 },
  { id: "s5", reference: "Joshua 1:9", text: "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", version: "NIV", addedAt: Date.now() - 2 * 86400000, box: 1, nextReview: Date.now() - 3600000, streak: 2, totalReviews: 4, correct: 3 },
  { id: "s6", reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", version: "NIV", addedAt: Date.now() - 1 * 86400000, box: 0, nextReview: Date.now() - 3600000, streak: 0, totalReviews: 0, correct: 0 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }

function loadCards(): Flashcard[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"); } catch { return []; }
}
function saveCards(cards: Flashcard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

// Next review interval in ms for each Leitner box
const BOX_INTERVAL_MS = [
  0,                        // box 0: immediately
  24 * 3600 * 1000,        // box 1: 1 day
  3 * 24 * 3600 * 1000,   // box 2: 3 days
  7 * 24 * 3600 * 1000,   // box 3: 1 week
  14 * 24 * 3600 * 1000,  // box 4: 2 weeks
  30 * 24 * 3600 * 1000,  // box 5: 1 month (mastered)
];

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function MemorizationFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    const saved = loadCards();
    return saved.length > 0 ? saved : SEED_CARDS;
  });

  const [view, setView] = useState<"dashboard" | "session" | "add">("dashboard");
  const [sessionMode, setSessionMode] = useState<SessionMode>("review");
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionResults, setSessionResults] = useState<{ id: string; correct: boolean }[]>([]);
  const [sessionDone, setSessionDone] = useState(false);

  // Add form
  const [newRef, setNewRef] = useState("");
  const [newText, setNewText] = useState("");
  const [newVersion, setNewVersion] = useState("NIV");
  const [starred, setStarred] = useState<Set<string>>(new Set());

  function persist(updated: Flashcard[]) {
    setCards(updated);
    saveCards(updated);
  }

  // ── Start session ──────────────────────────────────────────────────────────
  function startSession(mode: SessionMode) {
    let pool: Flashcard[];
    const now = Date.now();
    if (mode === "review") {
      pool = cards.filter((c) => c.nextReview <= now);
      if (pool.length === 0) pool = cards.slice(0, 5); // fallback
    } else if (mode === "starred") {
      pool = cards.filter((c) => starred.has(c.id));
    } else {
      pool = shuffled(cards).slice(0, 10);
    }
    if (pool.length === 0) return;

    setSessionCards(shuffled(pool));
    setSessionIndex(0);
    setFlipped(false);
    setSessionResults([]);
    setSessionDone(false);
    setSessionMode(mode);
    setView("session");
  }

  // ── Answer correct/wrong ───────────────────────────────────────────────────
  function answer(correct: boolean) {
    const card = sessionCards[sessionIndex];
    const newBox = correct
      ? Math.min(5, card.box + 1) as Flashcard["box"]
      : 0 as Flashcard["box"];
    const nextReview = Date.now() + BOX_INTERVAL_MS[newBox];

    const updated = cards.map((c) =>
      c.id === card.id
        ? {
            ...c,
            box: newBox,
            nextReview,
            streak: correct ? c.streak + 1 : 0,
            totalReviews: c.totalReviews + 1,
            correct: c.correct + (correct ? 1 : 0),
          }
        : c
    );
    persist(updated);
    setSessionResults((r) => [...r, { id: card.id, correct }]);

    if (sessionIndex + 1 >= sessionCards.length) {
      setSessionDone(true);
    } else {
      setSessionIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  // ── Add card ───────────────────────────────────────────────────────────────
  function addCard() {
    if (!newRef.trim() || !newText.trim()) return;
    const card: Flashcard = {
      id: uid(),
      reference: newRef.trim(),
      text: newText.trim(),
      version: newVersion,
      addedAt: Date.now(),
      box: 0,
      nextReview: Date.now(),
      streak: 0,
      totalReviews: 0,
      correct: 0,
    };
    persist([...cards, card]);
    setNewRef("");
    setNewText("");
    setView("dashboard");
  }

  const dueCount = cards.filter((c) => c.nextReview <= Date.now()).length;
  const masteredCount = cards.filter((c) => c.box === 5).length;

  // ── Session complete screen ────────────────────────────────────────────────
  if (view === "session" && sessionDone) {
    const correctCount = sessionResults.filter((r) => r.correct).length;
    const pct = Math.round((correctCount / sessionResults.length) * 100);
    return (
      <div className="space-y-5">
        <div className="text-center py-8 space-y-4">
          <Trophy size={48} className="mx-auto text-amber-400" />
          <div>
            <h2 className="text-2xl font-bold text-stone-900">{pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good progress!" : "Keep practicing!"}</h2>
            <p className="text-gray-500 mt-1">{correctCount} of {sessionResults.length} correct ({pct}%)</p>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            {sessionResults.map((r, i) => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${r.correct ? "bg-green-500" : "bg-red-400"}`}>
                {r.correct ? "✓" : "✗"}
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center flex-wrap pt-2">
            <button type="button" onClick={() => startSession(sessionMode)} className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition">
              <RotateCcw size={14} className="inline mr-1.5" />Go Again
            </button>
            <button type="button" onClick={() => setView("dashboard")} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:border-amber-400 transition">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Session in progress ────────────────────────────────────────────────────
  if (view === "session" && sessionCards.length > 0) {
    const card = sessionCards[sessionIndex];
    const progress = sessionIndex / sessionCards.length;

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setView("dashboard")} className="text-xs text-gray-400 hover:text-amber-600 transition">← Exit</button>
          <span className="text-xs font-semibold text-gray-500">{sessionIndex + 1} / {sessionCards.length}</span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${(progress * 100).toFixed(0)}%` }}
          />
        </div>

        {/* Card */}
        <div
          className="relative min-h-52 rounded-2xl border-2 border-gray-200 bg-white shadow-md cursor-pointer select-none transition-all duration-300 hover:shadow-lg"
          onClick={() => setFlipped((v) => !v)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-3">
            {!flipped ? (
              <>
                <span className="rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-700">{card.reference}</span>
                <p className="text-xs text-gray-400 mt-2">Tap to reveal</p>
                <span className="text-xs text-gray-300">{card.version}</span>
              </>
            ) : (
              <>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{card.reference}</span>
                <p className="text-base text-gray-800 leading-relaxed font-medium italic">"{card.text}"</p>
                <span className="text-xs text-gray-400">— {card.version}</span>
              </>
            )}
          </div>

          {/* Star */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setStarred((s) => {
                const n = new Set(s);
                n.has(card.id) ? n.delete(card.id) : n.add(card.id);
                return n;
              });
            }}
            className="absolute top-3 right-3 text-gray-200 hover:text-amber-400 transition"
          >
            <Star size={16} className={starred.has(card.id) ? "fill-amber-400 text-amber-400" : ""} />
          </button>

          {/* Box indicator */}
          <div className="absolute bottom-3 left-3 flex gap-1">
            {[0,1,2,3,4,5].map((b) => (
              <div key={b} className={`w-2 h-2 rounded-full ${b <= card.box ? "bg-amber-400" : "bg-gray-100"}`} />
            ))}
          </div>
        </div>

        {/* Hint */}
        {!flipped && (
          <p className="text-center text-xs text-gray-400">Try to recall the verse, then tap to see it</p>
        )}

        {/* Answer buttons */}
        {flipped && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => answer(false)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-red-100 bg-red-50 py-3 text-sm font-semibold text-red-500 hover:bg-red-100 transition"
            >
              <X size={16} /> Missed it
            </button>
            <button
              type="button"
              onClick={() => answer(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-green-100 bg-green-50 py-3 text-sm font-semibold text-green-600 hover:bg-green-100 transition"
            >
              <Check size={16} /> Got it!
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Add card form ──────────────────────────────────────────────────────────
  if (view === "add") {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <button type="button" onClick={() => setView("dashboard")} className="text-xs text-gray-400 hover:text-amber-600 transition">← Back</button>
          <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><Plus size={18} /> Add Verse</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reference *</label>
            <input type="text" value={newRef} onChange={(e) => setNewRef(e.target.value)} placeholder="e.g. Romans 8:28" className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Verse Text *</label>
            <textarea value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Paste or type the verse…" rows={4} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Version</label>
            <select value={newVersion} onChange={(e) => setNewVersion(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none">
              {["KJV","NIV","ESV","NLT","NKJV","AMP","CSB","NAS"].map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <button type="button" onClick={addCard} disabled={!newRef.trim() || !newText.trim()} className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition disabled:opacity-50">
            Save Card
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const boxCounts = [0,1,2,3,4,5].map((b) => cards.filter((c) => c.box === b).length);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><Brain size={18} /> Verse Memorization</h2>
          <p className="text-xs text-gray-400 mt-0.5">{cards.length} verses · {masteredCount} mastered</p>
        </div>
        <button type="button" onClick={() => setView("add")} className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition">
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-3 text-center">
          <p className="text-xl font-bold text-amber-600">{dueCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Due today</p>
        </div>
        <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-3 text-center">
          <p className="text-xl font-bold text-green-600">{masteredCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Mastered</p>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-3 text-center">
          <p className="text-xl font-bold text-blue-600">{cards.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
      </div>

      {/* Leitner boxes */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Learning Progress</p>
        <div className="flex gap-1.5 items-end h-12">
          {boxCounts.map((count, box) => {
            const maxH = Math.max(...boxCounts, 1);
            const pct = (count / maxH) * 100;
            const labels = ["New","Day 1","3 Days","1 Wk","2 Wks","Mastered"];
            const colors = ["bg-gray-300","bg-red-300","bg-orange-300","bg-yellow-400","bg-green-400","bg-emerald-500"];
            return (
              <div key={box} className="flex-1 flex flex-col items-center gap-1" title={`Box ${box}: ${labels[box]}`}>
                <div className={`w-full rounded-t-md ${colors[box]} transition-all`} style={{ height: `${Math.max(pct, 8)}%` }} />
                <span className="text-[9px] text-gray-400 leading-none">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1.5 mt-0.5">
          {["New","1d","3d","1w","2w","✓"].map((l, i) => (
            <span key={i} className="flex-1 text-center text-[9px] text-gray-300">{l}</span>
          ))}
        </div>
      </div>

      {/* Session modes */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Start a Session</p>

        <button
          type="button"
          onClick={() => startSession("review")}
          disabled={dueCount === 0}
          className="w-full flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left hover:bg-amber-100 transition disabled:opacity-40"
        >
          <BookOpen size={18} className="text-amber-600 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">Review Due Cards</p>
            <p className="text-xs text-gray-500">{dueCount} cards ready for review</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 ml-auto shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => startSession("learn")}
          className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-amber-300 hover:bg-amber-50 transition"
        >
          <Shuffle size={18} className="text-purple-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">Random Practice</p>
            <p className="text-xs text-gray-500">Shuffle through all {cards.length} verses</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 ml-auto shrink-0" />
        </button>

        <button
          type="button"
          onClick={() => startSession("starred")}
          disabled={starred.size === 0}
          className="w-full flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-amber-300 hover:bg-amber-50 transition disabled:opacity-40"
        >
          <Star size={18} className="text-amber-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800">Starred Verses</p>
            <p className="text-xs text-gray-500">{starred.size} starred</p>
          </div>
          <ChevronRight size={16} className="text-gray-300 ml-auto shrink-0" />
        </button>
      </div>

      {/* Card list */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Verses</p>
        <div className="space-y-2">
          {cards.map((card) => {
            const boxColors = ["bg-gray-200","bg-red-200","bg-orange-200","bg-yellow-200","bg-green-200","bg-emerald-300"];
            return (
              <div key={card.id} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 group">
                <div className={`w-2 h-2 rounded-full shrink-0 ${boxColors[card.box]}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800">{card.reference}</p>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-0.5 italic">{card.text}</p>
                </div>
                <span className="text-xs text-gray-300 shrink-0">{card.version}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Remove "${card.reference}"?`)) {
                      persist(cards.filter((c) => c.id !== card.id));
                    }
                  }}
                  className="text-gray-200 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
