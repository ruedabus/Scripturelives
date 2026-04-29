"use client";

/**
 * Solo Practice Mode
 * Entirely client-side — no server required.
 * Pick categories + difficulty, answer questions against the clock, see your score.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, Zap, CheckCircle2, XCircle, BookOpen,
  RotateCcw, ArrowRight, Flame,
} from "lucide-react";
import { TOURNAMENT_QUESTIONS } from "@/data/tournamentQuestions";
import { TOURNAMENT_CATEGORIES } from "@/lib/tournamentTypes";
import type { TournamentQuestion } from "@/lib/tournamentTypes";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "setup" | "playing" | "feedback" | "complete";
type Difficulty = "easy" | "medium" | "hard";

type AnswerRecord = {
  question:   TournamentQuestion;
  given:      string;
  correct:    boolean;
  timeMs:     number;
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

function pickSoloQuestions(
  count: number,
  difficulties: Difficulty[],
  categories: string[]
): TournamentQuestion[] {
  let pool = TOURNAMENT_QUESTIONS.filter(
    (q) => difficulties.includes(q.difficulty as Difficulty)
  );
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
  // Allow partial match for verse completion (key word present)
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

function CountdownBar({
  startedAt, limitSec, onExpire,
}: {
  startedAt: number;
  limitSec: number;
  onExpire: () => void;
}) {
  const [pct, setPct]         = useState(100);
  const expiredRef            = useRef(false);

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

  const color = pct > 60 ? "bg-green-500" : pct > 30 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-100 rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Setup screen ──────────────────────────────────────────────────────────────

function SetupScreen({ onStart }: {
  onStart: (q: TournamentQuestion[], mode: string) => void;
}) {
  const router = useRouter();
  const [qCount,       setQCount]       = useState<5|10|20>(10);
  const [difficulties, setDifficulties] = useState<Difficulty[]>(["easy","medium","hard"]);
  const [categories,   setCategories]   = useState<string[]>(
    TOURNAMENT_CATEGORIES.map((c) => c.id)
  );

  const toggleDiff = (d: Difficulty) =>
    setDifficulties((prev) =>
      prev.includes(d)
        ? prev.length > 1 ? prev.filter((x) => x !== d) : prev
        : [...prev, d]
    );

  const toggleCat = (id: string) =>
    setCategories((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((c) => c !== id) : prev
        : [...prev, id]
    );

  const start = () => {
    const qs = pickSoloQuestions(qCount, difficulties, categories);
    if (qs.length === 0) return;
    onStart(qs, `${qCount}Q`);
  };

  const DIFF_LABELS: { d: Difficulty; label: string; color: string }[] = [
    { d: "easy",   label: "Easy",   color: "bg-green-600/50 border-green-500/50"   },
    { d: "medium", label: "Medium", color: "bg-amber-600/50 border-amber-500/50"   },
    { d: "hard",   label: "Hard",   color: "bg-red-700/50   border-red-500/50"     },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center justify-center px-4 py-12 text-white gap-8">

      <div className="text-center">
        <div className="text-6xl mb-3">📖</div>
        <h1 className="text-3xl font-black text-amber-300">Solo Practice</h1>
        <p className="text-indigo-300 mt-1 text-sm">Bible trivia against the clock · no opponents needed</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-5">

        {/* Question count */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase text-indigo-300 mb-3">Questions</p>
          <div className="grid grid-cols-3 gap-2">
            {([5, 10, 20] as const).map((n) => (
              <button
                key={n}
                onClick={() => setQCount(n)}
                className={`py-3 rounded-xl font-bold text-sm border transition ${
                  qCount === n
                    ? "bg-amber-500 border-amber-400 text-black"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {n === 5 ? "Quick\n5" : n === 10 ? "Standard\n10" : "Marathon\n20"}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase text-indigo-300 mb-3">Difficulty</p>
          <div className="grid grid-cols-3 gap-2">
            {DIFF_LABELS.map(({ d, label, color }) => (
              <button
                key={d}
                onClick={() => toggleDiff(d)}
                className={`py-3 rounded-xl font-bold text-sm border transition ${
                  difficulties.includes(d)
                    ? `${color} text-white`
                    : "bg-white/5 border-white/10 text-indigo-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase text-indigo-300">Categories</p>
            <button
              onClick={() =>
                categories.length === TOURNAMENT_CATEGORIES.length
                  ? setCategories([TOURNAMENT_CATEGORIES[0].id])
                  : setCategories(TOURNAMENT_CATEGORIES.map((c) => c.id))
              }
              className="text-xs text-indigo-400 hover:text-amber-300"
            >
              {categories.length === TOURNAMENT_CATEGORIES.length ? "Deselect all" : "Select all"}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {TOURNAMENT_CATEGORIES.map((cat) => {
              const on = categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition ${
                    on
                      ? "bg-amber-500/20 border-amber-400/40 text-white"
                      : "bg-white/5 border-white/10 text-indigo-500"
                  }`}
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-sm font-medium flex-1">{cat.label}</span>
                  {on && <span className="text-amber-400 text-xs font-bold">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={start}
          className="w-full py-5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-black text-xl rounded-2xl transition flex items-center justify-center gap-2 shadow-xl"
        >
          <BookOpen size={24} />
          Start Practice
        </button>

      </div>

      <button
        onClick={() => router.push("/tournament")}
        className="text-indigo-400 hover:text-white text-sm transition"
      >
        ← Tournament Lobby
      </button>
    </div>
  );
}

// ── Question screen ───────────────────────────────────────────────────────────

function QuestionScreen({
  q, index, total, score, streak, onAnswer,
}: {
  q:        TournamentQuestion;
  index:    number;
  total:    number;
  score:    number;
  streak:   number;
  onAnswer: (given: string, correct: boolean, timeMs: number, pts: number) => void;
}) {
  const [selected,   setSelected]   = useState<string | null>(null);
  const [textInput,  setTextInput]  = useState("");
  const [answered,   setAnswered]   = useState(false);
  const startRef                    = useRef(Date.now());

  useEffect(() => {
    setSelected(null);
    setTextInput("");
    setAnswered(false);
    startRef.current = Date.now();
  }, [q.id]);

  const submit = useCallback((given: string) => {
    if (answered) return;
    setAnswered(true);
    const timeMs = Date.now() - startRef.current;
    const ok     = isCorrect(q, given);
    // Speed bonus: up to +50% of base points if answered in first half of time
    const halfMs      = (q.timeLimitSec * 1000) / 2;
    const speedBonus  = ok && timeMs < halfMs ? Math.round(q.points * 0.5) : 0;
    const pts         = ok ? q.points + speedBonus : 0;
    onAnswer(given, ok, timeMs, pts);
  }, [answered, q, onAnswer]);

  const expire = useCallback(() => { if (!answered) submit(""); }, [answered, submit]);

  // MC
  if (q.type === "mc") {
    return (
      <div className="flex flex-col gap-3 w-full">
        {(q.options ?? []).map((opt) => (
          <button
            key={opt}
            disabled={answered}
            onClick={() => { setSelected(opt); submit(opt); }}
            className={`w-full p-4 rounded-xl text-left font-semibold border transition-all ${
              selected === opt
                ? "bg-amber-500 border-amber-400 text-black scale-[.98]"
                : answered
                ? "bg-white/5 border-white/10 text-indigo-400 cursor-default"
                : "bg-white/10 border-white/20 text-white hover:bg-white/20 active:scale-[.98]"
            }`}
          >
            {opt}
          </button>
        ))}
        <CountdownBar startedAt={startRef.current} limitSec={q.timeLimitSec} onExpire={expire} />
      </div>
    );
  }

  // Verse / buzz → text input
  return (
    <div className="flex flex-col gap-3 w-full">
      {q.verseRef && (
        <p className="text-amber-300 text-sm text-center font-medium">📖 {q.verseRef}</p>
      )}
      <input
        autoFocus
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && textInput.trim() && submit(textInput.trim())}
        disabled={answered}
        placeholder={q.type === "verse" ? "Complete the verse…" : "Type your answer…"}
        className="w-full p-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-indigo-500 outline-none focus:border-amber-400/60 disabled:opacity-50 text-lg"
      />
      <button
        onClick={() => textInput.trim() && submit(textInput.trim())}
        disabled={answered || !textInput.trim()}
        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl disabled:opacity-40"
      >
        Submit
      </button>
      <CountdownBar startedAt={startRef.current} limitSec={q.timeLimitSec} onExpire={expire} />
    </div>
  );
}

// ── Feedback overlay ──────────────────────────────────────────────────────────

function FeedbackOverlay({
  record, onNext, isLast,
}: {
  record: AnswerRecord;
  onNext: () => void;
  isLast: boolean;
}) {
  const { question: q, given, correct, timeMs, pointsEarned } = record;

  useEffect(() => {
    const t = setTimeout(onNext, 2200);
    return () => clearTimeout(t);
  }, [onNext]);

  return (
    <div className="flex flex-col gap-4 w-full animate-in fade-in duration-200">
      {/* Result banner */}
      <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
        correct
          ? "bg-green-900/50 border-green-500/60"
          : "bg-red-900/50   border-red-500/60"
      }`}>
        {correct
          ? <CheckCircle2 size={28} className="text-green-400 shrink-0" />
          : <XCircle      size={28} className="text-red-400   shrink-0" />}
        <div className="flex-1">
          <p className={`font-bold text-lg ${correct ? "text-green-300" : "text-red-300"}`}>
            {correct ? "Correct!" : given ? "Not quite" : "Time's up!"}
          </p>
          {!correct && given && (
            <p className="text-indigo-300 text-xs">Your answer: {given}</p>
          )}
        </div>
        {correct && (
          <p className="text-green-400 font-black text-xl">+{pointsEarned}</p>
        )}
      </div>

      {/* Correct answer */}
      {!correct && (
        <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
          <p className="text-indigo-400 text-xs uppercase font-bold mb-1">Correct Answer</p>
          <p className="text-white font-semibold">{q.answer}</p>
          {q.reference && (
            <p className="text-indigo-400 text-xs mt-1">{q.reference}</p>
          )}
        </div>
      )}

      {/* Time */}
      <p className="text-center text-indigo-500 text-xs">
        {given ? `Answered in ${formatTime(timeMs)}` : "Time expired"}
        {correct && timeMs < (q.timeLimitSec * 500) && " ⚡ Speed bonus!"}
      </p>

      {/* Next hint */}
      <p className="text-center text-indigo-400 text-xs animate-pulse">
        {isLast ? "Loading results…" : "Next question in a moment…"}
      </p>
    </div>
  );
}

// ── Results screen ────────────────────────────────────────────────────────────

function ResultsScreen({
  records, onPlayAgain,
}: {
  records: AnswerRecord[];
  onPlayAgain: () => void;
}) {
  const router       = useRouter();
  const totalScore   = records.reduce((s, r) => s + r.pointsEarned, 0);
  const maxScore     = records.reduce((s, r) => s + r.question.points + Math.round(r.question.points * 0.5), 0);
  const correct      = records.filter((r) => r.correct).length;
  const accuracy     = Math.round((correct / records.length) * 100);
  const avgTime      = Math.round(records.filter((r) => r.given).reduce((s, r) => s + r.timeMs, 0) / Math.max(1, records.filter((r) => r.given).length));

  // Best streak
  let best = 0, cur = 0;
  records.forEach((r) => { cur = r.correct ? cur + 1 : 0; best = Math.max(best, cur); });

  const grade =
    accuracy >= 90 ? "S" :
    accuracy >= 80 ? "A" :
    accuracy >= 65 ? "B" :
    accuracy >= 50 ? "C" : "D";

  const gradeColor =
    grade === "S" ? "text-amber-300" :
    grade === "A" ? "text-green-400" :
    grade === "B" ? "text-blue-400"  :
    grade === "C" ? "text-indigo-300": "text-red-400";

  const shareText = `📖 Bible Bowl Solo Practice\n${correct}/${records.length} correct · ${totalScore.toLocaleString()} pts · Grade ${grade}\nTry it at scripturelives.com/solo`;

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ text: shareText }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareText).catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center px-4 py-12 text-white gap-6">

      {/* Grade */}
      <div className="text-center">
        <p className={`text-8xl font-black ${gradeColor}`}>{grade}</p>
        <p className="text-indigo-300 text-sm mt-1">
          {grade === "S" ? "Scripture Scholar! 🏆" :
           grade === "A" ? "Excellent work! 🌟" :
           grade === "B" ? "Solid knowledge! 📖" :
           grade === "C" ? "Keep studying! 💪" : "Don't give up! 🙏"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {[
          { label: "Score",     value: totalScore.toLocaleString(), sub: `of ${maxScore.toLocaleString()} max`, icon: "🏆" },
          { label: "Accuracy",  value: `${accuracy}%`,              sub: `${correct} of ${records.length}`,   icon: "🎯" },
          { label: "Avg Time",  value: formatTime(avgTime),         sub: "per question",                       icon: "⏱️" },
          { label: "Best Streak", value: `${best}🔥`,               sub: "correct in a row",                   icon: "🔥" },
        ].map(({ label, value, sub, icon }) => (
          <div key={label} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
            <p className="text-xl mb-0.5">{icon}</p>
            <p className="text-white font-black text-xl">{value}</p>
            <p className="text-indigo-400 text-xs font-semibold uppercase">{label}</p>
            <p className="text-indigo-500 text-xs">{sub}</p>
          </div>
        ))}
      </div>

      {/* Question breakdown */}
      <div className="w-full max-w-sm">
        <p className="text-indigo-300 text-xs font-bold uppercase mb-2">Question Breakdown</p>
        <div className="flex flex-col gap-2">
          {records.map((r, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
                r.correct
                  ? "bg-green-900/30 border-green-500/30"
                  : "bg-red-900/30   border-red-500/30"
              }`}
            >
              {r.correct
                ? <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                : <XCircle      size={16} className="text-red-400   shrink-0" />}
              <span className="flex-1 text-white text-xs leading-snug line-clamp-2">
                {r.question.text}
              </span>
              <div className="text-right shrink-0">
                {r.correct && (
                  <p className="text-green-400 font-bold text-xs">+{r.pointsEarned}</p>
                )}
                <p className="text-indigo-500 text-xs">{formatTime(r.timeMs)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-lg rounded-2xl flex items-center justify-center gap-2"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
        <button
          onClick={share}
          className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl"
        >
          📤 Share Score
        </button>
        <button
          onClick={() => router.push("/tournament")}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl"
        >
          Tournament Lobby
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function SoloPage() {
  const [phase,     setPhase]     = useState<Phase>("setup");
  const [questions, setQuestions] = useState<TournamentQuestion[]>([]);
  const [index,     setIndex]     = useState(0);
  const [score,     setScore]     = useState(0);
  const [streak,    setStreak]    = useState(0);
  const [bestStreak,setBestStreak]= useState(0);
  const [records,   setRecords]   = useState<AnswerRecord[]>([]);
  const [pending,   setPending]   = useState<AnswerRecord | null>(null);

  const handleStart = (qs: TournamentQuestion[]) => {
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setRecords([]);
    setPending(null);
    setPhase("playing");
  };

  const handleAnswer = useCallback((
    given: string, correct: boolean, timeMs: number, pts: number
  ) => {
    const q   = questions[index];
    const rec: AnswerRecord = { question: q, given, correct, timeMs, pointsEarned: pts };
    setPending(rec);
    setScore((s) => s + pts);
    setStreak((prev) => {
      const ns = correct ? prev + 1 : 0;
      setBestStreak((b) => Math.max(b, ns));
      return ns;
    });
    setRecords((prev) => [...prev, rec]);
    setPhase("feedback");
  }, [questions, index]);

  const handleNext = useCallback(() => {
    const nextIdx = index + 1;
    if (nextIdx >= questions.length) {
      setPhase("complete");
    } else {
      setIndex(nextIdx);
      setPending(null);
      setPhase("playing");
    }
  }, [index, questions.length]);

  const handleReset = () => {
    setPhase("setup");
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setRecords([]);
    setPending(null);
  };

  if (phase === "setup") return <SetupScreen onStart={handleStart} />;
  if (phase === "complete") return <ResultsScreen records={records} onPlayAgain={handleReset} />;

  const q = questions[index];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 flex flex-col items-center px-4 py-6 text-white gap-5">

      {/* Top bar */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-400 font-black text-lg">
          <Trophy size={18} />
          {score.toLocaleString()}
        </div>
        <span className="text-indigo-400 text-sm">
          Q {index + 1} / {questions.length}
        </span>
        {streak >= 2 && (
          <div className="flex items-center gap-1 text-orange-400 font-bold">
            <Flame size={16} />
            {streak}
          </div>
        )}
        {streak < 2 && <div className="w-12" />}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-md">
        {questions.map((_, i) => {
          const rec = records[i];
          return (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i < records.length
                  ? records[i].correct ? "bg-green-500" : "bg-red-500"
                  : i === index
                  ? "bg-amber-400 scale-125"
                  : "bg-white/20"
              }`}
            />
          );
        })}
      </div>

      {/* Question card */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-purple-700/50 text-purple-300 text-xs rounded-full">
            {q.category}
          </span>
          <span className={`px-2 py-0.5 text-xs rounded-full ${
            q.difficulty === "easy"   ? "bg-green-800/50 text-green-300" :
            q.difficulty === "medium" ? "bg-amber-800/50 text-amber-300" :
                                        "bg-red-800/50   text-red-300"
          }`}>
            {q.difficulty}
          </span>
          <span className="ml-auto text-amber-400 text-sm font-bold">+{q.points} pts</span>
        </div>

        {/* Question text */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-5">
          <p className="text-white font-semibold text-base leading-relaxed">{q.text}</p>
        </div>

        {/* Answer area */}
        {phase === "playing" && (
          <QuestionScreen
            q={q}
            index={index}
            total={questions.length}
            score={score}
            streak={streak}
            onAnswer={handleAnswer}
          />
        )}

        {phase === "feedback" && pending && (
          <FeedbackOverlay
            record={pending}
            onNext={handleNext}
            isLast={index === questions.length - 1}
          />
        )}
      </div>
    </div>
  );
}
