"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "scripture-lives-reading-plan";

export type ReadingPlanEntry = {
  id: string;            // unique, e.g. "KJV-John-3-16"
  version: "KJV" | "ASV" | "WEB";
  book: string;
  chapter: number;
  verse?: number;        // if undefined, whole chapter
  reference: string;     // display label, e.g. "John 3:16"
  text: string;          // the verse/chapter snippet
  addedAt: string;       // ISO timestamp
  note: string;          // user's personal note
  tags: string[];        // e.g. ["Daily", "Sunday", "Grace"]
};

export default function useReadingPlan() {
  // Lazy initializer reads localStorage once synchronously on first mount,
  // preventing the save effect from overwriting saved data before load completes.
  const [plan, setPlan] = useState<ReadingPlanEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore bad data
    }
    return [];
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  }, [plan]);

  const addEntry = (entry: Omit<ReadingPlanEntry, "id" | "addedAt" | "note" | "tags">) => {
    const id = `${entry.version}-${entry.book}-${entry.chapter}${entry.verse != null ? `-${entry.verse}` : ""}`;
    setPlan((prev) => {
      if (prev.find((e) => e.id === id)) return prev; // already saved
      return [
        { ...entry, id, addedAt: new Date().toISOString(), note: "", tags: [] },
        ...prev,
      ];
    });
    return id;
  };

  const removeEntry = (id: string) => {
    setPlan((prev) => prev.filter((e) => e.id !== id));
  };

  const updateNote = (id: string, note: string) => {
    setPlan((prev) => prev.map((e) => (e.id === id ? { ...e, note } : e)));
  };

  const updateTags = (id: string, tags: string[]) => {
    setPlan((prev) => prev.map((e) => (e.id === id ? { ...e, tags } : e)));
  };

  const isInPlan = (version: string, book: string, chapter: number, verse?: number) => {
    const id = `${version}-${book}-${chapter}${verse != null ? `-${verse}` : ""}`;
    return plan.some((e) => e.id === id);
  };

  const reorder = (fromIdx: number, toIdx: number) => {
    setPlan((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  };

  return { plan, addEntry, removeEntry, updateNote, updateTags, isInPlan, reorder };
}
