"use client";

import React, { useState, useCallback } from "react";
import {
  Trophy, BookOpen, RefreshCw, ChevronRight, Star, CheckCircle2,
  XCircle, HelpCircle, Layers, Clock, BarChart3, BookMarked,
} from "lucide-react";
import {
  QuizQuestion, QuizCategory, QuizDifficulty,
  QUIZ_CATEGORIES, buildQuiz,
} from "@/data/quizQuestions";

// ── Constants ─────────────────────────────────────────────────────────────────
const QUESTIONS_PER_QUIZ = 10;

const CATEGORY_STYLE: Record<QuizCategory, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  "Old Testament":    { bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  icon: <BookOpen  size={15} /> },
  "New Testament":    { bg: "bg-sky-50",     text: "text-sky-700",    border: "border-sky-200",    icon: <BookMarked size={15} /> },
  "Bible Characters": { bg: "bg-orange-50",  text: "text-orange-700", border: "border-orange-200", icon: <HelpCircle size={15} /> },
  "Books & Prophecy": { bg: "bg-purple-50",  text: "text-purple-700", border: "border-purple-200", icon: <Layers    size={15} /> },
};

const DIFFICULTY_STYLE: Record<QuizDifficulty, { label: string; dot: string }> = {
  easy:   { label: "Easy",   dot: "bg-green-400"  },
  medium: { label: "Medium", dot: "bg-yellow-400" },
  hard:   { label: "Hard",   dot: "bg-red-400"    },
};

function getGrade(pct: number): { letter: string; color: string } {
  if (pct >= 90) return { letter: "A+", color: "text-green-600"  };
  if (pct >= 80) return { letter: "A",  color: "text-green-500"  };
  if (pct >= 70) return { letter: "B",  color: "text-sky-600"    };
  if (pct >= 60) return { letter: "C",  color: "text-yellow-600" };
  return              { letter: "D",  color: "text-red-500"     };
}

function Stars({ pct }: { pct: number }) {
  const count = pct >= 80 ? 3 : pct >= 60 ? 2 : pct >= 40 ? 1 : 0;
  return (
    <div className="flex gap-1 justify-center my-1">
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          size={28}
          className={i < count ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────
type Screen = "home" | "quiz" | "results";

interface QuizState {
  questions: QuizQuestion[];
  currentIdx: number;
  answers: (string | null)[];   // null = unanswered
  revealed: boolean;            // whether answer for current question is shown
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CategoryChip({
  cat, selected, onClick,
}: { cat: QuizCategory; selected: boolean; onClick: () => void }) {
  const s = CATEGORY_STYLE[cat];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
        selected ? `${s.bg} ${s.text} ${s.border}` : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
      }`}
    >
      {s.icon} {cat}
    </button>
  );
}

function DifficultyChip({
  diff, selected, onClick,
}: { diff: QuizDifficulty; selected: boolean; onClick: () => void }) {
  const s = DIFFICULTY_STYLE[diff];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition ${
        selected
          ? "bg-stone-800 text-white border-stone-800"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {s.label}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BibleQuiz() {
  const [screen, setScreen]   = useState<Screen>("home");
  const [quizState, setQuiz]  = useState<QuizState | null>(null);

  // ── Filter state ──────────────────────────────────────────────────────────
  const [selCategories, setSelCategories] = useState<QuizCategory[]>([...QUIZ_CATEGORIES]);
  const [selDiffs, setSelDiffs] = useState<QuizDifficulty[]>(["easy", "medium", "hard"]);

  const toggleCat  = (c: QuizCategory)    => setSelCategories((prev) => prev.includes(c) ? (prev.length > 1 ? prev.filter(x => x !== c) : prev) : [...prev, c]);
  const toggleDiff = (d: QuizDifficulty)  => setSelDiffs((prev)      => prev.includes(d) ? (prev.length > 1 ? prev.filter(x => x !== d) : prev) : [...prev, d]);

  // ── Start quiz ────────────────────────────────────────────────────────────
  const startQuiz = useCallback(() => {
    const questions = buildQuiz({ categories: selCategories, difficulties: selDiffs, count: QUESTIONS_PER_QUIZ });
    if (questions.length === 0) return;
    setQuiz({ questions, currentIdx: 0, answers: Array(questions.length).fill(null), revealed: false });
    setScreen("quiz");
  }, [selCategories, selDiffs]);

  // ── Answer selection ──────────────────────────────────────────────────────
  const selectAnswer = useCallback((answer: string) => {
    if (!quizState || quizState.revealed) return;
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIdx] = answer;
    setQuiz({ ...quizState, answers: newAnswers, revealed: true });
  }, [quizState]);

  // ── Advance question ──────────────────────────────────────────────────────
  const nextQuestion = useCallback(() => {
    if (!quizState) return;
    if (quizState.currentIdx + 1 >= quizState.questions.length) {
      setScreen("results");
    } else {
      setQuiz({ ...quizState, currentIdx: quizState.currentIdx + 1, revealed: false });
    }
  }, [quizState]);

  // ── Restart ────────────────────────────────────────────────────────────────
  const restartSame = useCallback(() => {
    if (!quizState) return;
    const questions = buildQuiz({ categories: selCategories, difficulties: selDiffs, count: QUESTIONS_PER_QUIZ });
    setQuiz({ questions, currentIdx: 0, answers: Array(questions.length).fill(null), revealed: false });
    setScreen("quiz");
  }, [quizState, selCategories, selDiffs]);

  const goHome = () => { setScreen("home"); setQuiz(null); };

  // ── Render: Home ──────────────────────────────────────────────────────────
  if (screen === "home") {
    const approxCount = buildQuiz({ categories: selCategories, difficulties: selDiffs, count: 999 }).length;
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="border-b border-gray-200 pb-3">
          <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2">
            <Trophy size={18} /> Bible Quiz & Trivia
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Test your Bible knowledge — 80 questions across 4 categories</p>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Categories</p>
          <div className="flex flex-wrap gap-2">
            {QUIZ_CATEGORIES.map((c) => (
              <CategoryChip key={c} cat={c} selected={selCategories.includes(c)} onClick={() => toggleCat(c)} />
            ))}
          </div>
        </div>

        {/* Difficulty filter */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Difficulty</p>
          <div className="flex gap-2 flex-wrap">
            {(["easy", "medium", "hard"] as QuizDifficulty[]).map((d) => (
              <DifficultyChip key={d} diff={d} selected={selDiffs.includes(d)} onClick={() => toggleDiff(d)} />
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-center gap-3 text-xs text-amber-700">
          <BarChart3 size={16} className="shrink-0" />
          <span>
            <strong>{Math.min(approxCount, QUESTIONS_PER_QUIZ)}</strong> questions drawn from a pool of{" "}
            <strong>{approxCount}</strong> matching your filters
          </span>
        </div>

        {/* How to play */}
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-3 space-y-1.5 text-xs text-stone-600">
          <p className="font-semibold text-stone-700 flex items-center gap-1"><Clock size={12} /> How to play</p>
          <p>• Select an answer — feedback is instant with a Bible reference</p>
          <p>• Mix of multiple choice (4 options) and true / false</p>
          <p>• Each quiz draws {QUESTIONS_PER_QUIZ} random questions from your chosen filters</p>
        </div>

        {/* Start button */}
        <button
          type="button"
          onClick={startQuiz}
          disabled={approxCount === 0}
          className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-stone-900 font-bold py-3 transition flex items-center justify-center gap-2"
        >
          <Trophy size={17} /> Start Quiz
        </button>
      </div>
    );
  }

  // ── Render: Quiz ──────────────────────────────────────────────────────────
  if (screen === "quiz" && quizState) {
    const { questions, currentIdx, answers, revealed } = quizState;
    const q             = questions[currentIdx];
    const chosenAnswer  = answers[currentIdx];
    const isCorrect     = chosenAnswer === q.correctAnswer;
    const progress      = ((currentIdx) / questions.length) * 100;
    const score         = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const cs            = CATEGORY_STYLE[q.category];
    const ds            = DIFFICULTY_STYLE[q.difficulty];

    return (
      <div className="space-y-4">
        {/* Progress bar + meta */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-400">Question {currentIdx + 1} / {questions.length}</span>
            <span className="text-xs font-semibold text-amber-700">Score: {score}/{currentIdx + (revealed ? 1 : 0)}</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category + difficulty */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${cs.bg} ${cs.text} ${cs.border}`}>
            {cs.icon} {q.category}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-400">
            <span className={`w-1.5 h-1.5 rounded-full ${ds.dot}`} />
            {ds.label}
          </span>
          <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-gray-300">
            {q.type === "tf" ? "True / False" : "Multiple Choice"}
          </span>
        </div>

        {/* Question */}
        <div className="rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50 border border-amber-100 p-4">
          <p className="text-base font-semibold text-stone-800 leading-snug">{q.question}</p>
        </div>

        {/* Options */}
        <div className={`grid gap-2.5 ${q.type === "tf" ? "grid-cols-2" : "grid-cols-1"}`}>
          {q.options.map((opt) => {
            let btnClass = "rounded-xl border px-4 py-3 text-sm font-medium text-left transition ";
            if (!revealed) {
              btnClass += "bg-white border-gray-200 text-gray-700 hover:border-amber-400 hover:bg-amber-50 cursor-pointer";
            } else if (opt === q.correctAnswer) {
              btnClass += "bg-green-50 border-green-400 text-green-700 cursor-default";
            } else if (opt === chosenAnswer) {
              btnClass += "bg-red-50 border-red-400 text-red-600 cursor-default";
            } else {
              btnClass += "bg-gray-50 border-gray-100 text-gray-400 cursor-default";
            }

            return (
              <button
                key={opt}
                type="button"
                disabled={revealed}
                onClick={() => selectAnswer(opt)}
                className={btnClass}
              >
                <span className="flex items-center gap-2">
                  {revealed && opt === q.correctAnswer && <CheckCircle2 size={15} className="text-green-500 shrink-0" />}
                  {revealed && opt === chosenAnswer && opt !== q.correctAnswer && <XCircle size={15} className="text-red-400 shrink-0" />}
                  {opt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback + explanation */}
        {revealed && (
          <div className={`rounded-xl border p-3.5 text-sm space-y-1 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            <p className={`font-bold flex items-center gap-1.5 ${isCorrect ? "text-green-700" : "text-red-600"}`}>
              {isCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              {isCorrect ? "Correct!" : `Incorrect — the answer is: ${q.correctAnswer}`}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
            {q.reference && (
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <BookOpen size={11} /> {q.reference}
              </p>
            )}
          </div>
        )}

        {/* Next / Finish */}
        {revealed && (
          <button
            type="button"
            onClick={nextQuestion}
            className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 transition flex items-center justify-center gap-2"
          >
            {currentIdx + 1 < questions.length ? (
              <><ChevronRight size={17} /> Next Question</>
            ) : (
              <><Trophy size={17} /> See Results</>
            )}
          </button>
        )}
      </div>
    );
  }

  // ── Render: Results ───────────────────────────────────────────────────────
  if (screen === "results" && quizState) {
    const { questions, answers } = quizState;
    const score   = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
    const total   = questions.length;
    const pct     = Math.round((score / total) * 100);
    const grade   = getGrade(pct);

    // Per-category breakdown
    const catBreakdown = QUIZ_CATEGORIES.map((cat) => {
      const qs   = questions.filter((q) => q.category === cat);
      const corr = qs.filter((q, qi) => {
        const globalIdx = questions.indexOf(q);
        return answers[globalIdx] === q.correctAnswer;
      }).length;
      return { cat, correct: corr, total: qs.length };
    }).filter((b) => b.total > 0);

    return (
      <div className="space-y-5">
        {/* Result card */}
        <div className="rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50 border border-amber-100 p-5 text-center">
          <Stars pct={pct} />
          <div className="mt-2">
            <span className="text-5xl font-black text-stone-800">{score}</span>
            <span className="text-2xl font-bold text-gray-400">/{total}</span>
          </div>
          <p className={`text-2xl font-black mt-1 ${grade.color}`}>{grade.letter}</p>
          <p className="text-sm text-gray-500 mt-0.5">{pct}% correct</p>
          <p className="text-xs text-gray-400 mt-2 italic">
            {pct >= 90 ? "Outstanding — God's word is truly in your heart!" :
             pct >= 70 ? "Well done! Keep studying Scripture daily." :
             pct >= 50 ? "Good effort! A little more time in the Word will help." :
             "Keep going — every read brings you closer to God!"}
          </p>
        </div>

        {/* Category breakdown */}
        {catBreakdown.length > 1 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Breakdown</p>
            <div className="space-y-2">
              {catBreakdown.map(({ cat, correct, total: catTotal }) => {
                const catPct = catTotal > 0 ? Math.round((correct / catTotal) * 100) : 0;
                const cs = CATEGORY_STYLE[cat];
                return (
                  <div key={cat} className="flex items-center gap-2 text-xs">
                    <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold border ${cs.bg} ${cs.text} ${cs.border}`}>
                      {cs.icon} {cat}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-gray-500 w-12 text-right">{correct}/{catTotal}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={restartSame}
            className="flex-1 rounded-xl border border-amber-300 bg-amber-50 text-amber-700 font-bold py-2.5 text-sm transition hover:bg-amber-100 flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={14} /> Play Again
          </button>
          <button
            type="button"
            onClick={goHome}
            className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-2.5 text-sm transition flex items-center justify-center gap-1.5"
          >
            <Trophy size={14} /> New Quiz
          </button>
        </div>
      </div>
    );
  }

  return null;
}
