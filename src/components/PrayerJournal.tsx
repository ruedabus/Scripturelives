"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, ChevronRight, X, BookOpen, Heart, Search, Check } from "lucide-react";

const STORAGE_KEY = "scripture-lives-prayer-journal";

type PrayerStatus = "active" | "answered";

type PrayerEntry = {
  id: string;
  title: string;
  body: string;
  verse?: string;
  verseRef?: string;
  category: string;
  status: PrayerStatus;
  createdAt: string;
  answeredAt?: string;
};

const CATEGORIES = [
  "Personal",
  "Family",
  "Friends",
  "Church",
  "Nation",
  "Healing",
  "Guidance",
  "Gratitude",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Personal:  "bg-amber-100 text-amber-700",
  Family:    "bg-rose-100 text-rose-700",
  Friends:   "bg-sky-100 text-sky-700",
  Church:    "bg-purple-100 text-purple-700",
  Nation:    "bg-blue-100 text-blue-700",
  Healing:   "bg-green-100 text-green-700",
  Guidance:  "bg-indigo-100 text-indigo-700",
  Gratitude: "bg-orange-100 text-orange-700",
  Other:     "bg-gray-100 text-gray-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function PrayerJournal() {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [view, setView] = useState<"list" | "new" | "detail">("list");
  const [selected, setSelected] = useState<PrayerEntry | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "answered">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formVerse, setFormVerse] = useState("");
  const [formVerseRef, setFormVerseRef] = useState("");
  const [formCategory, setFormCategory] = useState("Personal");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const save = (updated: PrayerEntry[]) => {
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addEntry = () => {
    if (!formTitle.trim() || !formBody.trim()) return;
    const entry: PrayerEntry = {
      id: Date.now().toString(),
      title: formTitle.trim(),
      body: formBody.trim(),
      verse: formVerse.trim() || undefined,
      verseRef: formVerseRef.trim() || undefined,
      category: formCategory,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    save([entry, ...entries]);
    setFormTitle(""); setFormBody(""); setFormVerse(""); setFormVerseRef(""); setFormCategory("Personal");
    setView("list");
  };

  const markAnswered = (id: string) => {
    save(entries.map((e) =>
      e.id === id ? { ...e, status: "answered" as PrayerStatus, answeredAt: new Date().toISOString() } : e
    ));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status: "answered", answeredAt: new Date().toISOString() } : prev);
  };

  const deleteEntry = (id: string) => {
    save(entries.filter((e) => e.id !== id));
    if (selected?.id === id) { setSelected(null); setView("list"); }
  };

  const filtered = entries.filter((e) => {
    const matchStatus = filterStatus === "all" || e.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const active = entries.filter((e) => e.status === "active").length;
  const answered = entries.filter((e) => e.status === "answered").length;

  // ── New prayer form ────────────────────────────────────────
  if (view === "new") {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-200 bg-white px-4 py-3 shrink-0 flex items-center gap-2">
          <button type="button" onClick={() => setView("list")} className="text-xs text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1">
            <ChevronRight size={12} className="rotate-180" /> Back
          </button>
          <h2 className="text-sm font-semibold text-gray-800 ml-1">New Prayer</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Prayer Title *</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Healing for Mom, Guidance on new job…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                    formCategory === cat
                      ? `${CATEGORY_COLORS[cat]} border-current`
                      : "bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Your Prayer *</label>
            <textarea
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              placeholder="Write your prayer here…"
              rows={5}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Scripture (optional)</label>
            <input
              type="text"
              value={formVerseRef}
              onChange={(e) => setFormVerseRef(e.target.value)}
              placeholder="Reference, e.g. Philippians 4:6"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 mb-2"
            />
            <textarea
              value={formVerse}
              onChange={(e) => setFormVerse(e.target.value)}
              placeholder="Verse text (optional)…"
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0 flex gap-2">
          <button
            type="button"
            onClick={() => setView("list")}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={addEntry}
            disabled={!formTitle.trim() || !formBody.trim()}
            className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Save Prayer
          </button>
        </div>
      </div>
    );
  }

  // ── Detail view ────────────────────────────────────────────
  if (view === "detail" && selected) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-200 bg-white px-4 py-3 shrink-0">
          <button type="button" onClick={() => setView("list")} className="text-xs text-amber-600 hover:text-amber-800 font-medium flex items-center gap-1 mb-2">
            <ChevronRight size={12} className="rotate-180" /> All Prayers
          </button>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-gray-800">{selected.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CATEGORY_COLORS[selected.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {selected.category}
                </span>
                <span className="text-[10px] text-gray-400">{formatDate(selected.createdAt)}</span>
                {selected.status === "answered" && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700">✓ Answered{selected.answeredAt ? ` · ${formatDate(selected.answeredAt)}` : ""}</span>
                )}
              </div>
            </div>
            <button type="button" onClick={() => deleteEntry(selected.id)} className="text-gray-300 hover:text-red-400 transition p-1">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.body}</p>

          {selected.verseRef && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-bold text-amber-600 mb-1">{selected.verseRef}</p>
              {selected.verse && <p className="text-sm text-gray-700 italic">"{selected.verse}"</p>}
            </div>
          )}
        </div>

        {selected.status === "active" && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
            <button
              type="button"
              onClick={() => markAnswered(selected.id)}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-50 border border-green-200 py-2 text-sm font-semibold text-green-700 hover:bg-green-100 transition"
            >
              <Check size={14} /> Mark as Answered
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Prayer Journal</h2>
            <p className="text-xs text-gray-400">{active} active · {answered} answered</p>
          </div>
          <button
            type="button"
            onClick={() => setView("new")}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition"
          >
            <Plus size={13} /> New Prayer
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prayers…"
            className="w-full rounded-lg border border-gray-200 pl-8 pr-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {(["all", "active", "answered"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterStatus(f)}
              className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition ${
                filterStatus === f
                  ? "bg-amber-100 text-amber-700"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Prayer list */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <Heart size={28} className="text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">
              {entries.length === 0 ? "Your prayer journal is empty" : "No prayers match your filter"}
            </p>
            {entries.length === 0 && (
              <button
                type="button"
                onClick={() => setView("new")}
                className="mt-3 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition"
              >
                Write your first prayer
              </button>
            )}
          </div>
        ) : (
          filtered.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => { setSelected(entry); setView("detail"); }}
              className="w-full text-left px-4 py-3 hover:bg-amber-50 transition group"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-semibold truncate ${entry.status === "answered" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                      {entry.title}
                    </p>
                    {entry.status === "answered" && (
                      <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold bg-green-100 text-green-600">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{entry.body}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[entry.category] ?? "bg-gray-100 text-gray-500"}`}>
                      {entry.category}
                    </span>
                    <span className="text-[10px] text-gray-300">{formatDate(entry.createdAt)}</span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-400 mt-1 shrink-0 transition" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
