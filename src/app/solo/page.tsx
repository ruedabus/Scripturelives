"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, Zap, CheckCircle2, XCircle, BookOpen,
  RotateCcw, Flame,
} from "lucide-react";
import { TOURNAMENT_QUESTIONS } from "@/data/tournamentQuestions";
import { TOURNAMENT_CATEGORIES } from "@/lib/tournamentTypes";
import type { TournamentQuestion } from "@/lib/tournamentTypes";
import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Types ─────────────────────────────────────────────────────────────────────
type Phase      = "setup" | "playing" | "feedback" | "complete";
type Difficulty = "easy" | "medium" | "hard";
type AnswerRecord = {
  question:     TournamentQuestion;
  given:        string;
  correct:      boolean;
  timeMs:       number;
  pointsEarned: number;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickSoloQuestions(count: number, difficulties: Difficulty[], categories: string[]): TournamentQuestion[] {
  let pool = TOURNAMENT_QUESTIONS.filter((q) => difficulties.includes(q.difficulty as Difficulty));
  if (categories.length > 0 && categories.length < TOURNAMENT_CATEGORIES.length) {
    const catPool = pool.filter((q) => categories.includes(q.category));
    if (catPool.length >= count) pool = catPool;
  }
  return shuffle(pool).slice(0, count);
}

function isCorrect(q: TournamentQuestion, given: string): boolean {
  const g = given.toLowerCase().trim();
  const a = q.answer.toLowerCase().trim();
  if (g === a) return true;
  if (q.type === "verse") {
    const words = a.split(/\s+/).filter((w) => w.length > 3);
    return words.length > 0 && words.every((w) => g.includes(w));
  }
  return false;
}

function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Countdown bar ─────────────────────────────────────────────────────────────
function CountdownBar({ startedAt, limitSec, onExpire }: { startedAt: number; limitSec: number; onExpire: () => void }) {
  const [pct, setPct] = useState(100);
  const expiredRef    = useRef(false);

  useEffect(() => {
    expiredRef.current = false;
    setPct(100);
    const iv = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const newPct  = Math.max(0, ((limitSec - elapsed) / limitSec) * 100);
      setPct(newPct);
      if (newPct === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire();
        clearInterval(iv);
      }
    }, 100);
    return () => clearInterval(iv);
  }, [startedAt, limitSec, onExpire]);

  const bg = pct > 60 ? "#16a34a" : pct > 30 ? GOLD : "#ef4444";
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
      <div className="h-full rounded-full transition-all duration-100" style={{ width: `${pct}%`, background: bg }} />
    </div>
  );
}

// ── Setup screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }: { onStart: (q: TournamentQuestion[], mode: string) => void }) {
  const router = useRouter();
  const [qCount,       setQCount]       = useState<5|10|20>(10);
  const [difficulties, setDifficulties] = useState<Difficulty[]>(["easy","medium","hard"]);
  const [categories,   setCategories]   = useState<string[]>(TOURNAMENT_CATEGORIES.map((c) => c.id));

  const toggleDiff = (d: Difficulty) =>
    setDifficulties((prev) => prev.includes(d) ? (prev.length > 1 ? prev.filter((x) => x !== d) : prev) : [...prev, d]);

  const toggleCat = (id: string) =>
    setCategories((prev) => prev.includes(id) ? (prev.length > 1 ? prev.filter((c) => c !== id) : prev) : [...prev, id]);

  const start = () => {
    const qs = pickSoloQuestions(qCount, difficulties, categories);
    if (qs.length === 0) return;
    onStart(qs, `${qCount}Q`);
  };

  const DIFF_OPTIONS: { d: Difficulty; label: string; activeColor: string }[] = [
    { d: "easy",   label: "Easy",   activeColor: "#16a34a" },
    { d: "medium", label: "Medium", activeColor: GOLD      },
    { d: "hard",   label: "Hard",   activeColor: "#ef4444" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/tournament" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>← Back</Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Solo Practice</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background: NAVY }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bible-bowl.png" alt="" aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.12, objectPosition: "center 25%" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,38,64,0.5) 0%, #faf8f3 100%)" }} />
        <div className="relative z-10 px-4 pt-12 pb-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: GOLD }}>Scripture Lives</span>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <div className="text-5xl mb-3">📖</div>
          <h1 className="text-4xl font-black text-white mb-2">Solo Practice</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            Bible trivia against the clock · no opponents needed
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="flex-1 px-4 py-8 max-w-sm mx-auto w-full -mt-6 flex flex-col gap-4">

        {/* Question count */}
        <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid #ede8de", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>Questions</p>
          <div className="grid grid-cols-3 gap-2">
            {([
              { n: 5  as const, label: "Quick 5"     },
              { n: 10 as const, label: "Standard 10" },
              { n: 20 as const, label: "Marathon 20" },
            ]).map(({ n, label }) => (
              <button key={n} onClick={() => setQCount(n)}
                className="py-3 rounded-xl font-bold text-sm transition"
                style={qCount === n
                  ? { background: GOLD, color: "white", border: `1px solid ${GOLD}` }
                  : { background: "#faf8f3", color: "#6b7280", border: "1px solid #ede8de" }
                }>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid #ede8de", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            {DIFF_OPTIONS.map(({ d, label, activeColor }) => (
              <button key={d} onClick={() => toggleDiff(d)}
                className="py-3 rounded-xl font-bold text-sm transition"
                style={difficulties.includes(d)
                  ? { background: activeColor, color: "white", border: `1px solid ${activeColor}` }
                  : { background: "#faf8f3", color: "#9ca3af", border: "1px solid #ede8de" }
                }>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="rounded-2xl bg-white p-5" style={{ border: "1px solid #ede8de", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Categories</p>
            <button
              onClick={() => categories.length === TOURNAMENT_CATEGORIES.length
                ? setCategories([TOURNAMENT_CATEGORIES[0].id])
                : setCategories(TOURNAMENT_CATEGORIES.map((c) => c.id))}
              className="text-xs font-semibold transition hover:opacity-70"
              style={{ color: GOLD }}
            >
              {categories.length === TOURNAMENT_CATEGORIES.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {TOURNAMENT_CATEGORIES.map((cat) => {
              const on = categories.includes(cat.id);
              return (
                <button key={cat.id} onClick={() => toggleCat(cat.id)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition"
                  style={{
                    background: on ? "rgba(201,149,42,0.07)" : "#faf8f3",
                    border: on ? `1px solid rgba(201,149,42,0.35)` : "1px solid #ede8de",
                  }}>
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm font-semibold flex-1" style={{ color: on ? NAVY : "#6b7280" }}>{cat.label}</span>
                  <div className="w-4 h-4 rounded border flex items-center justify-center transition shrink-0"
                    style={{ background: on ? GOLD : "white", borderColor: on ? GOLD : "#ddd6c8" }}>
                    {on && <span className="text-[8px] text-white font-black">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Start button */}
        <button onClick={start}
          className="w-full py-5 rounded-2xl font-black text-xl text-white flex items-center justify-center gap-2 transition hover:brightness-110"
          style={{ background: GOLD, boxShadow: `0 4px 20px rgba(201,149,42,0.4)` }}>
          <BookOpen size={22} /> Start Practice
        </button>

        <button onClick={() => router.push("/tournament")}
          className="text-center text-sm font-semibold transition hover:opacity-70"
          style={{ color: "#9ca3af" }}>
          ← Tournament Lobby
        </button>
      </div>
    </div>
  );
}

// ── Question screen ───────────────────────────────────────────────────────────
function QuestionScreen({ q, index, total, score, streak, onAnswer }: {
  q: TournamentQuestion; index: number; total: number; score: number; streak: number;
  onAnswer: (given: string, correct: boolean, timeMs: number, pts: number) => void;
}) {
  const [selected,  setSelected]  = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [answered,  setAnswered]  = useState(false);
  const startRef                  = useRef(Date.now());

  useEffect(() => {
    setSelected(null); setTextInput(""); setAnswered(false);
    startRef.current = Date.now();
  }, [q.id]);

  const submit = useCallback((given: string) => {
    if (answered) return;
    setAnswered(true);
    const timeMs     = Date.now() - startRef.current;
    const ok         = isCorrect(q, given);
    const halfMs     = (q.timeLimitSec * 1000) / 2;
    const speedBonus = ok && timeMs < halfMs ? Math.round(q.points * 0.5) : 0;
    onAnswer(given, ok, timeMs, ok ? q.points + speedBonus : 0);
  }, [answered, q, onAnswer]);

  const expire = useCallback(() => { if (!answered) submit(""); }, [answered, submit]);

  if (q.type === "mc") {
    return (
      <div className="flex flex-col gap-3 w-full">
        {(q.options ?? []).map((opt) => (
          <button key={opt} disabled={answered} onClick={() => { setSelected(opt); submit(opt); }}
            className="w-full p-4 rounded-xl text-left font-semibold transition-all"
            style={selected === opt
              ? { background: GOLD, border: `1px solid ${GOLD}`, color: "white" }
              : answered
              ? { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              : { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }
            }>
            {opt}
          </button>
        ))}
        <CountdownBar startedAt={startRef.current} limitSec={q.timeLimitSec} onExpire={expire} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {q.verseRef && (
        <p className="text-sm text-center font-semibold" style={{ color: GOLD }}>📖 {q.verseRef}</p>
      )}
      <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && textInput.trim() && submit(textInput.trim())}
        disabled={answered}
        placeholder={q.type === "verse" ? "Complete the verse…" : "Type your answer…"}
        className="w-full p-4 rounded-xl outline-none text-lg disabled:opacity-50"
        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "white" }}
      />
      <button onClick={() => textInput.trim() && submit(textInput.trim())}
        disabled={answered || !textInput.trim()}
        className="w-full py-3 rounded-xl font-black text-white disabled:opacity-40 transition hover:brightness-110"
        style={{ background: GOLD }}>
        Submit
      </button>
      <CountdownBar startedAt={startRef.current} limitSec={q.timeLimitSec} onExpire={expire} />
    </div>
  );
}

// ── Feedback overlay ──────────────────────────────────────────────────────────
function FeedbackOverlay({ record, onNext, isLast }: { record: AnswerRecord; onNext: () => void; isLast: boolean }) {
  const { question: q, given, correct, timeMs, pointsEarned } = record;

  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-3 p-4 rounded-2xl"
        style={correct
          ? { background: "rgba(22,163,74,0.15)", border: "1px solid rgba(22,163,74,0.4)" }
          : { background: "rgba(239,68,68,0.15)",  border: "1px solid rgba(239,68,68,0.4)" }
        }>
        {correct
          ? <CheckCircle2 size={28} className="shrink-0" style={{ color: "#4ade80" }} />
          : <XCircle      size={28} className="shrink-0" style={{ color: "#f87171" }} />}
        <div className="flex-1">
          <p className="font-bold text-lg" style={{ color: correct ? "#4ade80" : "#f87171" }}>
            {correct ? "Correct!" : given ? "Not quite" : "Time's up!"}
          </p>
          {!correct && given && (
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Your answer: {given}</p>
          )}
        </div>
        {correct && <p className="font-black text-xl" style={{ color: "#4ade80" }}>+{pointsEarned}</p>}
      </div>

      {!correct && (
        <div className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Correct Answer</p>
          <p className="font-semibold text-white">{q.answer}</p>
          {q.reference && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{q.reference}</p>}
        </div>
      )}

      <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
        {given ? `Answered in ${formatTime(timeMs)}` : "Time expired"}
        {correct && timeMs < (q.timeLimitSec * 500) && " ⚡ Speed bonus!"}
      </p>
      <p className="text-center text-xs animate-pulse" style={{ color: "rgba(255,255,255,0.35)" }}>
        {isLast ? "Loading results…" : "Next question in a moment…"}
      </p>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────
function ResultsScreen({ records, onPlayAgain }: { records: AnswerRecord[]; onPlayAgain: () => void }) {
  const router     = useRouter();
  const totalScore = records.reduce((s, r) => s + r.pointsEarned, 0);
  const maxScore   = records.reduce((s, r) => s + r.question.points + Math.round(r.question.points * 0.5), 0);
  const correct    = records.filter((r) => r.correct).length;
  const accuracy   = Math.round((correct / records.length) * 100);
  const avgTime    = Math.round(records.filter((r) => r.given).reduce((s, r) => s + r.timeMs, 0) / Math.max(1, records.filter((r) => r.given).length));

  let best = 0, cur = 0;
  records.forEach((r) => { cur = r.correct ? cur + 1 : 0; best = Math.max(best, cur); });

  const grade =
    accuracy >= 90 ? "S" : accuracy >= 80 ? "A" : accuracy >= 65 ? "B" : accuracy >= 50 ? "C" : "D";

  const gradeColor =
    grade === "S" ? GOLD :
    grade === "A" ? "#16a34a" :
    grade === "B" ? "#3b82f6" :
    grade === "C" ? "#6b7280" : "#ef4444";

  const shareText = `📖 Bible Bowl Solo Practice\n${correct}/${records.length} correct · ${totalScore.toLocaleString()} pts · Grade ${grade}\nTry it at scripturelives.com/solo`;

  const share = async () => {
    if (navigator.share) await navigator.share({ text: shareText }).catch(() => {});
    else await navigator.clipboard.writeText(shareText).catch(() => {});
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f3" }}>

      {/* Nav */}
      <nav className="sticky top-0 z-20 bg-white px-5 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid #ede8de" }}>
        <Link href="/tournament" className="text-sm font-semibold transition hover:opacity-70" style={{ color: GOLD }}>← Back</Link>
        <span style={{ color: "#ddd6c8" }}>|</span>
        <span className="text-sm font-bold" style={{ color: NAVY }}>Results</span>
      </nav>

      <div className="max-w-sm mx-auto px-4 py-8 w-full flex flex-col gap-5">

        {/* Grade */}
        <div className="text-center rounded-2xl bg-white py-8" style={{ border: "1px solid #ede8de", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
          <p className="text-8xl font-black" style={{ color: gradeColor }}>{grade}</p>
          <p className="text-sm mt-1" style={{ color: "#6b7280" }}>
            {grade === "S" ? "Scripture Scholar! 🏆" :
             grade === "A" ? "Excellent work! 🌟" :
             grade === "B" ? "Solid knowledge! 📖" :
             grade === "C" ? "Keep studying! 💪" : "Don't give up! 🙏"}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Score",       value: totalScore.toLocaleString(), sub: `of ${maxScore.toLocaleString()} max`, icon: "🏆" },
            { label: "Accuracy",    value: `${accuracy}%`,              sub: `${correct} of ${records.length}`,     icon: "🎯" },
            { label: "Avg Time",    value: formatTime(avgTime),         sub: "per question",                         icon: "⏱️" },
            { label: "Best Streak", value: `${best}🔥`,                 sub: "correct in a row",                     icon: "🔥" },
          ].map(({ label, value, sub, icon }) => (
            <div key={label} className="rounded-xl bg-white p-4 text-center" style={{ border: "1px solid #ede8de" }}>
              <p className="text-xl mb-0.5">{icon}</p>
              <p className="font-black text-xl" style={{ color: NAVY }}>{value}</p>
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: GOLD }}>{label}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Breakdown */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "#9ca3af" }}>Question Breakdown</p>
          <div className="flex flex-col gap-2">
            {records.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm"
                style={r.correct
                  ? { background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.25)" }
                  : { background: "rgba(239,68,68,0.07)",  border: "1px solid rgba(239,68,68,0.25)" }
                }>
                {r.correct
                  ? <CheckCircle2 size={16} className="shrink-0" style={{ color: "#16a34a" }} />
                  : <XCircle      size={16} className="shrink-0" style={{ color: "#ef4444" }} />}
                <span className="flex-1 text-xs leading-snug line-clamp-2" style={{ color: NAVY }}>{r.question.text}</span>
                <div className="text-right shrink-0">
                  {r.correct && <p className="font-bold text-xs" style={{ color: "#16a34a" }}>+{r.pointsEarned}</p>}
                  <p className="text-xs" style={{ color: "#9ca3af" }}>{formatTime(r.timeMs)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button onClick={onPlayAgain}
            className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 transition hover:brightness-110"
            style={{ background: GOLD, boxShadow: `0 4px 16px rgba(201,149,42,0.35)` }}>
            <RotateCcw size={20} /> Play Again
          </button>
          <button onClick={share}
            className="w-full py-3 rounded-xl font-bold text-sm transition hover:-translate-y-0.5"
            style={{ background: "white", border: `1px solid rgba(201,149,42,0.3)`, color: NAVY }}>
            📤 Share Score
          </button>
          <button onClick={() => router.push("/tournament")}
            className="w-full py-3 rounded-xl font-semibold text-sm transition hover:opacity-70"
            style={{ background: "#faf8f3", border: "1px solid #ede8de", color: "#6b7280" }}>
            ← Tournament Lobby
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SoloPage() {
  const [phase,      setPhase]      = useState<Phase>("setup");
  const [questions,  setQuestions]  = useState<TournamentQuestion[]>([]);
  const [index,      setIndex]      = useState(0);
  const [score,      setScore]      = useState(0);
  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [records,    setRecords]    = useState<AnswerRecord[]>([]);
  const [pending,    setPending]    = useState<AnswerRecord | null>(null);

  const handleStart = (qs: TournamentQuestion[]) => {
    setQuestions(qs); setIndex(0); setScore(0); setStreak(0);
    setBestStreak(0); setRecords([]); setPending(null); setPhase("playing");
  };

  const handleAnswer = useCallback((given: string, correct: boolean, timeMs: number, pts: number) => {
    const q   = questions[index];
    const rec: AnswerRecord = { question: q, given, correct, timeMs, pointsEarned: pts };
    setPending(rec); setScore((s) => s + pts);
    setStreak((prev) => { const ns = correct ? prev + 1 : 0; setBestStreak((b) => Math.max(b, ns)); return ns; });
    setRecords((prev) => [...prev, rec]);
    setPhase("feedback");
  }, [questions, index]);

  const handleNext = useCallback(() => {
    const nextIdx = index + 1;
    if (nextIdx >= questions.length) { setPhase("complete"); }
    else { setIndex(nextIdx); setPending(null); setPhase("playing"); }
  }, [index, questions.length]);

  const handleReset = () => {
    setPhase("setup"); setQuestions([]); setIndex(0); setScore(0);
    setStreak(0); setBestStreak(0); setRecords([]); setPending(null);
  };

  if (phase === "setup")    return <SetupScreen onStart={handleStart} />;
  if (phase === "complete") return <ResultsScreen records={records} onPlayAgain={handleReset} />;

  const q = questions[index];

  // ── In-game (dark navy for focus) ─────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 gap-5" style={{ background: NAVY }}>

      {/* Top bar */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-black text-lg" style={{ color: GOLD }}>
          <Trophy size={18} /> {score.toLocaleString()}
        </div>
        <span className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Q {index + 1} / {questions.length}
        </span>
        {streak >= 2
          ? <div className="flex items-center gap-1 font-bold" style={{ color: "#fb923c" }}><Flame size={16} />{streak}</div>
          : <div className="w-12" />
        }
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-md">
        {questions.map((_, i) => (
          <div key={i} className="w-3 h-3 rounded-full transition-all"
            style={{
              background: i < records.length
                ? records[i].correct ? "#16a34a" : "#ef4444"
                : i === index ? GOLD : "rgba(255,255,255,0.15)",
              transform: i === index ? "scale(1.25)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Question card */}
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs rounded-full" style={{ background: "rgba(201,149,42,0.2)", color: GOLD }}>{q.category}</span>
          <span className="px-2 py-0.5 text-xs rounded-full" style={{
            background: q.difficulty === "easy" ? "rgba(22,163,74,0.2)" : q.difficulty === "medium" ? "rgba(201,149,42,0.2)" : "rgba(239,68,68,0.2)",
            color:      q.difficulty === "easy" ? "#4ade80"             : q.difficulty === "medium" ? GOLD                    : "#f87171",
          }}>{q.difficulty}</span>
          <span className="ml-auto text-sm font-bold" style={{ color: GOLD }}>+{q.points} pts</span>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <p className="font-semibold text-base leading-relaxed text-white">{q.text}</p>
        </div>

        {phase === "playing"  && <QuestionScreen q={q} index={index} total={questions.length} score={score} streak={streak} onAnswer={handleAnswer} />}
        {phase === "feedback" && pending && <FeedbackOverlay record={pending} onNext={handleNext} isLast={index === questions.length - 1} />}
      </div>
    </div>
  );
}
