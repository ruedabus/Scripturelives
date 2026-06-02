/**
 * useAnnotations
 * Manages Bible verse highlights and notes in localStorage.
 *
 * Storage keys:
 *   scripture-lives-highlights  → Record<reference, HighlightColor>
 *   scripture-lives-verse-notes → Record<reference, VerseNote>
 */
"use client";

import { useCallback, useEffect, useState } from "react";

export type HighlightColor = "yellow" | "green" | "pink" | "blue" | "orange" | "purple";

export type VerseNote = {
  reference: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

const KEY_HIGHLIGHTS = "scripture-lives-highlights";
const KEY_NOTES      = "scripture-lives-verse-notes";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function useAnnotations() {
  const [highlights, setHighlights] = useState<Record<string, HighlightColor>>({});
  const [notes,      setNotes]      = useState<Record<string, VerseNote>>({});
  const [ready,      setReady]      = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setHighlights(loadJson(KEY_HIGHLIGHTS, {}));
    setNotes(loadJson(KEY_NOTES, {}));
    setReady(true);
  }, []);

  // ── Highlights ─────────────────────────────────────────────────────────────

  const setHighlight = useCallback((reference: string, color: HighlightColor) => {
    setHighlights((prev) => {
      const next = { ...prev, [reference]: color };
      saveJson(KEY_HIGHLIGHTS, next);
      return next;
    });
  }, []);

  const clearHighlight = useCallback((reference: string) => {
    setHighlights((prev) => {
      const next = { ...prev };
      delete next[reference];
      saveJson(KEY_HIGHLIGHTS, next);
      return next;
    });
  }, []);

  const getHighlight = useCallback(
    (reference: string): HighlightColor | null => highlights[reference] ?? null,
    [highlights]
  );

  // ── Notes ──────────────────────────────────────────────────────────────────

  const saveNote = useCallback((reference: string, text: string) => {
    setNotes((prev) => {
      const existing = prev[reference];
      const next = {
        ...prev,
        [reference]: {
          reference,
          text,
          createdAt: existing?.createdAt ?? new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
      saveJson(KEY_NOTES, next);
      return next;
    });
  }, []);

  const deleteNote = useCallback((reference: string) => {
    setNotes((prev) => {
      const next = { ...prev };
      delete next[reference];
      saveJson(KEY_NOTES, next);
      return next;
    });
  }, []);

  const getNote = useCallback(
    (reference: string): VerseNote | null => notes[reference] ?? null,
    [notes]
  );

  // ── Summary ────────────────────────────────────────────────────────────────

  const allNotes      = Object.values(notes).sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
  const allHighlights = Object.entries(highlights).map(([reference, color]) => ({
    reference,
    color,
  }));

  return {
    ready,
    highlights,
    notes,
    allNotes,
    allHighlights,
    setHighlight,
    clearHighlight,
    getHighlight,
    saveNote,
    deleteNote,
    getNote,
  };
}
