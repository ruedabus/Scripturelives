"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Search, BookOpen, ExternalLink, ChevronRight, Loader2, ArrowLeft } from "lucide-react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

// ── Featured topic groups for browsing ───────────────────────────────────────
const FEATURED: { label: string; emoji: string; terms: string[] }[] = [
  {
    label: "People",
    emoji: "👤",
    terms: ["Abraham", "Moses", "David", "Solomon", "Elijah", "Isaiah", "Jeremiah",
            "Ezekiel", "Daniel", "Esther", "Ruth", "Deborah", "Samson", "Gideon",
            "Joshua", "Ezra", "Nehemiah", "Job", "Jonah",
            "Mary", "Peter", "Paul", "John the Apostle", "James", "Stephen",
            "John the Baptist", "Lazarus", "Nicodemus", "Mary Magdalene", "Jesus Christ"],
  },
  {
    label: "Places",
    emoji: "🗺️",
    terms: ["Jerusalem", "Bethlehem", "Nazareth", "Galilee", "Judea", "Samaria",
            "Sinai", "Babylon", "Nineveh", "Egypt", "Canaan", "Jericho",
            "Rome", "Ephesus", "Corinth", "Athens", "Antioch", "Damascus",
            "Capernaum", "Gethsemane", "Calvary", "Bethany"],
  },
  {
    label: "Theology",
    emoji: "✝️",
    terms: ["Atonement", "Baptism", "Covenant", "Election", "Faith", "Forgiveness",
            "Grace", "Holy Spirit", "Incarnation", "Inspiration", "Justification",
            "Kingdom of God", "Messiah", "Miracles", "Prayer", "Prophecy",
            "Reconciliation", "Redemption", "Repentance", "Resurrection",
            "Righteousness", "Salvation", "Sanctification", "Sin", "Trinity",
            "Word of God", "Worship"],
  },
  {
    label: "Events",
    emoji: "📜",
    terms: ["Creation", "The Fall", "The Flood", "Tower of Babel", "The Exodus",
            "The Wilderness", "Conquest of Canaan", "The Exile", "Return from Exile",
            "The Annunciation", "The Nativity", "Baptism of Jesus", "Temptation of Jesus",
            "Transfiguration", "The Triumphal Entry", "The Last Supper",
            "The Crucifixion", "The Resurrection", "The Ascension", "Pentecost"],
  },
  {
    label: "Objects & Rites",
    emoji: "🏛️",
    terms: ["Ark of the Covenant", "Tabernacle", "Temple", "Menorah", "Altar",
            "Sabbath", "Circumcision", "Passover", "Day of Atonement",
            "Feast of Tabernacles", "Feast of Weeks", "Lord's Supper",
            "Anointing", "Sacrifice", "Burnt Offering", "Priesthood",
            "High Priest", "Tithe", "Firstfruits", "Prayer"],
  },
  {
    label: "Nations & Peoples",
    emoji: "🌍",
    terms: ["Israel", "Israelites", "Philistines", "Egyptians", "Assyrians",
            "Babylonians", "Persians", "Canaanites", "Moabites", "Edomites",
            "Ammonites", "Romans", "Greeks", "Samaritans",
            "Pharisees", "Sadducees", "Scribes", "Levites", "Gentiles"],
  },
  {
    label: "Books of the Bible",
    emoji: "📖",
    terms: ["Genesis", "Exodus", "Deuteronomy", "Psalms", "Proverbs",
            "Isaiah", "Jeremiah", "Ezekiel", "Daniel",
            "Matthew", "Mark", "Luke", "John", "Acts",
            "Romans", "Galatians", "Ephesians", "Hebrews",
            "Revelation"],
  },
  {
    label: "Animals & Plants",
    emoji: "🌿",
    terms: ["Lion", "Lamb", "Dove", "Eagle", "Serpent", "Locust", "Fish",
            "Ox", "Donkey", "Camel",
            "Cedar", "Olive Tree", "Fig Tree", "Vine", "Wheat", "Hyssop",
            "Manna", "Frankincense", "Myrrh"],
  },
  {
    label: "Geography & Landscape",
    emoji: "⛰️",
    terms: ["Jordan River", "Nile River", "Euphrates River", "Dead Sea",
            "Sea of Galilee", "Mediterranean Sea", "Red Sea",
            "Mount Sinai", "Mount Zion", "Mount Carmel", "Mount of Olives",
            "Mount Hermon", "Valley of Jehoshaphat", "Desert of Sinai",
            "Plain of Megiddo"],
  },
  {
    label: "Law & Customs",
    emoji: "⚖️",
    terms: ["Ten Commandments", "Mosaic Law", "Marriage", "Divorce", "Burial",
            "Levirate Marriage", "Year of Jubilee", "Sabbatical Year",
            "Cities of Refuge", "Nazarite", "Synagogue", "Sanhedrin",
            "Scribes", "Elders", "Fasting"],
  },
  {
    label: "Languages & Texts",
    emoji: "📝",
    terms: ["Hebrew Language", "Greek Language", "Aramaic",
            "Septuagint", "Masoretic Text", "Dead Sea Scrolls",
            "Pentateuch", "Torah", "Talmud", "Apocrypha",
            "Canon of Scripture", "Manuscripts"],
  },
  {
    label: "Archaeology",
    emoji: "🏺",
    terms: ["Babylon", "Nineveh", "Gezer", "Lachish", "Megiddo",
            "Jericho", "Ur", "Samaria", "Capernaum",
            "Dead Sea Scrolls", "Siloam Inscription",
            "Tel Dan Stele", "Rosetta Stone", "Cuneiform"],
  },
];

// ── Alphabet for A–Z browsing ─────────────────────────────────────────────────
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function BibleEncyclopedia() {
  const [query,    setQuery]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [article,  setArticle]  = useState<{ term: string; body: string; sourceUrl: string; source: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error,    setError]    = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lookup = useCallback(async (term: string) => {
    const t = term.trim();
    if (!t) return;
    setLoading(true);
    setArticle(null);
    setNotFound(false);
    setError("");
    setQuery(t);

    try {
      const res  = await fetch(`/api/encyclopedia?term=${encodeURIComponent(t)}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong."); return; }
      if (data.found) {
        setArticle({ term: data.term, body: data.body, sourceUrl: data.sourceUrl, source: data.source });
      } else {
        setNotFound(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for cross-component lookup events (e.g. from Systematic Theology panel)
  useEffect(() => {
    const handler = (e: Event) => {
      const term = (e as CustomEvent<string>).detail;
      if (term) lookup(term);
    };
    window.addEventListener("encyclopedia:lookup", handler);
    return () => window.removeEventListener("encyclopedia:lookup", handler);
  }, [lookup]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    lookup(query);
  }

  function renderBody(text: string) {
    return text.split("\n\n").map((para, i) => {
      const trimmed = para.trim();
      // Section headers are marked with __Text__
      if (/^__(.+)__$/.test(trimmed)) {
        const title = trimmed.replace(/^__/, "").replace(/__$/, "");
        return (
          <h3
            key={i}
            className="text-sm font-black mt-5 mb-2 pb-1 uppercase tracking-wide"
            style={{ color: NAVY, borderBottom: `1px solid rgba(201,149,42,0.25)` }}
          >
            {title}
          </h3>
        );
      }
      return (
        <p key={i} className="mb-4 text-sm leading-7" style={{ color: "#374151" }}>
          {trimmed}
        </p>
      );
    });
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 py-3" style={{ background: NAVY, borderBottom: "1px solid rgba(201,149,42,0.3)" }}>
        <div className="flex items-center gap-2 mb-0.5">
          <BookOpen size={16} className="text-amber-400" />
          <p className="text-white font-black text-sm">ISBE Encyclopedia</p>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: GOLD, color: NAVY }}>
            1915
          </span>
        </div>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
          International Standard Bible Encyclopedia · Public Domain
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="shrink-0 px-4 py-3" style={{ background: "#f0ebe3", borderBottom: "1px solid #ede8de" }}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any topic, person, place…"
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-medium outline-none"
              style={{ background: "white", color: NAVY, border: "1px solid #ede8de" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 rounded-lg text-xs font-black transition disabled:opacity-40"
            style={{ background: NAVY, color: GOLD }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Look Up"}
          </button>
        </form>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Article result */}
        {article && (
          <div>
            {/* Article toolbar — back + title + external link */}
            <div
              className="sticky top-0 z-10 flex items-center gap-3 px-4 py-2.5"
              style={{ background: "#faf8f3", borderBottom: "1px solid #ede8de" }}
            >
              <button
                onClick={() => { setArticle(null); setNotFound(false); setError(""); }}
                className="flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70"
                style={{ color: NAVY }}
              >
                <ArrowLeft size={14} />
                Browse
              </button>
              <span className="flex-1 text-sm font-black truncate" style={{ color: NAVY }}>
                {article.term}
              </span>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full transition hover:opacity-80"
                style={{ background: "#e8e0d4", color: NAVY }}
                title="Open full article"
              >
                <ExternalLink size={10} />
                Full article
              </a>
            </div>

            {/* Article body */}
            <div className="px-4 pt-4 pb-6">
              <p className="text-[10px] mb-4" style={{ color: "#9ca3af" }}>{article.source}</p>
              {renderBody(article.body)}
              <div className="mt-6 pt-3 text-[10px]" style={{ borderTop: "1px solid #ede8de", color: "#9ca3af" }}>
                International Standard Bible Encyclopedia (1915), James Orr, ed. · Public Domain
              </div>
            </div>
          </div>
        )}

        {/* Not found */}
        {notFound && !loading && (
          <div className="px-4 py-6 text-center">
            <p className="text-sm font-semibold" style={{ color: NAVY }}>
              No ISBE article found for &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs mt-1 text-gray-400">Try a variation — e.g. &ldquo;Holy Spirit&rdquo; instead of &ldquo;Spirit&rdquo;</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="mx-4 my-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 size={20} className="animate-spin text-amber-400" />
            <p className="text-sm text-gray-400">Fetching ISBE article…</p>
          </div>
        )}

        {/* Browse view — shown when no article loaded */}
        {!article && !loading && !notFound && !error && (
          <div className="px-4 py-4">

            {/* A–Z quick jump */}
            <div className="flex flex-wrap gap-1 mb-5">
              {ALPHABET.map(letter => (
                <button
                  key={letter}
                  onClick={() => { setActiveLetter(activeLetter === letter ? null : letter); setQuery(letter); }}
                  className="w-7 h-7 rounded text-[11px] font-black transition"
                  style={
                    activeLetter === letter
                      ? { background: NAVY, color: GOLD }
                      : { background: "#e8e0d4", color: NAVY }
                  }
                >
                  {letter}
                </button>
              ))}
            </div>

            {/* Featured topic groups */}
            {FEATURED.map(group => (
              <div key={group.label} className="mb-5">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: GOLD }}>
                  {group.emoji} {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.terms.map(term => (
                    <button
                      key={term}
                      onClick={() => lookup(term)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition hover:shadow-md"
                      style={{ background: "white", color: NAVY, border: "1px solid #e5e7eb" }}
                    >
                      {term}
                      <ChevronRight size={10} className="opacity-40" />
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* About ISBE */}
            <div
              className="rounded-xl p-4 mt-2 text-xs leading-relaxed"
              style={{ background: "#faf8f3", border: "1px solid #ede8de", color: "#6b7280" }}
            >
              <p className="font-semibold mb-1" style={{ color: NAVY }}>About the ISBE</p>
              <p>
                The International Standard Bible Encyclopedia (1915), edited by James Orr, is one of the most comprehensive
                Bible reference works ever published. It contains thousands of detailed articles on biblical theology,
                archaeology, geography, history, and people — written by leading scholars of the early 20th century.
                The 1915 edition is fully in the public domain.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
