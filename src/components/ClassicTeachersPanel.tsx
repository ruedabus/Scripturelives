"use client";

import { useState, useEffect, useCallback } from "react";
import { CLASSIC_TEACHERS, type ClassicTeacher } from "@/app/api/classic-commentary/route";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

export default function ClassicTeachersPanel({
  passage,
  lang = "en",
}: {
  passage?: string;   // e.g. "John 3:16"
  lang?: "en" | "es";
}) {
  const [selectedTeacher, setSelectedTeacher] = useState<ClassicTeacher>(CLASSIC_TEACHERS[0]);
  const [commentary, setCommentary]           = useState("");
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");
  const [copied, setCopied]                   = useState(false);
  const [customPassage, setCustomPassage]     = useState("");
  const [activePassage, setActivePassage]     = useState(passage ?? "");

  // Auto-load when passage or teacher changes
  const load = useCallback(async (p: string, teacher: ClassicTeacher) => {
    if (!p.trim()) return;
    setLoading(true);
    setError("");
    setCommentary("");
    try {
      const res  = await fetch("/api/classic-commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passage: p, teacher: teacher.id, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to load commentary.");
      setCommentary(data.commentary ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load commentary.");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  // Re-fetch when the incoming passage prop changes
  useEffect(() => {
    if (passage && passage !== activePassage) {
      setActivePassage(passage);
      setCommentary("");
    }
  }, [passage]);

  const T = {
    title:       lang === "es" ? "Maestros Clásicos" : "Classic Teachers",
    subtitle:    lang === "es" ? "Comentarios del dominio público de grandes maestros de la fe" : "Public-domain commentary from history's great Bible teachers",
    loadBtn:     lang === "es" ? "Cargar comentario" : "Load commentary",
    loading:     lang === "es" ? "Cargando…" : "Loading…",
    noPassage:   lang === "es" ? "Busca un versículo en el Lector para generar comentario, o escribe uno abajo." : "Select a verse in the Reader tab, or type one below.",
    customLabel: lang === "es" ? "Ir a un pasaje:" : "Or look up a passage:",
    placeholder: lang === "es" ? "ej. Juan 3:16" : "e.g. John 3:16",
    goBtn:       lang === "es" ? "Ir" : "Go",
    sourceLabel: lang === "es" ? "Fuente original:" : "Primary source:",
    aiNote:      lang === "es" ? "Generado por IA a partir de los escritos del dominio público de este autor." : "AI-interpreted from this teacher's public-domain writings.",
    copy:        lang === "es" ? "Copiar" : "Copy",
    copied:      lang === "es" ? "¡Copiado!" : "Copied!",
  };

  const displayPassage = activePassage || passage || "";

  return (
    <div className="flex flex-col gap-0">

      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-base">📜</span>
          <h2 className="text-base font-semibold text-gray-800">{T.title}</h2>
        </div>
        <p className="text-[11px] text-gray-400">{T.subtitle}</p>
      </div>

      {/* Teacher selector */}
      <div className="px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex flex-wrap gap-2">
          {CLASSIC_TEACHERS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setSelectedTeacher(t);
                setCommentary("");
                if (displayPassage) load(displayPassage, t);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                selectedTeacher.id === t.id
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
              style={selectedTeacher.id === t.id ? { background: t.color, borderColor: t.color } : {}}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Teacher info */}
        <div className="mt-3 rounded-xl px-3 py-2.5 border" style={{ borderColor: selectedTeacher.color + "40", background: selectedTeacher.color + "08" }}>
          <p className="text-xs font-semibold" style={{ color: selectedTeacher.color }}>{selectedTeacher.name} · {selectedTeacher.years}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">{selectedTeacher.tradition}</p>
        </div>
      </div>

      {/* Passage + Load button */}
      <div className="px-4 py-3 border-b border-gray-100 shrink-0 space-y-2">
        {displayPassage ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: NAVY }}>📖</span>
              <span className="text-sm font-semibold text-gray-800">{displayPassage}</span>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={() => load(displayPassage, selectedTeacher)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-50"
              style={{ background: selectedTeacher.color }}
            >
              {loading ? T.loading : T.loadBtn}
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">{T.noPassage}</p>
        )}

        {/* Custom passage input */}
        <div>
          <p className="text-[11px] text-gray-500 mb-1.5">{T.customLabel}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPassage}
              onChange={(e) => setCustomPassage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && customPassage.trim()) {
                  setActivePassage(customPassage.trim());
                  load(customPassage.trim(), selectedTeacher);
                }
              }}
              placeholder={T.placeholder}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="button"
              disabled={!customPassage.trim() || loading}
              onClick={() => {
                if (!customPassage.trim()) return;
                setActivePassage(customPassage.trim());
                load(customPassage.trim(), selectedTeacher);
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50 transition"
              style={{ background: NAVY }}
            >
              {T.goBtn}
            </button>
          </div>
        </div>
      </div>

      {/* Commentary output */}
      <div className="px-4 py-4 flex-1">
        {loading && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: selectedTeacher.color + "40", borderTopColor: "transparent" }} />
            <p className="text-sm text-gray-400">{T.loading}</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && !commentary && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
            <p className="text-2xl mb-2">📜</p>
            <p className="text-sm text-gray-500">{T.noPassage}</p>
          </div>
        )}

        {!loading && commentary && (
          <div className="space-y-4">
            {/* Quote block */}
            <div
              className="rounded-2xl px-5 py-4 border"
              style={{ background: selectedTeacher.color + "06", borderColor: selectedTeacher.color + "30" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-serif" style={{ color: selectedTeacher.color }}>"</span>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: selectedTeacher.color }}>
                  {selectedTeacher.name} on {activePassage || displayPassage}
                </p>
              </div>
              <p className="text-sm text-gray-700 leading-7 font-serif italic">
                {commentary}
              </p>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`${selectedTeacher.name} on ${activePassage || displayPassage}:\n\n${commentary}\n\n— From ${selectedTeacher.source}`).then(() => {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                });
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:border-amber-400 hover:text-amber-700 transition"
            >
              {copied ? `✓ ${T.copied}` : `📋 ${T.copy}`}
            </button>

            {/* Source attribution */}
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{T.sourceLabel}</p>
              <a
                href={selectedTeacher.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold underline"
                style={{ color: selectedTeacher.color }}
              >
                {selectedTeacher.source} ↗
              </a>
              <p className="text-[10px] text-gray-400 italic mt-1">{T.aiNote}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
