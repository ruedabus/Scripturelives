// ── Tournament Types ────────────────────────────────────────────────────────

export type QuestionType = "mc" | "buzz" | "verse";
export type GamePhase =
  | "lobby"       // waiting for players
  | "seeding"     // bracket is set, about to start
  | "matchup"     // showing current matchup intro
  | "question"    // question is live
  | "buzzed"      // someone buzzed in (buzz rounds only)
  | "revealed"    // answer revealed, showing results
  | "advancing"   // animating bracket advance
  | "complete";   // tournament over

export type TournamentQuestion = {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];      // MC: 4 options
  answer: string;          // correct answer (exact match for MC, or key phrase for verse)
  verseRef?: string;       // e.g. "John 3:16"
  reference?: string;      // Bible book/passage context
  category: string;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  timeLimitSec: number;
};

export type Player = {
  id: string;
  name: string;
  avatarEmoji: string;
  joinedAt: number;
  // in-game stats
  score: number;
  wins: number;
  correctAnswers: number;
  buzzWins: number;
  verseCorrect: number;
  eliminated: boolean;
  placement: number | null; // 1st, 2nd, etc.
};

export type MatchAnswer = {
  playerId: string;
  answer: string;
  submittedAt: number; // server timestamp ms
  correct: boolean;
  pointsEarned: number;
  buzzedAt?: number;   // for buzz rounds: when they buzzed in
};

export type BracketMatch = {
  id: string;
  round: number;        // 1 = first round, higher = later rounds
  slot: number;         // position within the round (0-indexed)
  player1Id: string | null;
  player2Id: string | null;
  winnerId: string | null;
  loserId: string | null;
  isBye: boolean;       // auto-advance if opponent slot is empty
  questions: TournamentQuestion[];
  answers: Record<string, MatchAnswer[]>; // playerId → answers array
  matchScore: Record<string, number>;     // playerId → questions won
  status: "pending" | "active" | "complete";
};

export type Award = {
  playerId: string;
  title: string;
  description: string;
  emoji: string;
};

export type GameSettings = {
  questionsPerMatch: number;       // default 3 (best of 3)
  finalQuestionsPerMatch: number;  // default 5 (best of 5)
  categories: string[];
  difficulties: ("easy" | "medium" | "hard")[];
  includeAiQuestions: boolean;
  aiTopic?: string;
};

export type GameRoom = {
  code: string;
  hostId: string;
  createdAt: number;
  phase: GamePhase;
  players: Record<string, Player>;
  bracket: BracketMatch[];
  currentMatchId: string | null;
  currentQuestionIndex: number;    // which question in the current match
  currentQuestion: TournamentQuestion | null;
  questionStartedAt: number | null;
  buzzedPlayerId: string | null;   // who buzzed in (buzz rounds)
  buzzedAt: number | null;
  settings: GameSettings;
  awards: Award[];
  chatMessages: ChatMessage[];
  lastUpdated: number;
};

export type ChatMessage = {
  id: string;
  text: string;
  type: "system" | "reaction";
  emoji?: string;
  at: number;
};

// ── Derived helpers ─────────────────────────────────────────────────────────

export function getRoundName(round: number, totalRounds: number): string {
  if (round === totalRounds) return "🏆 Championship";
  if (round === totalRounds - 1) return "🥊 Semifinals";
  if (round === totalRounds - 2) return "⚔️ Quarterfinals";
  return `Round ${round}`;
}

export function getTotalRounds(playerCount: number): number {
  return Math.ceil(Math.log2(Math.max(playerCount, 2)));
}

// ── Tournament categories ────────────────────────────────────────────────────

export const TOURNAMENT_CATEGORIES = [
  { id: "Old Testament",        label: "Old Testament",       emoji: "📜", desc: "History, law, and the patriarchs" },
  { id: "Gospels",              label: "Gospels",             emoji: "✝️",  desc: "Life and teachings of Jesus"     },
  { id: "New Testament",        label: "New Testament",       emoji: "📖", desc: "Acts and general NT knowledge"    },
  { id: "Letters & Epistles",   label: "Letters & Epistles",  emoji: "✉️",  desc: "Paul's letters and general epistles" },
  { id: "Prophecy & Revelation",label: "Prophecy",            emoji: "🔮", desc: "Prophets, Daniel, and Revelation" },
  { id: "Psalms & Wisdom",      label: "Psalms & Wisdom",     emoji: "🎶", desc: "Psalms, Proverbs, Job, Ecclesiastes" },
] as const;

export type TournamentCategory = typeof TOURNAMENT_CATEGORIES[number]["id"];

export const BIBLE_AVATARS = [
  "👑", "⚔️", "📜", "🕊️", "🌟", "🦁", "🐑", "🌿",
  "🏹", "🎺", "🌊", "🔥", "🌙", "☀️", "🪨", "🍞",
];

export const AWARDS_CONFIG = [
  { id: "champion",     title: "Champion of Champions",   emoji: "🏆", desc: "Tournament winner"                          },
  { id: "runner_up",   title: "Silver Shield",            emoji: "🥈", desc: "Finalist — nearly the crown"               },
  { id: "ot_master",   title: "Wisdom of Solomon",        emoji: "👑", desc: "Most correct Old Testament answers"        },
  { id: "nt_master",   title: "Scribe of the Apostles",   emoji: "📜", desc: "Most correct New Testament answers"        },
  { id: "buzz_king",   title: "Voice of the Prophets",    emoji: "📯", desc: "Most buzz-in rounds won"                   },
  { id: "verse_hero",  title: "Keeper of the Word",       emoji: "📖", desc: "Most verse completion questions correct"   },
  { id: "fastest",     title: "Swift as an Eagle",        emoji: "🦅", desc: "Fastest average answer time"              },
  { id: "first_out",   title: "Thomas the Doubter",       emoji: "🤔", desc: "First eliminated — come back stronger!"   },
];
