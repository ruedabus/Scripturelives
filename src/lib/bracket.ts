import type { BracketMatch, Player, TournamentQuestion } from "@/lib/tournamentTypes";
import { TOURNAMENT_QUESTIONS } from "@/data/tournamentQuestions";

// ── Progressive difficulty ───────────────────────────────────────────────────
//
//  Round 1              → easy only
//  Round 2              → easy + medium
//  Semifinals           → medium + hard
//  Finals (last round)  → hard only
//
//  If the host capped difficulty (e.g. "easy + medium"), we stay within that cap.

function getDifficultiesForRound(
  round: number,
  totalRounds: number,
  maxDifficulties: ("easy" | "medium" | "hard")[]
): ("easy" | "medium" | "hard")[] {
  const ALL: ("easy" | "medium" | "hard")[] = ["easy", "medium", "hard"];
  const cap = ALL.filter((d) => maxDifficulties.includes(d));

  // Single-round tournament → use all allowed difficulties
  if (totalRounds === 1) return cap;

  const progress = round / totalRounds;

  let natural: ("easy" | "medium" | "hard")[];
  if (progress <= 0.35)       natural = ["easy"];
  else if (progress <= 0.65)  natural = ["easy", "medium"];
  else if (progress < 1)      natural = ["medium", "hard"];
  else                        natural = ["hard"];

  // Intersect with host's cap; fall back to full cap if empty
  const intersected = natural.filter((d) => cap.includes(d));
  return intersected.length > 0 ? intersected : cap;
}

// ── Bracket generation ──────────────────────────────────────────────────────

/**
 * Builds a single-elimination bracket for N players.
 * Pads to next power of 2 with byes so the bracket stays clean.
 * Questions are picked per match based on round difficulty progression
 * and the host's selected categories.
 */
export function generateBracket(
  players: Player[],
  questionsPerMatch: number,
  maxDifficulties: ("easy" | "medium" | "hard")[],
  categories: string[] = []
): BracketMatch[] {
  const n      = players.length;
  const slots  = nextPow2(n);
  const rounds = Math.ceil(Math.log2(slots));

  // Seed players randomly
  const seeded    = shuffle([...players]);
  const paddedIds: (string | null)[] = seeded.map((p) => p.id);
  while (paddedIds.length < slots) paddedIds.push(null);

  const matches: BracketMatch[] = [];

  // Round 1 — pair up seeds
  for (let i = 0; i < slots / 2; i++) {
    const isBye = !paddedIds[i * 2 + 1];
    matches.push(makeBracketMatch({
      round: 1, totalRounds: rounds, slot: i,
      player1Id: paddedIds[i * 2],
      player2Id: paddedIds[i * 2 + 1],
      isBye,
      questionsPerMatch,
      maxDifficulties,
      categories,
    }));
  }

  // Subsequent rounds — player IDs filled in as winners advance
  let prevRoundCount = slots / 2;
  for (let r = 2; r <= rounds; r++) {
    prevRoundCount = prevRoundCount / 2;
    const isFinals    = r === rounds;
    const qCount      = isFinals ? Math.min(questionsPerMatch + 2, 7) : questionsPerMatch;
    for (let i = 0; i < prevRoundCount; i++) {
      matches.push(makeBracketMatch({
        round: r, totalRounds: rounds, slot: i,
        player1Id: null, player2Id: null,
        isBye: false,
        questionsPerMatch: qCount,
        maxDifficulties,
        categories,
      }));
    }
  }

  return matches;
}

function makeBracketMatch({
  round, totalRounds, slot, player1Id, player2Id, isBye,
  questionsPerMatch, maxDifficulties, categories,
}: {
  round: number;
  totalRounds: number;
  slot: number;
  player1Id: string | null;
  player2Id: string | null;
  isBye: boolean;
  questionsPerMatch: number;
  maxDifficulties: ("easy" | "medium" | "hard")[];
  categories: string[];
}): BracketMatch {
  const difficulties = getDifficultiesForRound(round, totalRounds, maxDifficulties);
  return {
    id:          `r${round}-s${slot}`,
    round,
    slot,
    player1Id,
    player2Id,
    winnerId:    isBye ? player1Id : null,
    loserId:     null,
    isBye,
    questions:   isBye ? [] : pickQuestions(questionsPerMatch, difficulties, categories),
    answers:     {},
    matchScore:  {},
    status:      isBye ? "complete" : "pending",
  };
}

/**
 * After a match completes, advance the winner to the next round's bracket slot.
 */
export function advanceWinner(matches: BracketMatch[], completedMatch: BracketMatch): BracketMatch[] {
  const { round, slot, winnerId } = completedMatch;
  const nextRound = round + 1;
  const nextSlot  = Math.floor(slot / 2);

  return matches.map((m) => {
    if (m.round !== nextRound || m.slot !== nextSlot) return m;
    if (slot % 2 === 0) return { ...m, player1Id: winnerId };
    return { ...m, player2Id: winnerId };
  });
}

/** Check if the entire tournament is over. */
export function isTournamentComplete(matches: BracketMatch[]): boolean {
  return matches.every((m) => m.status === "complete" || m.isBye);
}

/** Get the next pending match with both players filled. */
export function getNextMatch(matches: BracketMatch[]): BracketMatch | undefined {
  return matches.find(
    (m) => m.status === "pending" && !m.isBye && m.player1Id && m.player2Id
  );
}

// ── Question selection ──────────────────────────────────────────────────────

const usedQuestionIds = new Set<string>();

export function pickQuestions(
  count: number,
  difficulties: ("easy" | "medium" | "hard")[],
  categories: string[] = [],
  customPool?: TournamentQuestion[]
): TournamentQuestion[] {
  const base = customPool ?? TOURNAMENT_QUESTIONS;

  // Filter by difficulty and unused
  let pool = base.filter(
    (q) => difficulties.includes(q.difficulty) && !usedQuestionIds.has(q.id)
  );

  // Filter by category if categories were specified
  if (categories.length > 0) {
    const catFiltered = pool.filter((q) => categories.includes(q.category));
    // Fall back to full pool if category filter leaves too few questions
    if (catFiltered.length >= count) pool = catFiltered;
  }

  // If still not enough, relax difficulty constraint
  if (pool.length < count) {
    pool = base.filter((q) => !usedQuestionIds.has(q.id));
    if (categories.length > 0) {
      const catFiltered = pool.filter((q) => categories.includes(q.category));
      if (catFiltered.length >= count) pool = catFiltered;
    }
  }

  const picked = shuffle(pool).slice(0, count);
  picked.forEach((q) => usedQuestionIds.add(q.id));
  return picked;
}

export function resetUsedQuestions() {
  usedQuestionIds.clear();
}

// ── Scoring ──────────────────────────────────────────────────────────────────

/**
 * Determine match winner based on questions won.
 * Returns null if match is still in progress.
 */
export function getMatchWinner(
  match: BracketMatch
): { winnerId: string; loserId: string } | null {
  const { player1Id, player2Id, matchScore, questions } = match;
  if (!player1Id || !player2Id) return null;

  const p1wins = matchScore[player1Id] ?? 0;
  const p2wins = matchScore[player2Id] ?? 0;
  const half   = Math.ceil(questions.length / 2);

  if (p1wins >= half) return { winnerId: player1Id, loserId: player2Id };
  if (p2wins >= half) return { winnerId: player2Id, loserId: player1Id };
  return null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
