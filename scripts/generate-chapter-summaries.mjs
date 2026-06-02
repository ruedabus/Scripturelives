/**
 * generate-chapter-summaries.mjs
 *
 * Pre-generates 2-sentence chapter summaries for all 1,189 canonical Bible chapters.
 * Uses gpt-4o-mini with 10 concurrent requests. Saves progress after every book
 * so you can safely Ctrl-C and re-run — already-completed chapters are skipped.
 *
 * Usage (from project root):
 *   node scripts/generate-chapter-summaries.mjs
 *
 * Output: src/data/chapter-summaries/index.json
 * Estimated time: ~8-12 minutes   Estimated cost: ~$0.50-1.00
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const KJV_PATH  = join(ROOT, "src/data/bibles/normalized/kjv.json");
const OUT_DIR   = join(ROOT, "src/data/chapter-summaries");
const OUT_PATH  = join(OUT_DIR, "index.json");
const API_KEY   = process.env.OPENAI_API_KEY
                  || readEnvKey(join(ROOT, ".env.local"));

function readEnvKey(envPath) {
  if (!existsSync(envPath)) return "";
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const line  = lines.find((l) => l.startsWith("OPENAI_API_KEY="));
  return line ? line.split("=").slice(1).join("=").trim() : "";
}

if (!API_KEY) {
  console.error("❌  OPENAI_API_KEY not found. Add it to .env.local or export it.");
  process.exit(1);
}

// ── Canonical 66 books in order ───────────────────────────────────────────────
const BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalm","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi",
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians",
  "Galatians","Ephesians","Philippians","Colossians","1 Thessalonians",
  "2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

// ── Load KJV verses ────────────────────────────────────────────────────────────
console.log("📖  Loading KJV data…");
const verses = JSON.parse(readFileSync(KJV_PATH, "utf-8"));

// Group verses by "Book Chapter"
const chapterMap = {};
for (const v of verses) {
  if (!BOOKS.includes(v.book)) continue;
  const key = `${v.book} ${v.chapter}`;
  if (!chapterMap[key]) chapterMap[key] = [];
  chapterMap[key].push(v.text);
}

// ── Load existing progress ────────────────────────────────────────────────────
mkdirSync(OUT_DIR, { recursive: true });
const existing = existsSync(OUT_PATH)
  ? JSON.parse(readFileSync(OUT_PATH, "utf-8"))
  : {};

const total   = Object.keys(chapterMap).length;
const done    = Object.keys(existing).length;
console.log(`✅  Already done: ${done}/${total}`);

// ── GPT call ──────────────────────────────────────────────────────────────────
async function summarize(chapterKey, verseTexts) {
  const passage = verseTexts.join(" ").slice(0, 3000); // cap tokens
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 80,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You are a concise Bible scholar. Write exactly 2 sentences summarizing the given chapter. "
            + "Sentence 1: main events or themes. Sentence 2: key spiritual significance or takeaway. "
            + "Do not start with the chapter name. Plain text only, no markdown.",
        },
        {
          role: "user",
          content: `${chapterKey}:\n\n${passage}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// ── Process in batches of 10 ──────────────────────────────────────────────────
const allKeys = BOOKS.flatMap((book) => {
  const bookChapters = Object.keys(chapterMap)
    .filter((k) => k.startsWith(book + " "))
    .sort((a, b) => {
      const na = parseInt(a.split(" ").pop());
      const nb = parseInt(b.split(" ").pop());
      return na - nb;
    });
  return bookChapters;
});

const pending = allKeys.filter((k) => !existing[k]);
console.log(`⏳  Chapters to generate: ${pending.length}\n`);

if (pending.length === 0) {
  console.log("🎉  All chapters already generated!");
  process.exit(0);
}

const CONCURRENCY = 10;
let completed = 0;

for (let i = 0; i < pending.length; i += CONCURRENCY) {
  const batch = pending.slice(i, i + CONCURRENCY);

  const results = await Promise.allSettled(
    batch.map(async (key) => {
      const summary = await summarize(key, chapterMap[key]);
      return { key, summary };
    })
  );

  for (const r of results) {
    if (r.status === "fulfilled") {
      existing[r.value.key] = r.value.summary;
      completed++;
    } else {
      console.error(`  ❌  Failed: ${r.reason?.message}`);
    }
  }

  // Save progress after every batch
  writeFileSync(OUT_PATH, JSON.stringify(existing, null, 2));

  const pct = Math.round(((done + completed) / total) * 100);
  console.log(`  ${pct}%  [${done + completed}/${total}]  — last batch: ${batch[0]} … ${batch[batch.length - 1]}`);
}

console.log(`\n🎉  Done! ${Object.keys(existing).length} summaries saved to:\n    ${OUT_PATH}`);
