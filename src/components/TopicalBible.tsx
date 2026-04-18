"use client";

import React, { useState, useMemo } from "react";
import { Search, BookOpen, ChevronRight, X, Copy, Check } from "lucide-react";
import { TOPICAL_BIBLE, ALL_TOPICS, type Topic, type TopicCategory } from "@/data/topicalBible";

type Props = {
  onOpenVerse?: (reference: string) => void;
};

export default function TopicalBible({ onOpenVerse }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Filter topics by search
  const filteredCategories = useMemo<TopicCategory[]>(() => {
    if (!searchQuery.trim()) return TOPICAL_BIBLE;
    const q = searchQuery.toLowerCase();
    return TOPICAL_BIBLE
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.verses.some(
              (v) =>
                v.reference.toLowerCase().includes(q) ||
                v.text.toLowerCase().includes(q)
            )
        ),
      }))
      .filter((cat) => cat.topics.length > 0);
  }, [searchQuery]);

  const totalTopics = ALL_TOPICS.length;
  const totalVerses = ALL_TOPICS.reduce((n, t) => n + t.verses.length, 0);

  const copyVerse = (ref: string, text: string) => {
    navigator.clipboard.writeText(`"${text}" — ${ref}`);
    setCopied(ref);
    setTimeout(() => setCopied(null), 1800);
  };

  // ── Topic detail view ────────────────────────────────────────
  if (selectedTopic) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-4 py-3 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedTopic(null)}
            className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-800 font-medium mb-2 transition"
          >
            <ChevronRight size={12} className="rotate-180" /> All Topics
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedTopic.emoji}</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">{selectedTopic.title}</h2>
              <p className="text-xs text-gray-500">{selectedTopic.description}</p>
            </div>
            <span className="ml-auto text-xs text-gray-400">{selectedTopic.verses.length} verses</span>
          </div>
        </div>

        {/* Verse list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {selectedTopic.verses.map((v) => (
            <div key={v.reference} className="px-4 py-4 hover:bg-amber-50 transition group">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-amber-600">{v.reference}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    type="button"
                    title="Copy verse"
                    onClick={() => copyVerse(v.reference, v.text)}
                    className="rounded p-1 hover:bg-amber-100 text-gray-400 hover:text-amber-700 transition"
                  >
                    {copied === v.reference ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  </button>
                  {onOpenVerse && (
                    <button
                      type="button"
                      title="Open in Reader"
                      onClick={() => onOpenVerse(v.reference)}
                      className="rounded p-1 hover:bg-amber-100 text-gray-400 hover:text-amber-700 transition"
                    >
                      <BookOpen size={12} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed italic">"{v.text}"</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Topic list view ──────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Topical Bible</h2>
            <p className="text-xs text-gray-400">{totalTopics} topics · {totalVerses} verses</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics or keywords…"
            className="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-8 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Topic categories */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">No topics found for "{searchQuery}"</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-xs text-amber-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.category}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {cat.category}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {cat.topics.map((topic) => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-white p-3 text-left hover:border-amber-300 hover:bg-amber-50 transition group"
                  >
                    <span className="text-xl shrink-0 mt-0.5">{topic.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 group-hover:text-amber-700 transition truncate">
                        {topic.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-tight line-clamp-2">
                        {topic.verses.length} verses
                      </p>
                    </div>
                    <ChevronRight size={12} className="ml-auto shrink-0 text-gray-300 group-hover:text-amber-400 mt-1 transition" />
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
