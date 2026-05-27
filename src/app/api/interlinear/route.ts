/**
 * /api/interlinear?book=John&chapter=3&verse=16
 * /api/interlinear?book=John&chapter=3              ← whole chapter
 *
 * Returns word-level interlinear data for a KJV verse or chapter.
 * Each token: { english, original, xlit, strongs, gloss, isOT }
 *
 * Primary: STEPBible API (word-precise tagged data)
 * Fallback: local Strong's reverse-index lookup
 */
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { loadBible } from "@/lib/loadBibleVersion";

// ── Types ────────────────────────────────────────────────────────────────────

type LexEntry = {
  lemma: string;
  xlit:  string;
  pron:  string;
  strongs_def: string;
  kjv_def:     string;
};

export type InterlinearWord = {
  english:   string;   // KJV surface word
  original:  string;   // Greek or Hebrew script
  xlit:      string;   // transliteration
  strongs:   string;   // e.g. "G2316" or "H430"
  gloss:     string;   // short English gloss
  morph?:    string;   // morphological code (when available)
  isOT:      boolean;
};

export type InterlinearVerse = {
  book:    string;
  chapter: number;
  verse:   number;
  ref:     string;     // "John 3:16"
  isOT:    boolean;
  words:   InterlinearWord[];
};

// ── OT book set ──────────────────────────────────────────────────────────────

const OT_BOOKS = new Set([
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
  "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
  "1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalm","Proverbs",
  "Ecclesiastes","Song of Solomon","Isaiah","Jeremiah",
  "Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi",
]);

// ── Book name → STEPBible abbreviation ──────────────────────────────────────

const BOOK_TO_STEP: Record<string, string> = {
  "Genesis":"Gen","Exodus":"Exod","Leviticus":"Lev","Numbers":"Num",
  "Deuteronomy":"Deut","Joshua":"Josh","Judges":"Judg","Ruth":"Ruth",
  "1 Samuel":"1Sam","2 Samuel":"2Sam","1 Kings":"1Kgs","2 Kings":"2Kgs",
  "1 Chronicles":"1Chr","2 Chronicles":"2Chr","Ezra":"Ezra",
  "Nehemiah":"Neh","Esther":"Esth","Job":"Job","Psalm":"Ps",
  "Proverbs":"Prov","Ecclesiastes":"Eccl","Song of Solomon":"Song",
  "Isaiah":"Isa","Jeremiah":"Jer","Lamentations":"Lam","Ezekiel":"Ezek",
  "Daniel":"Dan","Hosea":"Hos","Joel":"Joel","Amos":"Amos",
  "Obadiah":"Obad","Jonah":"Jonah","Micah":"Mic","Nahum":"Nah",
  "Habakkuk":"Hab","Zephaniah":"Zeph","Haggai":"Hag","Zechariah":"Zech",
  "Malachi":"Mal","Matthew":"Matt","Mark":"Mark","Luke":"Luke",
  "John":"John","Acts":"Acts","Romans":"Rom",
  "1 Corinthians":"1Cor","2 Corinthians":"2Cor","Galatians":"Gal",
  "Ephesians":"Eph","Philippians":"Phil","Colossians":"Col",
  "1 Thessalonians":"1Thess","2 Thessalonians":"2Thess",
  "1 Timothy":"1Tim","2 Timothy":"2Tim","Titus":"Titus",
  "Philemon":"Phlm","Hebrews":"Heb","James":"Jas",
  "1 Peter":"1Pet","2 Peter":"2Pet","1 John":"1John",
  "2 John":"2John","3 John":"3John","Jude":"Jude","Revelation":"Rev",
};

// ── Lexicon loaders (cached) ─────────────────────────────────────────────────

let _greek:  Record<string, LexEntry> | null = null;
let _hebrew: Record<string, LexEntry> | null = null;

function loadGreek()  { if (!_greek)  { const p = join(process.cwd(),"src","data","strongs","greek.json");  _greek  = JSON.parse(readFileSync(p,"utf-8")); } return _greek!; }
function loadHebrew() { if (!_hebrew) { const p = join(process.cwd(),"src","data","strongs","hebrew.json"); _hebrew = JSON.parse(readFileSync(p,"utf-8")); } return _hebrew!; }

// ── Reverse index: kjv_def word → [(strongsNum, score)] ──────────────────────

type RevEntry = { num: string; entry: LexEntry };
let _greekRev:  Map<string, RevEntry[]> | null = null;
let _hebrewRev: Map<string, RevEntry[]> | null = null;

function buildRevIndex(lex: Record<string, LexEntry>): Map<string, RevEntry[]> {
  const map = new Map<string, RevEntry[]>();
  for (const [num, entry] of Object.entries(lex)) {
    const tokens = entry.kjv_def
      .toLowerCase()
      .split(/[\s,;()[\]×.]+/)
      .filter((t) => t.length > 1);
    for (const tok of tokens) {
      if (!map.has(tok)) map.set(tok, []);
      map.get(tok)!.push({ num, entry });
    }
  }
  return map;
}

function getGreekRev()  { if (!_greekRev)  _greekRev  = buildRevIndex(loadGreek());  return _greekRev!; }
function getHebrewRev() { if (!_hebrewRev) _hebrewRev = buildRevIndex(loadHebrew()); return _hebrewRev!; }

// ── Common word → Strong's direct map (highest-frequency KJV words) ───────────
// These are deterministic mappings for words the reverse-index misses or gets wrong.

const GREEK_DIRECT: Record<string, string> = {
  // Articles / pronouns
  "the":"G3588","a":"G3588","an":"G3588",
  "he":"G846","she":"G846","it":"G846","him":"G846","his":"G846","her":"G846",
  "they":"G846","them":"G846","their":"G846",
  "we":"G2249","us":"G2249","our":"G2257",
  "you":"G5210","your":"G5216","ye":"G5210","thy":"G4675","thee":"G4571","thine":"G4674",
  "thou":"G4771","i":"G1473","my":"G3450","me":"G3165",
  "who":"G3739","whom":"G3739","which":"G3739","that":"G3739",
  "this":"G3778","these":"G3778",
  "all":"G3956","every":"G3956","whosoever":"G3956",
  // Conjunctions / prepositions
  "and":"G2532","but":"G235","or":"G2228","for":"G1063","so":"G3779",
  "not":"G3756","no":"G3756","neither":"G3761","nor":"G3761",
  "of":"G1537","in":"G1722","on":"G1909","upon":"G1909","at":"G1722",
  "to":"G1519","into":"G1519","unto":"G1519","from":"G1537","out":"G1537",
  "with":"G3326","by":"G1223","through":"G1223","after":"G3326",
  "as":"G5613","if":"G1487","when":"G3752","because":"G3754",
  "then":"G5119","therefore":"G3767","also":"G2532","even":"G2532",
  "until":"G2193","before":"G4253","above":"G1883",
  // Common verbs
  "is":"G2076","are":"G2076","was":"G2258","were":"G2258","be":"G1511",
  "am":"G1510","art":"G2075","hath":"G2192","have":"G2192","had":"G2192",
  "has":"G2192","having":"G2192",
  "shall":"G3195","should":"G2443","will":"G2309","would":"G1014",
  "may":"G1410","might":"G1410","can":"G1410","could":"G1410","must":"G1163",
  "said":"G3004","say":"G3004","saith":"G3004","saying":"G3004",
  "know":"G1097","knew":"G1097","known":"G1097","knoweth":"G1097",
  "see":"G3708","saw":"G3708","seen":"G3708","seeth":"G3708",
  "come":"G2064","came":"G2064","coming":"G2064","cometh":"G2064",
  "go":"G4198","went":"G4198","going":"G4198","goeth":"G4198",
  "give":"G1325","gave":"G1325","given":"G1325","giveth":"G1325",
  "loved":"G25","loveth":"G25","loving":"G25",
  "believe":"G4100","believed":"G4100","believeth":"G4100","believing":"G4100",
  "hear":"G191","heard":"G191","heareth":"G191",
  "speak":"G2980","spoke":"G2980","spoken":"G2980","spake":"G2980",
  "make":"G4160","made":"G4160","maketh":"G4160",
  "take":"G2983","took":"G2983","taken":"G2983",
  "put":"G5087","bring":"G5342","brought":"G5342",
  "send":"G649","sent":"G649","sendeth":"G649",
  "keep":"G5083","kept":"G5083",
  "ask":"G154","asked":"G154","asketh":"G154",
  "answer":"G611","answered":"G611",
  "call":"G2564","called":"G2564","calleth":"G2564",
  "rise":"G450","arose":"G450","risen":"G450",
  "die":"G599","died":"G599","death":"G2288",
  "live":"G2198","lived":"G2198","life":"G2222",
  "save":"G4982","saved":"G4982","saveth":"G4982",
  "sin":"G266","sins":"G266","sinner":"G268","sinned":"G264",
  "pray":"G4336","prayed":"G4336","prayer":"G4335",
  "teach":"G1321","taught":"G1321","teacher":"G1320",
  "preach":"G2784","preached":"G2784",
  "baptize":"G907","baptized":"G907","baptism":"G908",
  "repent":"G3340","repentance":"G3341",
  "forgive":"G863","forgiven":"G863","forgiveness":"G859",
  "heal":"G2323","healed":"G2323","healing":"G2322",
  "suffer":"G3958","suffered":"G3958",
  "glorify":"G1392","glory":"G1391","glorified":"G1392",
  "worship":"G4352","worshipped":"G4352",
  "enter":"G1525","entered":"G1525",
  "sit":"G2523","sat":"G2523","sitteth":"G2523",
  "stand":"G2476","stood":"G2476","standeth":"G2476",
  "follow":"G190","followed":"G190","followeth":"G190",
  "depart":"G565","departed":"G565",
  // Common nouns
  "god":"G2316","lord":"G2962","jesus":"G2424","christ":"G5547",
  "spirit":"G4151","holy":"G40","father":"G3962","son":"G5207",
  "man":"G444","men":"G444","woman":"G1135","women":"G1135",
  "child":"G5043","children":"G5043","king":"G935",
  "word":"G3056","words":"G3056","truth":"G225",
  "world":"G2889","heaven":"G3772","earth":"G1093",
  "kingdom":"G932","people":"G2992","nation":"G1484",
  "heart":"G2588","soul":"G5590","mind":"G3563",
  "hand":"G5495","hands":"G5495","eye":"G3788","eyes":"G3788",
  "name":"G3686","time":"G5550","day":"G2250","days":"G2250",
  "year":"G2094","hour":"G5610","night":"G3571",
  "bread":"G740","water":"G5204","light":"G5457","darkness":"G4655",
  "blood":"G129","body":"G4983","flesh":"G4561",
  "power":"G1411","sign":"G4592","miracle":"G1411",
  "grace":"G5485","mercy":"G1656","peace":"G1515","joy":"G5479",
  "hope":"G1680","faith":"G4102","love":"G26",
  "law":"G3551","commandment":"G1785","covenant":"G1242",
  "angel":"G32","prophet":"G4396","apostle":"G652","disciple":"G3101",
  "synagogue":"G4864","temple":"G2411","cross":"G4716",
  "door":"G2374","way":"G3598","road":"G3598",
  "servant":"G1401","master":"G2962",
  "only":"G3441","begotten":"G3439","everlasting":"G166","eternal":"G166",
  "perish":"G622",
  "righteous":"G1342","righteousness":"G1343","wicked":"G4190",
  "wise":"G4680","wisdom":"G4678","fool":"G878",
  "jew":"G2453","jews":"G2453","gentile":"G1484","israel":"G2474",
};

const HEBREW_DIRECT: Record<string, string> = {
  // Articles / pronouns
  "the":"H0853","a":"H0853","and":"H0853",
  "he":"H1931","she":"H1931","it":"H1931","him":"H1931",
  "they":"H1992","them":"H1992","their":"H1992",
  "we":"H0587","us":"H0587","our":"H0587",
  "you":"H0859","your":"H0859","ye":"H0859","thy":"H0859","thee":"H0859","thine":"H0859",
  "thou":"H0859","i":"H0595","my":"H0595","me":"H0595",
  "who":"H0834","which":"H0834","that":"H0834",
  "this":"H2088","these":"H0428",
  "all":"H3605","every":"H3605",
  // Conjunctions / prepositions
  "not":"H3808","no":"H3808","neither":"H1115","nor":"H1115",
  "of":"H0834","in":"H0871","on":"H5921","upon":"H5921","at":"H0413",
  "to":"H0413","into":"H0413","unto":"H0413","from":"H4480","out":"H4480",
  "with":"H0854","by":"H3027","through":"H1157","after":"H0310",
  "as":"H3644","if":"H0518","when":"H3588","because":"H3588",
  "then":"H0227","therefore":"H3651","also":"H1571","even":"H1571",
  "for":"H3588","but":"H3588","so":"H3651","or":"H0176",
  // Common verbs
  "is":"H1961","are":"H1961","was":"H1961","were":"H1961","be":"H1961",
  "said":"H0559","say":"H0559","saying":"H0559","saith":"H0559",
  "know":"H3045","knew":"H3045","known":"H3045","knoweth":"H3045",
  "see":"H7200","saw":"H7200","seen":"H7200","seeth":"H7200",
  "come":"H0935","came":"H0935","coming":"H0935","cometh":"H0935",
  "go":"H1980","went":"H1980","going":"H1980","goeth":"H1980",
  "give":"H5414","gave":"H5414","given":"H5414","giveth":"H5414",
  "loved":"H0157","loveth":"H0157",
  "hear":"H8085","heard":"H8085","heareth":"H8085",
  "speak":"H1696","spoke":"H1696","spoken":"H1696","spake":"H1696",
  "make":"H6213","made":"H6213","maketh":"H6213",
  "take":"H3947","took":"H3947","taken":"H3947",
  "send":"H7971","sent":"H7971",
  "call":"H7121","called":"H7121","calleth":"H7121",
  "die":"H4191","died":"H4191","death":"H4194",
  "live":"H2421","lived":"H2421","life":"H2416",
  "save":"H3467","saved":"H3467",
  "sin":"H2399","sins":"H2399","sinned":"H2398",
  "pray":"H6419","prayed":"H6419","prayer":"H8605",
  "bless":"H1288","blessed":"H1288","blessing":"H1293",
  "praised":"H1984",
  "create":"H1254","created":"H1254","creation":"H1254",
  // Common nouns
  "god":"H0430","lord":"H3068","jehovah":"H3068","yahweh":"H3068",
  "man":"H0376","men":"H0582","woman":"H0802","women":"H0802",
  "child":"H0123","children":"H1121","son":"H1121","sons":"H1121",
  "daughter":"H1323","daughters":"H1323",
  "king":"H4428","kingdom":"H4438","people":"H5971","nation":"H1471",
  "israel":"H3478","judah":"H3063","egypt":"H4714",
  "word":"H1697","words":"H1697","commandment":"H4687",
  "law":"H8451","covenant":"H1285","testimony":"H5715",
  "heart":"H3824","soul":"H5315","spirit":"H7307",
  "hand":"H3027","hands":"H3027","eye":"H5869","eyes":"H5869",
  "name":"H8034","day":"H3117","days":"H3117","year":"H8141",
  "night":"H3915","morning":"H1242","evening":"H6153",
  "heaven":"H8064","earth":"H0776","land":"H0776","sea":"H3220",
  "water":"H4325","fire":"H0784","light":"H0216","darkness":"H2822",
  "bread":"H3899","blood":"H1818",
  "holy":"H6918","righteous":"H6662","righteousness":"H6666",
  "glory":"H3519","praise":"H8416","mercy":"H2617","grace":"H2580",
  "love":"H0160","fear":"H3374","wisdom":"H2451","understanding":"H0998",
  "temple":"H1964","tabernacle":"H4908","altar":"H4196","priest":"H3548",
  "prophet":"H5030","angel":"H4397",
  "enemy":"H0341","enemies":"H0341",
  "forever":"H5769","everlasting":"H5769","eternal":"H5769",
};

// ── Improved stemmer — returns multiple candidate forms ──────────────────────

function stemVariants(w: string): string[] {
  const variants = new Set<string>([w]);
  // KJV archaic -eth endings: believeth→believe, saith→say, cometh→come
  if (w.endsWith("ieth"))  { variants.add(w.slice(0, -4) + "y"); variants.add(w.slice(0, -4)); }
  if (w.endsWith("eth"))   { variants.add(w.slice(0, -3) + "e"); variants.add(w.slice(0, -3)); }
  // KJV -est endings: lovest→love, doest→do
  if (w.endsWith("est"))   { variants.add(w.slice(0, -3) + "e"); variants.add(w.slice(0, -3)); }
  // Past tense with silent-e: loved→love, saved→save, believed→believe
  if (w.endsWith("ed"))    { variants.add(w.slice(0, -2) + "e"); variants.add(w.slice(0, -2)); }
  // -ing
  if (w.endsWith("ing"))   { variants.add(w.slice(0, -3) + "e"); variants.add(w.slice(0, -3)); }
  // Plural -ies: glories→glory
  if (w.endsWith("ies"))   { variants.add(w.slice(0, -3) + "y"); }
  // -ness, -tion, -ation
  if (w.endsWith("ness"))  { variants.add(w.slice(0, -4)); }
  if (w.endsWith("ation")) { variants.add(w.slice(0, -5) + "e"); variants.add(w.slice(0, -5)); }
  if (w.endsWith("tion"))  { variants.add(w.slice(0, -4)); }
  // -er, -ly, -s
  if (w.endsWith("er"))    { variants.add(w.slice(0, -2) + "e"); variants.add(w.slice(0, -2)); }
  if (w.endsWith("ly"))    { variants.add(w.slice(0, -2)); }
  if (w.endsWith("s") && w.length > 3)  { variants.add(w.slice(0, -1)); }
  // Common KJV irregular verbs
  const irregs: Record<string, string[]> = {
    "gave":["give"],"gave":["give"],"went":["go"],"came":["come"],
    "saw":["see"],"knew":["know"],"said":["say"],"made":["make"],
    "took":["take"],"brought":["bring"],"put":["put"],"kept":["keep"],
    "sent":["send"],"spake":["speak"],"sat":["sit"],"stood":["stand"],
    "arose":["rise"],"fell":["fall"],"found":["find"],"told":["tell"],
    "held":["hold"],"bore":["bear"],"chose":["choose"],"led":["lead"],
    "wept":["weep"],"smote":["smite"],"slew":["slay"],"drew":["draw"],
    "sold":["sell"],"taught":["teach"],"sought":["seek"],"left":["leave"],
    "heard":["hear"],"spoke":["speak"],"dwelt":["dwell"],
  };
  if (irregs[w]) irregs[w].forEach(v => variants.add(v));
  return [...variants].filter(v => v.length > 1);
}

// ── Local fallback: look up one KJV word ────────────────────────────────────

function localLookup(word: string, isOT: boolean): InterlinearWord | null {
  const rev = isOT ? getHebrewRev() : getGreekRev();
  const lex = isOT ? loadHebrew()   : loadGreek();
  const direct = isOT ? HEBREW_DIRECT : GREEK_DIRECT;
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return null;

  // 1. Check direct map first (exact and reliable)
  const directNum = direct[w];
  if (directNum && lex[directNum]) {
    const e = lex[directNum];
    return {
      english:  word,
      original: e.lemma,
      xlit:     e.xlit,
      strongs:  directNum,
      gloss:    (e.kjv_def.split(/[;,(]/)[0] ?? "").trim().slice(0, 40),
      isOT,
    };
  }

  // 2. Reverse-index lookup across stemmed variants
  const prefix = isOT ? "H" : "G";
  const candidates: { num: string; entry: LexEntry; score: number }[] = [];
  const variants = stemVariants(w);

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const hits = rev.get(v) ?? [];
    const score = i === 0 ? 10 : Math.max(4, 9 - i); // exact match scores highest
    for (const { num, entry } of hits) {
      const existing = candidates.find((c) => c.num === num);
      if (!existing) candidates.push({ num, entry, score });
      else if (score > existing.score) existing.score = score;
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score);

  const matchingNum = candidates.find((c) => c.num.startsWith(prefix))?.num;
  if (!matchingNum) return null;
  const matchEntry = lex[matchingNum];
  if (!matchEntry) return null;

  return {
    english:  word,
    original: matchEntry.lemma,
    xlit:     matchEntry.xlit,
    strongs:  matchingNum,
    gloss:    (matchEntry.kjv_def.split(/[;,(]/)[0] ?? "").trim().slice(0, 40),
    isOT,
  };
}

// ── STEPBible API (primary) ──────────────────────────────────────────────────

async function fetchFromStep(
  book: string,
  chapter: number,
  verse: number | null,
  isOT: boolean
): Promise<InterlinearVerse[] | null> {
  const stepAbbr = BOOK_TO_STEP[book];
  if (!stepAbbr) return null;

  const version = isOT ? "THOT" : "TGNT";
  const ref     = verse
    ? `${stepAbbr}.${chapter}.${verse}`
    : `${stepAbbr}.${chapter}`;

  const url = `https://api.stepbible.org/v1/rest/passage/text?version=${version}&reference=${encodeURIComponent(ref)}&options=VHN`;

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "ScriptureLives/1.0" },
      signal: AbortSignal.timeout(3500),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    if (!res.ok) return null;
    const data = await res.json();

    // STEPBible wraps content in passageText.passage (HTML)
    const html: string = data?.passageText?.passage ?? "";
    if (!html) return null;

    // Parse word spans: <span class="w" data-strong="G2316" data-morph="...">word</span>
    // or strong numbers embedded as data attributes on various span types
    return parseStepHtml(html, book, chapter, isOT);
  } catch {
    return null;
  }
}

function parseStepHtml(html: string, book: string, chapter: number, isOT: boolean): InterlinearVerse[] {
  const results: InterlinearVerse[] = [];
  const lex = isOT ? loadHebrew() : loadGreek();

  // Match verse containers: data-verse-num="N"
  const verseBlocks = [...html.matchAll(/data-verse-num="(\d+)"[^>]*>([\s\S]*?)(?=data-verse-num="\d+"|$)/g)];

  for (const [, vNum, block] of verseBlocks) {
    const verseNum = parseInt(vNum, 10);
    const words: InterlinearWord[] = [];

    // Extract word spans with Strong's numbers
    const wordRegex = /data-strong="([^"]+)"[^>]*data-morph="([^"]*)"[^>]*>.*?<span[^>]*>([^<]+)<\/span>/g;
    for (const [, strong, morph, original] of [...block.matchAll(wordRegex)]) {
      // Also try to find the gloss from the interlinear gloss span
      const lexEntry = lex[strong];
      if (!lexEntry) continue;
      words.push({
        english:  lexEntry.kjv_def.split(/[;,(]/)[0]?.trim().slice(0,30) ?? "",
        original: original.trim(),
        xlit:     lexEntry.xlit,
        strongs:  strong,
        gloss:    lexEntry.kjv_def.split(/[;,(]/)[0]?.trim().slice(0,40) ?? "",
        morph:    morph || undefined,
        isOT,
      });
    }

    if (words.length > 0) {
      results.push({
        book, chapter, verse: verseNum,
        ref: `${book} ${chapter}:${verseNum}`,
        isOT,
        words,
      });
    }
  }

  return results;
}

// ── Local fallback: build interlinear from KJV text ──────────────────────────

function localInterlinear(
  text: string,
  book: string,
  chapter: number,
  verse: number,
  isOT: boolean
): InterlinearVerse {
  // Tokenise: preserve punctuation-stripped words in order
  const raw = text.split(/\s+/).filter(Boolean);
  const words: InterlinearWord[] = [];

  for (const token of raw) {
    const clean = token.replace(/[^a-zA-Z']/g, "");
    if (!clean) continue;
    const hit = localLookup(clean, isOT);
    if (hit) {
      words.push({ ...hit, english: token }); // keep original punctuation in display
    } else {
      // Still show the word, just without original language data
      words.push({
        english:  token,
        original: "",
        xlit:     "",
        strongs:  "",
        gloss:    "",
        isOT,
      });
    }
  }

  return { book, chapter, verse, ref: `${book} ${chapter}:${verse}`, isOT, words };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const book    = searchParams.get("book");
  const chapter = parseInt(searchParams.get("chapter") ?? "0", 10);
  const verse   = searchParams.get("verse") ? parseInt(searchParams.get("verse")!, 10) : null;

  if (!book || !chapter || isNaN(chapter)) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  const isOT = OT_BOOKS.has(book);

  // ── 1. Try STEPBible (word-precise) ──────────────────────────────────────
  const stepResult = await fetchFromStep(book, chapter, verse, isOT);
  if (stepResult && stepResult.length > 0) {
    const filtered = verse ? stepResult.filter((v) => v.verse === verse) : stepResult;
    if (filtered.length > 0) {
      return NextResponse.json({ verses: filtered, source: "step" });
    }
  }

  // ── 2. Local fallback ────────────────────────────────────────────────────
  try {
    const kjv      = loadBible("KJV");
    const filtered = kjv.filter(
      (v) => v.book === book && v.chapter === chapter && (verse == null || v.verse === verse)
    );

    const verses: InterlinearVerse[] = filtered.map((v) =>
      localInterlinear(
        v.text ?? "",
        book,
        chapter,
        v.verse,
        isOT
      )
    );

    return NextResponse.json({ verses, source: "local" });
  } catch (err) {
    console.error("[interlinear] local fallback failed:", err);
    return NextResponse.json({ error: "Could not load interlinear data" }, { status: 500 });
  }
}
