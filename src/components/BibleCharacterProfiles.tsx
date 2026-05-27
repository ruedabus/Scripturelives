"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronRight, BookOpen, Users, Star, X } from "lucide-react";
import {
  BIBLE_CHARACTERS,
  BibleCharacter,
  CharacterCategory,
  Testament,
  getRelatedCharacters,
} from "@/data/bibleCharacters";

// ── Category colors ───────────────────────────────────────────────────────────
const CATEGORY_STYLE: Record<CharacterCategory, { bg: string; text: string; border: string }> = {
  Patriarch:  { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-200" },
  Matriarch:  { bg: "bg-rose-100",    text: "text-rose-700",    border: "border-rose-200"  },
  Prophet:    { bg: "bg-indigo-100",  text: "text-indigo-700",  border: "border-indigo-200"},
  King:       { bg: "bg-yellow-100",  text: "text-yellow-700",  border: "border-yellow-200"},
  Apostle:    { bg: "bg-sky-100",     text: "text-sky-700",     border: "border-sky-200"   },
  Judge:      { bg: "bg-orange-100",  text: "text-orange-700",  border: "border-orange-200"},
  Priest:     { bg: "bg-purple-100",  text: "text-purple-700",  border: "border-purple-200"},
  Warrior:    { bg: "bg-red-100",     text: "text-red-700",     border: "border-red-200"   },
  Disciple:   { bg: "bg-teal-100",    text: "text-teal-700",    border: "border-teal-200"  },
  Messiah:    { bg: "bg-stone-900",   text: "text-amber-300",   border: "border-stone-700" },
};

// ── Portrait hero gradient per category ──────────────────────────────────────
const PORTRAIT_GRADIENT: Record<CharacterCategory, { grad: string; ring: string; glow: string }> = {
  Patriarch: { grad: "linear-gradient(160deg,#78350f 0%,#b45309 50%,#92400e 100%)", ring: "rgba(251,191,36,0.5)", glow: "#fbbf24" },
  Matriarch: { grad: "linear-gradient(160deg,#881337 0%,#be123c 50%,#9f1239 100%)", ring: "rgba(251,113,133,0.5)", glow: "#fb7185" },
  Prophet:   { grad: "linear-gradient(160deg,#1e1b4b 0%,#3730a3 50%,#312e81 100%)", ring: "rgba(129,140,248,0.5)", glow: "#818cf8" },
  King:      { grad: "linear-gradient(160deg,#713f12 0%,#a16207 50%,#854d0e 100%)", ring: "rgba(250,204,21,0.5)",  glow: "#facc15" },
  Apostle:   { grad: "linear-gradient(160deg,#0c4a6e 0%,#0369a1 50%,#075985 100%)", ring: "rgba(56,189,248,0.5)",  glow: "#38bdf8" },
  Judge:     { grad: "linear-gradient(160deg,#7c2d12 0%,#c2410c 50%,#9a3412 100%)", ring: "rgba(251,146,60,0.5)",  glow: "#fb923c" },
  Priest:    { grad: "linear-gradient(160deg,#3b0764 0%,#7e22ce 50%,#581c87 100%)", ring: "rgba(192,132,252,0.5)", glow: "#c084fc" },
  Warrior:   { grad: "linear-gradient(160deg,#450a0a 0%,#991b1b 50%,#7f1d1d 100%)", ring: "rgba(248,113,113,0.5)", glow: "#f87171" },
  Disciple:  { grad: "linear-gradient(160deg,#042f2e 0%,#0f766e 50%,#134e4a 100%)", ring: "rgba(45,212,191,0.5)",  glow: "#2dd4bf" },
  Messiah:   { grad: "linear-gradient(160deg,#0c0a09 0%,#292524 50%,#1c1917 100%)", ring: "rgba(253,224,71,0.6)",  glow: "#fde047" },
};

// ── Decorative SVG pattern for portrait card ──────────────────────────────────
function PortraitPattern({ color }: { color: string }) {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="crosses" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M13 2h6v9h9v6h-9v9h-6v-9H2v-6h11z" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#crosses)" />
    </svg>
  );
}

// ── Character portrait hero ───────────────────────────────────────────────────
function CharacterPortrait({ char }: { char: BibleCharacter }) {
  const pg = PORTRAIT_GRADIENT[char.category];
  const [imgSrc, setImgSrc]     = useState<string | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgCredit, setImgCredit] = useState<string>("");

  useEffect(() => {
    setImgSrc(null);
    setImgLoaded(false);
    setImgCredit("");
    if (!char.wikipediaTitle) return;

    // Use server-side proxy to avoid CSP/CORS issues with the Wikipedia API
    fetch(`/api/wiki-portrait?title=${encodeURIComponent(char.wikipediaTitle)}`)
      .then((r) => r.json())
      .then((data: { src: string | null; credit: string }) => {
        if (data.src) setImgSrc(data.src);
        if (data.credit) setImgCredit(data.credit);
      })
      .catch(() => {});
  }, [char.wikipediaTitle]);

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{ background: pg.grad, minHeight: imgSrc ? 280 : 200 }}
    >
      {/* Real painting — shown when loaded */}
      {imgSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt={`Historical portrait of ${char.name}`}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgSrc(null)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />
      )}

      {/* Gradient overlay — always present for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: imgLoaded
            ? `linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)`
            : "transparent",
        }}
      />

      {/* Fallback pattern when no image */}
      {!imgLoaded && (
        <>
          <PortraitPattern color={pg.glow} />
          <div className="absolute top-0 left-0 right-0 h-1 opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${pg.glow}, transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-1 opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${pg.glow}, transparent)` }} />
        </>
      )}

      {/* Portrait content overlay */}
      <div className="relative z-10 flex flex-col items-end px-4 pb-4 pt-40">
        {/* Name */}
        <h2 className="text-xl font-black text-white w-full" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}>
          {char.name}
        </h2>
        {/* Tagline */}
        <p className="text-xs mt-0.5 w-full italic" style={{ color: "rgba(255,255,255,0.75)", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
          {char.tagline}
        </p>
        {/* Attribution */}
        {imgLoaded && imgCredit && (
          <p className="text-[9px] mt-1 w-full" style={{ color: "rgba(255,255,255,0.45)" }}>
            via Wikipedia · {imgCredit}
          </p>
        )}
      </div>

      {/* Era pill — top right */}
      <div
        className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
        style={{ background: "rgba(0,0,0,0.55)", color: pg.glow, border: `1px solid ${pg.ring}`, backdropFilter: "blur(4px)" }}
      >
        {char.era}
      </div>

      {/* Loading shimmer when fetching */}
      {imgSrc && !imgLoaded && (
        <div className="absolute inset-0 animate-pulse" style={{ background: "rgba(0,0,0,0.3)" }} />
      )}
    </div>
  );
}

// ── Category chip ─────────────────────────────────────────────────────────────
function CategoryChip({ category }: { category: CharacterCategory }) {
  const s = CATEGORY_STYLE[category];
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
      {category}
    </span>
  );
}

// ── Testament pill ────────────────────────────────────────────────────────────
function TestamentPill({ testament }: { testament: Testament }) {
  if (testament === "Both") return <span className="text-xs text-amber-600 font-semibold">OT + NT</span>;
  return <span className={`text-xs font-semibold ${testament === "OT" ? "text-stone-500" : "text-sky-600"}`}>{testament}</span>;
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BibleCharacterProfiles({
  onOpenVerse,
}: {
  onOpenVerse?: (ref: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selectedTestament, setSelectedTestament] = useState<"all" | Testament>("all");
  const [selectedCategory, setSelectedCategory] = useState<CharacterCategory | "all">("all");
  const [selected, setSelected] = useState<BibleCharacter | null>(null);
  const [activeTab, setActiveTab] = useState<"story" | "verses" | "lessons">("story");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return BIBLE_CHARACTERS.filter((c) => {
      if (selectedTestament !== "all" && c.testament !== selectedTestament && c.testament !== "Both") return false;
      if (selectedCategory !== "all" && c.category !== selectedCategory) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.tagline.toLowerCase().includes(q) && !c.era.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, selectedTestament, selectedCategory]);

  const categories = useMemo(() => {
    const seen = new Set<CharacterCategory>();
    BIBLE_CHARACTERS.forEach((c) => seen.add(c.category));
    return [...seen];
  }, []);

  const related = selected ? getRelatedCharacters(selected) : [];

  // ── Detail view ──────────────────────────────────────────────────────────
  if (selected) {
    const s = CATEGORY_STYLE[selected.category];
    return (
      <div className="space-y-5">
        {/* Back */}
        <button
          type="button"
          onClick={() => { setSelected(null); setActiveTab("story"); }}
          className="text-xs text-gray-400 hover:text-amber-600 transition flex items-center gap-1"
        >
          ← All Characters
        </button>

        {/* Portrait hero */}
        <CharacterPortrait char={selected} />

        {/* Category / testament row */}
        <div className="flex flex-wrap items-center gap-2 -mt-1 px-1">
          <CategoryChip category={selected.category} />
          <TestamentPill testament={selected.testament} />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {(["story", "verses", "lessons"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition ${
                activeTab === tab ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "story" ? "Life Story" : tab === "verses" ? "Key Verses" : "Life Lessons"}
            </button>
          ))}
        </div>

        {/* Tab: Story */}
        {activeTab === "story" && (
          <div className="space-y-5">
            {/* Bio */}
            <p className="text-sm text-gray-700 leading-relaxed">{selected.bio}</p>

            {/* Life events */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Key Life Events</h3>
              <div className="space-y-3">
                {selected.lifeEvents.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-900 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      {i < selected.lifeEvents.length - 1 && (
                        <div className="w-px flex-1 bg-amber-200 mt-1" />
                      )}
                    </div>
                    <div className="pb-3 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{event.description}</p>
                      {event.reference && (
                        <button
                          type="button"
                          onClick={() => onOpenVerse?.(event.reference!)}
                          className="mt-1 text-xs text-amber-600 font-medium hover:text-amber-700 hover:underline transition flex items-center gap-1"
                        >
                          <BookOpen size={10} />
                          {event.reference}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Books */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Appears In</h3>
              <div className="flex flex-wrap gap-1.5">
                {selected.books.map((book) => (
                  <span key={book} className="rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs text-gray-600">{book}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Key Verses */}
        {activeTab === "verses" && (
          <div className="space-y-3">
            {selected.keyVerses.map((kv, i) => (
              <div key={i} className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-sm font-bold text-amber-700 mb-2">{kv.reference}</p>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{kv.text}"</p>
                {onOpenVerse && (
                  <button
                    type="button"
                    onClick={() => onOpenVerse(kv.reference)}
                    className="mt-2 flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 hover:underline transition font-medium"
                  >
                    <BookOpen size={11} /> Open in Reader
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab: Lessons */}
        {activeTab === "lessons" && (
          <div className="space-y-4">
            <div className="space-y-3">
              {selected.lessons.map((lesson, i) => (
                <div key={i} className="flex gap-3 rounded-xl bg-white border border-gray-200 p-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-amber-500 text-stone-900 text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{lesson}</p>
                </div>
              ))}
            </div>

            {/* Related Characters */}
            {related.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Related Characters</h3>
                <div className="flex flex-wrap gap-2">
                  {related.map((rc) => (
                    <button
                      key={rc.id}
                      type="button"
                      onClick={() => setSelected(rc)}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:border-amber-300 hover:bg-amber-50 transition"
                    >
                      <span className="text-base">{rc.emoji}</span>
                      <span className="font-medium text-gray-700">{rc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2">
          <Users size={18} /> Bible Character Profiles
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">{BIBLE_CHARACTERS.length} profiles — biographies, key verses, life lessons</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, era, or theme…"
          className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:border-amber-400 focus:outline-none"
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Testament filter */}
      <div className="flex gap-2">
        {(["all", "OT", "NT"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSelectedTestament(t)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${
              selectedTestament === t
                ? "bg-amber-500 border-amber-500 text-stone-900"
                : "border-gray-200 text-gray-500 hover:border-amber-300"
            }`}
          >
            {t === "all" ? "All" : t === "OT" ? "Old Testament" : "New Testament"}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
            selectedCategory === "all" ? "bg-stone-800 text-white border-stone-800" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const s = CATEGORY_STYLE[cat];
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(active ? "all" : cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
                active ? `${s.bg} ${s.text} ${s.border}` : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {(search || selectedTestament !== "all" || selectedCategory !== "all") && (
        <p className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
      )}

      {/* Character grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Users size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No characters match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((char) => {
            const s = CATEGORY_STYLE[char.category];
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelected(char)}
                className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-amber-300 hover:bg-amber-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden"
                    style={{
                      background: PORTRAIT_GRADIENT[char.category].grad,
                      boxShadow: `0 0 10px ${PORTRAIT_GRADIENT[char.category].ring}`,
                    }}
                  >
                    <span className="relative z-10">{char.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-amber-700 transition">{char.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${s.bg} ${s.text} ${s.border}`}>{char.category}</span>
                      <TestamentPill testament={char.testament} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 italic line-clamp-1">{char.tagline}</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">{char.era}</p>
                  </div>
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-amber-500 shrink-0 transition" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
