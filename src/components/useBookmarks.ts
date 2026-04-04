"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "scripture-lives-bookmarks";

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setBookmarks(parsed);
      }
    } catch {
      // ignore bad localStorage data
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (placeName: string) => {
    setBookmarks((current) =>
      current.includes(placeName) ? current : [...current, placeName]
    );
  };

  const removeBookmark = (placeName: string) => {
    setBookmarks((current) => current.filter((name) => name !== placeName));
  };

  const toggleBookmark = (placeName: string) => {
    setBookmarks((current) =>
      current.includes(placeName)
        ? current.filter((name) => name !== placeName)
        : [...current, placeName]
    );
  };

  const isBookmarked = (placeName: string) => bookmarks.includes(placeName);

  const replaceBookmarks = (nextBookmarks: string[]) => {
    setBookmarks(nextBookmarks);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    replaceBookmarks,
  };
}