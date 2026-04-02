"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "scripture-alive-place-notes";

type NotesMap = Record<string, string>;

export default function usePlaceNotes() {
  const [notes, setNotes] = useState<NotesMap>({});

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        setNotes(parsed);
      }
    } catch {
      // ignore bad localStorage data
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const getNote = (placeName: string) => notes[placeName] ?? "";

  const saveNote = (placeName: string, note: string) => {
    setNotes((current) => ({
      ...current,
      [placeName]: note,
    }));
  };

  const removeNote = (placeName: string) => {
    setNotes((current) => {
      const copy = { ...current };
      delete copy[placeName];
      return copy;
    });
  };

  return {
    notes,
    getNote,
    saveNote,
    removeNote,
  };
}