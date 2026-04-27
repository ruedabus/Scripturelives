/**
 * Scripture Lives — Bible Discovery Script
 *
 * Usage:
 *   npm run list-bibles                          ← reads API key from .env.local
 *   npm run list-bibles -- --key=YOUR_KEY_HERE   ← pass key directly
 *
 * Lists every Bible on your api.bible account. Use this to find the exact
 * Bible ID for the Reina-Valera 1960 (or any other translation) and add it
 * to your .env.local as  API_BIBLE_RVR1960_ID=<id>
 */

import https from "https";
import path from "path";
import fs from "fs";

// ── Load env files (tries multiple locations) ─────────────────────────────────
function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  // Strip UTF-8 BOM if present, normalise Windows line endings
  let raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key   = trimmed.slice(0, eq).trim();
    let   val   = trimmed.slice(eq + 1).trim();
    // Strip surrounding quotes (single or double)
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key && val && !process.env[key]) {
      process.env[key] = val;
    }
  }
}

const root = process.cwd();
// Load in priority order (later files don't override earlier ones)
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env.development.local"));
loadEnvFile(path.join(root, ".env.development"));
loadEnvFile(path.join(root, ".env"));

// ── Key resolution: env file → CLI arg ────────────────────────────────────────
const cliKey = process.argv.find((a) => a.startsWith("--key="))?.split("=").slice(1).join("=");
const API_KEY = cliKey ?? process.env.API_BIBLE_KEY;

if (!API_KEY) {
  console.error(`
❌  Could not find API_BIBLE_KEY.

Options:
  1. Make sure your .env.local file contains:
       API_BIBLE_KEY=your_key_here
     (No quotes, no extra spaces)

  2. Or pass it directly on the command line:
       npm run list-bibles -- --key=your_key_here

  Get your key from: https://scripture.api.bible → My Apps → your app → API Key
`);
  process.exit(1);
}

console.log(`\n🔑  Using API key: ${API_KEY.slice(0, 8)}${"*".repeat(Math.max(0, API_KEY.length - 8))}`);

// ── Fetch helper ──────────────────────────────────────────────────────────────
function get(url: string, apiKey: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { "api-key": apiKey } }, (res) => {
      let data = "";
      res.on("data", (chunk: string) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`Invalid JSON (status ${res.statusCode}): ${data.slice(0, 200)}`)); }
      });
    });
    req.on("error", reject);
    req.setTimeout(15_000, () => { req.destroy(); reject(new Error("Request timed out")); });
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("📖  Fetching Bibles from your api.bible account…\n");

  const result = await get("https://rest.api.bible/v1/bibles", API_KEY!) as {
    statusCode?: number;
    error?: string;
    message?: string;
    data?: Array<{ id: string; name: string; language: { name: string; id: string }; abbreviation: string }>;
  };

  // Handle API errors gracefully
  if (result.statusCode === 403 || result.error === "Forbidden") {
    console.error(`
❌  API key rejected (403 Forbidden).

This usually means the key in your .env.local doesn't match your api.bible account.

Steps to fix:
  1. Go to https://scripture.api.bible  →  My Apps  →  click your app
  2. Copy the API Key shown on that page
  3. Open your .env.local file and update:
       API_BIBLE_KEY=<paste your key here>
  4. Re-run:  npm run list-bibles

Or pass the key directly to test it right now:
  npm run list-bibles -- --key=<your key here>
`);
    process.exit(1);
  }

  if (!result.data || !Array.isArray(result.data)) {
    console.error("❌  Unexpected response:", JSON.stringify(result).slice(0, 300));
    process.exit(1);
  }

  // Group by language
  const byLang = new Map<string, typeof result.data>();
  for (const b of result.data) {
    const lang = b.language?.name ?? "Unknown";
    if (!byLang.has(lang)) byLang.set(lang, []);
    byLang.get(lang)!.push(b);
  }

  // Print all — Spanish first, then alphabetical
  const langs = [...byLang.keys()].sort((a, b) =>
    a === "Spanish" ? -1 : b === "Spanish" ? 1 : a.localeCompare(b)
  );

  for (const lang of langs) {
    const bibles = byLang.get(lang)!;
    console.log(`── ${lang} (${bibles.length}) ${"─".repeat(Math.max(0, 46 - lang.length))}`);
    for (const b of bibles) {
      console.log(`   ${b.id.padEnd(28)} ${b.abbreviation.padEnd(14)} ${b.name}`);
    }
    console.log();
  }

  // Spanish summary
  const spanishBibles = result.data.filter((b) => b.language?.name === "Spanish");
  if (spanishBibles.length > 0) {
    console.log("──────────────────────────────────────────────────────────");
    console.log("🇪🇸  Spanish Bibles found on your account:\n");
    for (const b of spanishBibles) {
      console.log(`   ${b.abbreviation.padEnd(14)} ${b.name}`);
      console.log(`   └─ ID: ${b.id}\n`);
    }
    console.log("To activate one, add this to your .env.local (and Vercel):");
    console.log(`   API_BIBLE_RVR1960_ID=<paste the ID above>`);
    console.log("Then restart the dev server.\n");
  } else {
    console.log("──────────────────────────────────────────────────────────");
    console.log("ℹ️   No Spanish Bibles found on your account yet.");
    console.log("   → Go to https://scripture.api.bible → My Apps → your app");
    console.log("   → Click 'Add Bible' and search for 'Reina-Valera 1960'");
    console.log("   → After adding it, re-run: npm run list-bibles\n");
  }
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
