/**
 * Daily reading streak — pure client-side, persisted to localStorage.
 *
 * A "read" is counted once per calendar day, triggered when the user
 * successfully loads a Bible chapter.
 *
 * Data shape:
 *   currentStreak  – consecutive days including today (or yesterday if not yet read today)
 *   bestStreak     – all-time high
 *   lastReadDate   – "YYYY-MM-DD" of the most recent read
 *   totalDaysRead  – lifetime count of distinct days
 *   readDates      – sorted array of "YYYY-MM-DD" strings (last 90 days max)
 */

export const STREAK_KEY = "scripture-lives-streak";

export type StreakData = {
  currentStreak: number;
  bestStreak:    number;
  lastReadDate:  string;       // "YYYY-MM-DD" or ""
  totalDaysRead: number;
  readDates:     string[];     // sorted ascending, max 90 entries
};

const EMPTY: StreakData = {
  currentStreak: 0,
  bestStreak:    0,
  lastReadDate:  "",
  totalDaysRead: 0,
  readDates:     [],
};

/** Today as "YYYY-MM-DD" in local time */
export function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** "YYYY-MM-DD" → Date midnight local */
function parseDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Difference in calendar days (b − a) */
function daysDiff(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / msPerDay);
}

// ── Read / write ─────────────────────────────────────────────────────────────

export function loadStreak(): StreakData {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

function saveStreak(data: StreakData): void {
  try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch { /* ignore */ }
}

// ── Core logic ────────────────────────────────────────────────────────────────

/**
 * Call this whenever the user successfully reads a chapter.
 * Returns { data, isNewDay } — isNewDay = true when the streak advanced today.
 */
export function recordRead(): { data: StreakData; isNewDay: boolean } {
  const today = todayString();
  const prev  = loadStreak();

  // Already counted today — no change
  if (prev.lastReadDate === today) {
    return { data: prev, isNewDay: false };
  }

  const diff      = prev.lastReadDate ? daysDiff(prev.lastReadDate, today) : null;
  const continued = diff === 1;   // yesterday → today keeps the streak

  const newStreak  = continued ? prev.currentStreak + 1 : 1;
  const bestStreak = Math.max(prev.bestStreak, newStreak);

  // Add today to readDates (keep last 90 only)
  const readDates = [...prev.readDates.filter((d) => d !== today), today]
    .sort()
    .slice(-90);

  const data: StreakData = {
    currentStreak: newStreak,
    bestStreak,
    lastReadDate:  today,
    totalDaysRead: prev.totalDaysRead + 1,
    readDates,
  };

  saveStreak(data);
  return { data, isNewDay: true };
}

// ── Milestone helper ──────────────────────────────────────────────────────────

const MILESTONES = [3, 7, 14, 30, 60, 100, 365];

export function getMilestoneMessage(streak: number): string | null {
  if (!MILESTONES.includes(streak)) return null;
  const messages: Record<number, string> = {
    3:   "3 days in a row! A habit is forming 🌱",
    7:   "One full week! 'Thy word is a lamp unto my feet' — Ps 119:105 🔥",
    14:  "Two weeks strong! Keep pressing forward 💪",
    30:  "30-day streak! 'Blessed is the one who reads' — Rev 1:3 🏆",
    60:  "60 days! Your commitment is truly inspiring ✨",
    100: "100-day streak! Remarkable faithfulness 🎖️",
    365: "One full year! 'Well done, good and faithful servant' 🌟",
  };
  return messages[streak] ?? null;
}

// ── Streak health check ───────────────────────────────────────────────────────

/**
 * Returns true if the streak is still alive (read today OR yesterday).
 * Used to decide whether to show a "read today to keep your streak!" nudge.
 */
export function isStreakAlive(data: StreakData): boolean {
  if (!data.lastReadDate) return false;
  const diff = daysDiff(data.lastReadDate, todayString());
  return diff <= 1; // 0 = read today, 1 = read yesterday (still saveable)
}

/**
 * True when the streak is at risk: read yesterday but not yet today.
 */
export function isStreakAtRisk(data: StreakData): boolean {
  if (!data.lastReadDate || data.currentStreak < 1) return false;
  return daysDiff(data.lastReadDate, todayString()) === 1;
}
