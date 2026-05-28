/**
 * /api/theopedia?term=Humanity+of+Christ
 *
 * Fetches a theological article via Wikipedia's REST summary API.
 * Wikipedia content is CC BY-SA licensed.
 * Falls back to alternate search terms automatically.
 */
import { NextRequest, NextResponse } from "next/server";
import { LRUCache } from "@/lib/lruCache";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const cache = new LRUCache<string, TheopediaEntry | null>(300);

export type TheopediaEntry = {
  term: string;
  body: string;
  sourceUrl: string;
  source: string;
};

const HEADERS = {
  "User-Agent": "ScriptureAlive/1.0 (educational Bible study app; contact@scripturelives.org)",
  "Accept": "application/json",
};

// Map theology sub-topic phrases to their best Wikipedia article titles
const WIKI_ALIAS: Record<string, string> = {
  // ── Prolegomena ──────────────────────────────────────────────────────────────
  "general revelation":          "Natural theology",
  "special revelation":          "Special revelation",
  "faith & reason":              "Faith and rationality",
  "theological method":          "Theology",
  "the nature of theology":      "Theology",
  "revelation":                  "Revelation (theology)",
  "inspiration":                 "Biblical inspiration",
  "inerrancy":                   "Biblical inerrancy",
  "hermeneutics":                "Hermeneutics",
  "exegesis":                    "Exegesis",
  "epistemology":                "Epistemology",

  // ── Bibliology ───────────────────────────────────────────────────────────────
  "inspiration of scripture":    "Biblical inspiration",
  "inerrancy & infallibility":   "Biblical inerrancy",
  "canonization":                "Biblical canon",
  "canon of scripture":          "Biblical canon",
  "transmission & translation":  "Bible translations",
  "illumination":                "Illumination (theology)",
  "interpretation (hermeneutics)": "Biblical hermeneutics",
  "autographs":                  "Biblical manuscript",
  "manuscript":                  "Biblical manuscript",
  "septuagint":                  "Septuagint",
  "masoretic text":              "Masoretic text",
  "dead sea scrolls":            "Dead Sea Scrolls",

  // ── Theology Proper ──────────────────────────────────────────────────────────
  "existence of god":            "Existence of God",
  "attributes of god":           "Attributes of God",
  "the trinity":                 "Trinity",
  "trinity":                     "Trinity",
  "god's sovereignty":           "Sovereignty of God in Christianity",
  "sovereignty":                 "Sovereignty of God in Christianity",
  "god's holiness":              "Holiness of God",
  "providence":                  "Divine providence",
  "omniscience":                 "Omniscience",
  "omnipotence":                 "Omnipotence",
  "omnipresence":                "Omnipresence",
  "immanence":                   "Immanence",
  "transcendence":               "Transcendence (religion)",
  "immutability":                "Divine immutability",

  // ── Christology ──────────────────────────────────────────────────────────────
  "humanity of christ":          "Human nature of Jesus",
  "deity of christ":             "Divinity of Jesus",
  "hypostatic union":            "Hypostatic union",
  "virgin birth":                "Virgin birth of Jesus",
  "offices of christ":           "Threefold office",
  "resurrection & ascension":    "Resurrection of Jesus",
  "second coming":               "Second coming of Christ",
  "incarnation":                 "Incarnation (Christianity)",
  "kenosis":                     "Kenosis",
  "messiah":                     "Messiah in Christianity",
  "atonement":                   "Atonement in Christianity",
  "resurrection":                "Resurrection of Jesus",
  "ascension":                   "Ascension of Jesus",
  "parousia":                    "Parousia",

  // ── Pneumatology ─────────────────────────────────────────────────────────────
  "deity of the spirit":         "Holy Spirit in Christianity",
  "regeneration":                "Regeneration (theology)",
  "indwelling":                  "Indwelling of the Holy Spirit",
  "filling of the spirit":       "Filling of the Holy Spirit",
  "baptism of the spirit":       "Baptism with the Holy Spirit",
  "gifts of the spirit":         "Gifts of the Holy Spirit",
  "fruit of the spirit":         "Fruit of the Holy Spirit",
  "sealing & assurance":         "Assurance (theology)",
  "holy spirit":                 "Holy Spirit in Christianity",
  "conviction":                  "Conviction (Christianity)",

  // ── Anthropology ─────────────────────────────────────────────────────────────
  "image of god (imago dei)":    "Image of God",
  "imago dei":                   "Image of God",
  "body & soul":                 "Body–soul dualism in Abrahamic religions",
  "trichotomy vs. dichotomy":    "Trichotomy (theology)",
  "origin of the soul":          "Creationism (soul)",
  "human dignity":               "Human dignity",
  "gender & marriage":           "Christian views on marriage",
  "free will":                   "Free will in theology",
  "conscience":                  "Conscience",

  // ── Hamartiology ─────────────────────────────────────────────────────────────
  "the fall":                    "Fall of man",
  "original sin":                "Original sin",
  "total depravity":             "Total depravity",
  "types of sin":                "Sin in Christianity",
  "consequences of sin":         "Sin in Christianity",
  "the sin nature":              "Original sin",
  "satan and demons":            "Devil in Christianity",
  "imputation":                  "Imputation (theology)",
  "concupiscence":               "Concupiscence",
  "actual sin":                  "Sin in Christianity",

  // ── Soteriology ──────────────────────────────────────────────────────────────
  "justification by faith":      "Justification (theology)",
  "justification":               "Justification (theology)",
  "sanctification":              "Sanctification",
  "glorification":               "Glorification (Christianity)",
  "election & predestination":   "Predestination",
  "predestination":              "Predestination",
  "assurance of salvation":      "Assurance (theology)",
  "propitiation":                "Propitiation",
  "redemption":                  "Redemption (theology)",
  "repentance":                  "Repentance in Christianity",
  "grace":                       "Grace in Christianity",
  "faith":                       "Faith in Christianity",
  "salvation":                   "Salvation in Christianity",
  "ordo salutis":                "Ordo salutis",
  "calling":                     "Effectual calling",
  "adoption":                    "Adoption (theology)",

  // ── Ecclesiology ─────────────────────────────────────────────────────────────
  "nature of the church":        "Church (Christianity)",
  "church leadership":           "Church governance",
  "ordinances (baptism & lord's supper)": "Ordinance (Christianity)",
  "spiritual gifts in the church": "Gifts of the Holy Spirit",
  "church discipline":           "Church discipline",
  "the universal church":        "Universal church",
  "the local church":            "Local church",
  "church & israel":             "Supersessionism",
  "ekklesia":                    "Ekklesia (Christianity)",
  "sacraments":                  "Sacrament",
  "ordinances":                  "Ordinance (Christianity)",
  "eldership":                   "Elder (Christianity)",
  "deacon":                      "Deacon",
  "baptism":                     "Baptism",
  "lord's supper":               "Eucharist",
  "congregation":                "Congregation",

  // ── Eschatology ──────────────────────────────────────────────────────────────
  "death & intermediate state":  "Intermediate state",
  "the rapture":                 "Rapture",
  "the millennium":              "Millennialism",
  "final judgment":              "Last Judgment",
  "heaven & hell":               "Heaven in Christianity",
  "new creation":                "New creation (theology)",
  "tribulation":                 "Tribulation",
  "premillennialism":            "Premillennialism",
  "amillennialism":              "Amillennialism",
  "new jerusalem":               "New Jerusalem",
  "judgment":                    "Last Judgment",

  // ── Angelology ───────────────────────────────────────────────────────────────
  "nature of angels":            "Angel",
  "ranks of angels":             "Hierarchy of angels",
  "ministry of angels":          "Angel",
  "the fall of satan":           "Fallen angel",
  "demons & spiritual warfare":  "Spiritual warfare",
  "the restrainer":              "Katechon",
  "michael & gabriel":           "Archangel",
  "cherubim":                    "Cherub",
  "seraphim":                    "Seraph",
  "satan":                       "Devil in Christianity",
  "demon":                       "Demon",
  "principalities":              "Principality (angelology)",
  "spiritual warfare":           "Spiritual warfare",

  // ── Missiology ───────────────────────────────────────────────────────────────
  "the great commission":        "Great Commission",
  "missio dei":                  "Missio Dei",
  "cross-cultural evangelism":   "Evangelism",
  "church planting":             "Church planting",
  "unreached people groups":     "Unreached people group",
  "the gospel & culture":        "Contextualization (theology)",
  "contextualization":           "Contextualization (theology)",
  "apostle":                     "Apostle (Christianity)",
  "evangelism":                  "Evangelism",
};

type WikiSummary = {
  title: string;
  extract: string;
  content_urls?: { desktop?: { page?: string } };
  description?: string;
};

async function fetchWiki(slug: string): Promise<WikiSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, {
      headers: HEADERS,
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const data = await res.json() as WikiSummary & { type?: string };
    if (data.type === "disambiguation") return null;
    if (!data.extract || data.extract.length < 80) return null;
    return data;
  } catch {
    return null;
  }
}

async function fetchEntry(term: string): Promise<TheopediaEntry | null> {
  const key = term.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key) ?? null;

  // Build candidate slugs to try in order
  const alias   = WIKI_ALIAS[key];
  const direct  = term.trim().replace(/\s+/g, "_");
  const titleCase = term.trim().split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("_");
  const withChristianity = `${direct}_(Christianity)`;

  const candidates = [
    ...(alias ? [alias] : []),
    direct,
    titleCase,
    withChristianity,
  ].filter((v, i, arr) => arr.indexOf(v) === i); // dedupe

  for (const slug of candidates) {
    const data = await fetchWiki(slug);
    if (data) {
      const entry: TheopediaEntry = {
        term: data.title,
        body: data.extract,
        sourceUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(slug)}`,
        source: "Wikipedia (CC BY-SA)",
      };
      cache.set(key, entry);
      return entry;
    }
  }

  cache.set(key, null);
  return null;
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(ip, { limit: 30, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetMs - Date.now()) / 1000)) } }
    );
  }

  const term = req.nextUrl.searchParams.get("term")?.trim() ?? "";
  if (!term || term.length < 2) return NextResponse.json({ error: "Provide a term" }, { status: 400 });
  if (term.length > 120)        return NextResponse.json({ error: "Term too long" },  { status: 400 });

  const entry = await fetchEntry(term);
  if (!entry) return NextResponse.json({ found: false, term });

  return NextResponse.json({
    found: true,
    term: entry.term,
    body: entry.body,
    sourceUrl: entry.sourceUrl,
    source: entry.source,
  });
}
