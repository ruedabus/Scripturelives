"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight,
  Volume2, VolumeX, Headphones, Loader2, AlertCircle,
} from "lucide-react";

// ── Bible book / chapter data ──────────────────────────────────────────────
const BOOK_CHAPTERS: Record<string, number> = {
  // Old Testament
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
  Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150,
  Proverbs: 31, Ecclesiastes: 12, "Song of Songs": 8, Isaiah: 66,
  Jeremiah: 52, Lamentations: 5, Ezekiel: 48, Daniel: 12, Hosea: 14,
  Joel: 3, Amos: 9, Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3,
  Habakkuk: 3, Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  // New Testament
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28, Romans: 16,
  "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
  "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1, Hebrews: 13,
  James: 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1,
  "3 John": 1, Jude: 1, Revelation: 22,
};

const OT_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges",
  "Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles",
  "Ezra","Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes",
  "Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
  "Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk",
  "Zephaniah","Haggai","Zechariah","Malachi",
];
const NT_BOOKS = [
  "Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians",
  "1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus",
  "Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John",
  "3 John","Jude","Revelation",
];
const ALL_BOOKS = [...OT_BOOKS, ...NT_BOOKS];

// ── Helpers ────────────────────────────────────────────────────────────────
function fmt(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

// ── Component ──────────────────────────────────────────────────────────────
export default function AudioBiblePlayer() {
  const [book,    setBook]    = useState("John");
  const [chapter, setChapter] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume,  setVolume]  = useState(1);
  const [muted,   setMuted]   = useState(false);
  const [speed,   setSpeed]   = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [autoAdvance, setAutoAdvance] = useState(true);

  const audioRef  = useRef<HTMLAudioElement>(null);
  const seekRef   = useRef<HTMLInputElement>(null);
  const totalChapters = BOOK_CHAPTERS[book] ?? 1;

  // ── Audio source URL ───────────────────────────────────────────────────
  const audioSrc = `/api/audio-bible?book=${encodeURIComponent(book)}&chapter=${chapter}`;

  // ── Sync audio element settings when they change ───────────────────────
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed]);

  // ── Reset player when passage changes ─────────────────────────────────
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
    setError("");
    setLoading(false);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, [book, chapter]);

  // ── Audio event handlers ───────────────────────────────────────────────
  const onLoadStart   = ()      => { setLoading(true);  setError(""); };
  const onCanPlay     = ()      => { setLoading(false); };
  const onDurationChange = (e: React.SyntheticEvent<HTMLAudioElement>) =>
    setDuration((e.target as HTMLAudioElement).duration);
  const onTimeUpdate  = (e: React.SyntheticEvent<HTMLAudioElement>) =>
    setCurrent((e.target as HTMLAudioElement).currentTime);
  const onError       = ()      => { setLoading(false); setError("Could not load audio for this passage."); };
  const onPlay        = ()      => setPlaying(true);
  const onPause       = ()      => setPlaying(false);
  const onEnded       = useCallback(() => {
    setPlaying(false);
    if (autoAdvance) {
      if (chapter < totalChapters) {
        setChapter((c) => c + 1);
        // small delay so state settles before autoplay
        setTimeout(() => {
          audioRef.current?.play().catch(() => null);
          setPlaying(true);
        }, 400);
      }
    }
  }, [autoAdvance, chapter, totalChapters]);

  // ── Controls ───────────────────────────────────────────────────────────
  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); }
    else         { el.play().catch(() => setError("Playback blocked — tap play again.")); }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrent(t);
  };

  const prevChapter = () => {
    if (chapter > 1) setChapter((c) => c - 1);
    else {
      const idx = ALL_BOOKS.indexOf(book);
      if (idx > 0) {
        const prev = ALL_BOOKS[idx - 1];
        setBook(prev);
        setChapter(BOOK_CHAPTERS[prev] ?? 1);
      }
    }
  };

  const nextChapter = () => {
    if (chapter < totalChapters) setChapter((c) => c + 1);
    else {
      const idx = ALL_BOOKS.indexOf(book);
      if (idx < ALL_BOOKS.length - 1) {
        setBook(ALL_BOOKS[idx + 1]);
        setChapter(1);
      }
    }
  };

  const skipBack = () => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.max(0, el.currentTime - 15);
  };
  const skipFwd  = () => {
    const el = audioRef.current;
    if (el) el.currentTime = Math.min(el.duration || 0, el.currentTime + 30);
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Headphones size={17} className="text-indigo-600" />
          <h2 className="text-base font-semibold text-gray-800">Audio Bible</h2>
          <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">ESV</span>
        </div>
        <p className="text-[11px] text-gray-400">Professional narration — English Standard Version</p>
      </div>

      {/* ── Passage selector ──────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-100 shrink-0 space-y-2">
        {/* Book */}
        <select
          value={book}
          onChange={(e) => { setBook(e.target.value); setChapter(1); }}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-indigo-400"
        >
          <optgroup label="— Old Testament —">
            {OT_BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </optgroup>
          <optgroup label="— New Testament —">
            {NT_BOOKS.map((b) => <option key={b} value={b}>{b}</option>)}
          </optgroup>
        </select>

        {/* Chapter nav */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevChapter}
            disabled={book === ALL_BOOKS[0] && chapter === 1}
            className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            <ChevronLeft size={14} />
          </button>

          <select
            value={chapter}
            onChange={(e) => setChapter(Number(e.target.value))}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-center text-gray-800 focus:outline-none focus:border-indigo-400"
          >
            {Array.from({ length: totalChapters }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>Chapter {n}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={nextChapter}
            disabled={book === ALL_BOOKS[ALL_BOOKS.length - 1] && chapter === totalChapters}
            className="rounded-lg border border-gray-200 p-1.5 hover:bg-gray-50 disabled:opacity-30 transition"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Now playing card ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-6">

        {/* Album art / passage display */}
        <div className="w-full max-w-xs rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 px-6 py-8 text-center shadow-sm">
          <div className="text-5xl mb-4">🎧</div>
          <p className="text-lg font-bold text-gray-900">{book}</p>
          <p className="text-sm text-indigo-600 font-semibold">Chapter {chapter}</p>
          <p className="text-[11px] text-gray-400 mt-1">English Standard Version</p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-xs flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-full max-w-xs space-y-1.5">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
            <input
              ref={seekRef}
              type="range"
              min={0}
              max={duration || 100}
              value={current}
              onChange={seek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[11px] text-gray-400">
            <span>{fmt(current)}</span>
            {loading
              ? <span className="flex items-center gap-1 text-indigo-400"><Loader2 size={10} className="animate-spin" /> Loading…</span>
              : <span>{fmt(duration)}</span>
            }
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center gap-5">
          {/* -15s */}
          <button type="button" onClick={skipBack} className="text-gray-400 hover:text-gray-700 transition" title="Back 15s">
            <SkipBack size={20} />
          </button>

          {/* Prev chapter */}
          <button
            type="button"
            onClick={prevChapter}
            disabled={book === ALL_BOOKS[0] && chapter === 1}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30 transition"
            title="Previous chapter"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md transition active:scale-95"
          >
            {loading
              ? <Loader2 size={22} className="animate-spin" />
              : playing
              ? <Pause size={22} fill="white" />
              : <Play  size={22} fill="white" className="ml-0.5" />
            }
          </button>

          {/* Next chapter */}
          <button
            type="button"
            onClick={nextChapter}
            disabled={book === ALL_BOOKS[ALL_BOOKS.length - 1] && chapter === totalChapters}
            className="text-gray-500 hover:text-gray-800 disabled:opacity-30 transition"
            title="Next chapter"
          >
            <ChevronRight size={22} />
          </button>

          {/* +30s */}
          <button type="button" onClick={skipFwd} className="text-gray-400 hover:text-gray-700 transition" title="Forward 30s">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Speed + Volume row */}
        <div className="w-full max-w-xs flex items-center justify-between gap-3">

          {/* Playback speed */}
          <div className="flex items-center gap-1">
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`text-[11px] font-semibold px-1.5 py-0.5 rounded transition ${
                  speed === s
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => setMuted((m) => !m)} className="text-gray-400 hover:text-gray-700 transition">
              {muted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min={0} max={1} step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
              className="w-20 accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Auto-advance toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setAutoAdvance((a) => !a)}
            className={`w-9 h-5 rounded-full transition-colors relative ${autoAdvance ? "bg-indigo-500" : "bg-gray-200"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${autoAdvance ? "translate-x-4" : "translate-x-0.5"}`} />
          </div>
          <span className="text-xs text-gray-500">Auto-advance to next chapter</span>
        </label>
      </div>

      {/* ── Attribution (ESV requires this) ───────────────────────── */}
      <div className="shrink-0 border-t border-gray-100 bg-gray-50 px-4 py-2 text-center">
        <p className="text-[10px] text-gray-400">
          Scripture quotations from the{" "}
          <span className="font-semibold">ESV® Bible</span> (The Holy Bible, English Standard
          Version®). Copyright © 2001 by Crossway.
        </p>
      </div>

      {/* ── Hidden audio element ───────────────────────────────────── */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="none"
        onLoadStart={onLoadStart}
        onCanPlay={onCanPlay}
        onDurationChange={onDurationChange}
        onTimeUpdate={onTimeUpdate}
        onError={onError}
        onPlay={onPlay}
        onPause={onPause}
        onEnded={onEnded}
      />
    </div>
  );
}
