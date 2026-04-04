"use client";

import { useEffect, useState } from "react";

export type StudySession = {
  id: string;
  name: string;
  createdAt: string;
  bookmarks: string[];
  notes: Record<string, string>;
};

const STORAGE_KEY = "scripture-lives-study-sessions";

export default function useStudySessions() {
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setSessions(parsed);
      }
    } catch {
      // ignore invalid data
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const saveSession = (name: string, bookmarks: string[], notes: Record<string, string>) => {
    const session: StudySession = {
      id: `${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      bookmarks,
      notes,
    };

    setSessions((current) => [session, ...current]);
    return session;
  };

  const deleteSession = (id: string) => {
    setSessions((current) => current.filter((session) => session.id !== id));
  };

  return {
    sessions,
    saveSession,
    deleteSession,
  };
}