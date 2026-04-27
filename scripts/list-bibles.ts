/**
 * Scripture Lives — Bible Discovery Script
 * Run:  npm run list-bibles
 *
 * Calls the api.bible API and lists every Bible available on your account,
 * sorted by language. Use this to find the exact Bible ID for the Spanish
 * Reina-Valera 1960 (or any other translation) and update API_BIBLE_RVR1960_ID
 * in your .env.local / Vercel environment variables.
 */

import https from "https";
import path from "path";
import fs from "fs";

// ── Load .env.local ───────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && val) process.env[key] = process.env[key] ?? val;
  }
}

loadEnv();

const API_KEY = process.env.API_BIBLE_KEY;
if (!API_KEY) {
  console.error("❌  API_BIBLE_KEY is not set in .env.local");
  process.exit(1);
}

// ── Fetch helper ──────────────────────────────────────────────────────────────
function get(url: string, apiKey: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "api-key": apiKey } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error("Invalid JSON response")); }
      });
    });
    req.on("error", reject);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n📖  Fetching Bibles from your api.bible account…\n");

  const data = await get("https://rest.api.bible/v1/bibles", API_KEY!) as {
    data: Array<{ id: string; name: string; language: { name: string; id: string }; abbreviation: string }>;
  };

  if (!data?.data) {
    console.error("❌  Unexpected response format:", JSON.stringify(data).slice(0, 200));
    process.exit(1);
  }

  // Group by language
  const byLang = new Map<string, typeof data.data>();
  for (const b of data.data) {
    const lang = b.language?.name ?? "Unknown";
    if (!byLang.has(lang)) byLang.set(lang, []);
    byLang.get(lang)!.push(b);
  }

  // Print all, sorted by language — Spanish first
  const langs = [...byLang.keys()].sort((a, b) =>
    a === "Spanish" ? -1 : b === "Spanish" ? 1 : a.localeCompare(b)
  );

  for (const lang of langs) {
    const bibles = byLang.get(lang)!;
    console.log(`\n── ${lang} (${bibles.length}) ─────────────────────────────`);
    for (const b of bibles) {
      console.log(`  ID: ${b.id.padEnd(26)}  ${b.abbreviation.padEnd(12)}  ${b.name}`);
    }
  }

  console.log("\n──────────────────────────────────────────────────────────");
  console.log("To use a Spanish Bible, add to your .env.local:");
  console.log("  API_BIBLE_RVR1960_ID=<paste the ID from the list above>");
  console.log("Then restart the dev server.\n");
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
