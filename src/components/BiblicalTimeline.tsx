"use client";

import { useState } from "react";
import {
  TIMELINE_EVENTS,
  ALL_ERAS,
  ERA_COLORS,
  ERA_DOT,
  TimelineEra,
  TimelineEvent,
} from "@/data/timeline";

type Props = {
  onNavigate: (book: string, chapter: number) => void;
};

function EventCard({
  event,
  onNavigate,
}: {
  event: TimelineEvent;
  onNavigate: (book: string, chapter: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const colorClass = ERA_COLORS[event.era];
  const dotClass = ERA_DOT[event.era];

  return (
    <div className="flex gap-3">
      {/* Timeline spine + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`w-3 h-3 rounded-full mt-1 ${dotClass} ring-2 ring-white`} />
        <div className="w-px flex-1 bg-gray-200 mt-1" />
      </div>

      {/* Card */}
      <div className={`mb-4 rounded-xl border px-4 py-3 flex-1 min-w-0 ${colorClass}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs opacity-60 font-mono">{event.yearLabel}</p>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="text-sm font-semibold text-left hover:opacity-80 transition mt-0.5"
            >
              {event.type === "person" ? "👤 " : event.type === "prophecy" ? "📜 " : "✦ "}
              {event.title}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-lg leading-none opacity-40 hover:opacity-80 transition shrink-0"
          >
            {open ? "−" : "+"}
          </button>
        </div>

        {open && (
          <div className="mt-3 space-y-2 text-xs opacity-90">
            <p className="leading-relaxed">{event.description}</p>
            {event.book && event.chapter && (
              <button
                type="button"
                onClick={() => onNavigate(event.book!, event.chapter!)}
                className="inline-flex items-center gap-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 transition font-medium"
              >
                📖 Read {event.book} {event.chapter} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BiblicalTimeline({ onNavigate }: Props) {
  const [activeEras, setActiveEras] = useState<Set<TimelineEra>>(new Set(ALL_ERAS));
  const [search, setSearch] = useState("");

  const toggleEra = (era: TimelineEra) => {
    setActiveEras((prev) => {
      const next = new Set(prev);
      if (next.has(era)) next.delete(era);
      else next.add(era);
      return next;
    });
  };

  const filtered = TIMELINE_EVENTS.filter((e) => {
    if (!activeEras.has(e.era)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.era.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-3">
        <h2 className="text-lg font-semibold text-amber-700">Biblical Timeline</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {TIMELINE_EVENTS.length} key events from Creation to Revelation
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search events, people, eras…"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
      />

      {/* Era filter chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() =>
            setActiveEras(
              activeEras.size === ALL_ERAS.length ? new Set() : new Set(ALL_ERAS)
            )
          }
          className="rounded-full border border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-gray-400 transition"
        >
          {activeEras.size === ALL_ERAS.length ? "Hide all" : "Show all"}
        </button>
        {ALL_ERAS.map((era) => {
          const active = activeEras.has(era);
          const dot = ERA_DOT[era];
          return (
            <button
              key={era}
              type="button"
              onClick={() => toggleEra(era)}
              className={`rounded-full border px-2.5 py-1 text-xs transition flex items-center gap-1.5 ${
                active
                  ? "border-gray-300 text-gray-600 bg-gray-100"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${active ? dot : "bg-gray-200"}`} />
              {era}
            </button>
          );
        })}
      </div>

      {/* Count */}
      {search && (
        <p className="text-xs text-gray-400">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Timeline */}
      <div className="pt-2">
        {ALL_ERAS.filter((era) => activeEras.has(era)).map((era) => {
          const eraEvents = filtered.filter((e) => e.era === era);
          if (eraEvents.length === 0) return null;
          return (
            <div key={era} className="mb-6">
              {/* Era heading */}
              <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white/90 py-1 z-10">
                <span className={`w-2.5 h-2.5 rounded-full ${ERA_DOT[era]}`} />
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  {era}
                </p>
              </div>
              {eraEvents.map((event) => (
                <EventCard key={event.id} event={event} onNavigate={onNavigate} />
              ))}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            No events match your search.
          </p>
        )}
      </div>
    </div>
  );
}
