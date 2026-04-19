"use client";

import React, { useState } from "react";
import { FileText, ChevronDown, ChevronRight, Loader2, Copy, Check, Download, RefreshCw, Plus, Trash2, Pencil } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface OutlinePoint {
  id: string;
  text: string;
  subPoints: string[];
  verse?: string;
}

interface Outline {
  title: string;
  theme: string;
  intro: string;
  points: OutlinePoint[];
  conclusion: string;
  callToAction: string;
  passage: string;
  generatedAt: number;
}

// ── Storage ───────────────────────────────────────────────────────────────────
const STORAGE_KEY = "scripture-lives-outlines";

function loadOutlines(): Outline[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveOutlines(outlines: Outline[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(outlines));
}

// ── Sample outlines for first-time experience ─────────────────────────────────
const SEED_OUTLINE: Outline = {
  title: "The God Who Restores",
  theme: "Redemption and renewal through God's grace",
  intro: "We all know what it's like to feel broken, lost, or far from God. Yet Scripture tells us again and again: our God is a God of restoration. Today we explore what it means to be found by the Father.",
  points: [
    {
      id: "p1",
      text: "God Sees Us in Our Brokenness",
      verse: "Luke 15:20",
      subPoints: [
        "The father saw the son 'while he was still a long way off'",
        "God doesn't wait for us to clean up — He runs toward us",
        "Application: You don't have to have it all together to come to God",
      ],
    },
    {
      id: "p2",
      text: "Restoration Begins with Repentance",
      verse: "Luke 15:18",
      subPoints: [
        "The son 'came to himself' — moment of honest self-reflection",
        "True repentance is both a turning away and a turning toward",
        "Application: Confession is not a burden — it's the door to freedom",
      ],
    },
    {
      id: "p3",
      text: "Grace Goes Beyond What We Deserve",
      verse: "Luke 15:22-23",
      subPoints: [
        "The father gives a robe, ring, and feast — signs of full restoration",
        "We are not just forgiven; we are fully welcomed back",
        "Application: Walk in the identity God has given you, not in your past",
      ],
    },
  ],
  conclusion: "The story of the prodigal son is ultimately the story of each of us. We have all wandered. We have all needed to be found. And God, our Father, is always watching, always ready to run, always eager to restore.",
  callToAction: "If you've been carrying the weight of regret or shame, today is the day to come home. The Father is watching the road.",
  passage: "Luke 15:11-32",
  generatedAt: Date.now() - 86400000,
};

// ── Unique ID ─────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function OutlineBuilder() {
  const [outlines, setOutlines] = useState<Outline[]>(() => {
    const saved = loadOutlines();
    return saved.length > 0 ? saved : [SEED_OUTLINE];
  });

  const [selectedId, setSelectedId] = useState<string | null>(outlines[0]?.title ?? null);
  const [view, setView] = useState<"list" | "detail" | "generate">("list");

  // Generation form state
  const [passage, setPassage] = useState("");
  const [sermonType, setSermonType] = useState("expository");
  const [audience, setAudience] = useState("general");
  const [numPoints, setNumPoints] = useState("3");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Edit state
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingIntro, setEditingIntro] = useState(false);
  const [editingConclusion, setEditingConclusion] = useState(false);

  // Copy state
  const [copied, setCopied] = useState(false);

  const selectedOutline = outlines.find((o) => o.title === selectedId) ?? null;

  function persist(updated: Outline[]) {
    setOutlines(updated);
    saveOutlines(updated);
  }

  // ── Generate outline ──────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!passage.trim()) return;
    setGenerating(true);
    setGenError("");

    const prompt = `You are a sermon preparation assistant. Create a detailed ${sermonType} sermon/study outline for ${audience} audiences based on the passage: "${passage}".

Return a JSON object with these exact fields:
{
  "title": "A compelling sermon title",
  "theme": "One sentence theme statement",
  "intro": "2-3 sentence introduction paragraph",
  "points": [
    {
      "id": "p1",
      "text": "Main point title",
      "verse": "Key supporting verse reference",
      "subPoints": ["Sub-point or application 1", "Sub-point or application 2", "Sub-point or application 3"]
    }
  ],
  "conclusion": "2-3 sentence conclusion paragraph",
  "callToAction": "One specific call to action sentence"
}

Generate exactly ${numPoints} main points. Make it practical, biblically grounded, and spiritually rich.`;

    try {
      const res = await fetch("/api/study-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      const raw = data.content ?? data.message ?? "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");
      const parsed = JSON.parse(jsonMatch[0]) as Omit<Outline, "passage" | "generatedAt">;

      const newOutline: Outline = {
        ...parsed,
        points: parsed.points.map((p, i) => ({ ...p, id: `p${uid()}_${i}` })),
        passage,
        generatedAt: Date.now(),
      };

      const updated = [newOutline, ...outlines];
      persist(updated);
      setSelectedId(newOutline.title);
      setView("detail");
    } catch (err) {
      console.error(err);
      setGenError("Couldn't generate outline. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  // ── Copy as text ──────────────────────────────────────────────────────────
  function copyOutline(o: Outline) {
    const text = [
      `SERMON OUTLINE — ${o.passage}`,
      `Title: ${o.title}`,
      `Theme: ${o.theme}`,
      "",
      "INTRODUCTION",
      o.intro,
      "",
      ...o.points.flatMap((p, i) => [
        `${i + 1}. ${p.text}${p.verse ? ` (${p.verse})` : ""}`,
        ...p.subPoints.map((sp) => `   • ${sp}`),
        "",
      ]),
      "CONCLUSION",
      o.conclusion,
      "",
      "CALL TO ACTION",
      o.callToAction,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Delete outline ────────────────────────────────────────────────────────
  function deleteOutline(title: string) {
    const updated = outlines.filter((o) => o.title !== title);
    persist(updated);
    setSelectedId(updated[0]?.title ?? null);
    if (view === "detail") setView("list");
  }

  // ── Update field ──────────────────────────────────────────────────────────
  function updateOutline(title: string, patch: Partial<Outline>) {
    const updated = outlines.map((o) => (o.title === title ? { ...o, ...patch } : o));
    persist(updated);
  }

  // ── Render: Generate form ─────────────────────────────────────────────────
  if (view === "generate") {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <button type="button" onClick={() => setView("list")} className="text-xs text-gray-400 hover:text-amber-600 transition">← Back</button>
          <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><FileText size={18} /> New Outline</h2>
        </div>

        <div className="space-y-4">
          {/* Passage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bible Passage *</label>
            <input
              type="text"
              value={passage}
              onChange={(e) => setPassage(e.target.value)}
              placeholder="e.g. John 3:1-21, Romans 8, Psalm 23"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sermon Type</label>
            <select
              value={sermonType}
              onChange={(e) => setSermonType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="expository">Expository (verse-by-verse)</option>
              <option value="topical">Topical (theme-based)</option>
              <option value="narrative">Narrative (story-driven)</option>
              <option value="evangelistic">Evangelistic (outreach focused)</option>
              <option value="devotional">Devotional (personal reflection)</option>
              <option value="teaching">Bible Study / Teaching</option>
            </select>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Audience</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
            >
              <option value="general">General congregation</option>
              <option value="youth">Youth group</option>
              <option value="children">Children</option>
              <option value="men">Men's group</option>
              <option value="women">Women's group</option>
              <option value="new believers">New believers</option>
              <option value="seekers">Seekers / unchurched</option>
            </select>
          </div>

          {/* Points */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Main Points</label>
            <div className="flex gap-2">
              {["2", "3", "4", "5"].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNumPoints(n)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition ${
                    numPoints === n
                      ? "bg-amber-500 border-amber-500 text-stone-900"
                      : "border-gray-300 text-gray-600 hover:border-amber-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {genError && <p className="text-sm text-red-500 rounded-xl border border-red-200 bg-red-50 px-4 py-3">{genError}</p>}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !passage.trim()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-stone-900 transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? <><Loader2 size={16} className="animate-spin" />Generating outline…</> : <><FileText size={16} />Generate Outline</>}
          </button>

          <p className="text-center text-xs text-gray-400">Powered by AI — review and edit before use in ministry</p>
        </div>
      </div>
    );
  }

  // ── Render: Outline detail ────────────────────────────────────────────────
  if (view === "detail" && selectedOutline) {
    const o = selectedOutline;
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <button type="button" onClick={() => setView("list")} className="text-xs text-gray-400 hover:text-amber-600 transition">← All Outlines</button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyOutline(o)}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:border-amber-400 hover:text-amber-600 transition"
            >
              {copied ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy</>}
            </button>
            <button
              type="button"
              onClick={() => deleteOutline(o.title)}
              className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-400 hover:border-red-300 hover:text-red-600 transition"
            >
              <Trash2 size={12} />Delete
            </button>
          </div>
        </div>

        {/* Passage badge */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{o.passage}</span>
          <span className="text-xs text-gray-400">{new Date(o.generatedAt).toLocaleDateString()}</span>
        </div>

        {/* Title */}
        {editingTitle ? (
          <input
            autoFocus
            type="text"
            defaultValue={o.title}
            onBlur={(e) => {
              updateOutline(o.title, { title: e.target.value });
              setSelectedId(e.target.value);
              setEditingTitle(false);
            }}
            className="w-full text-xl font-bold text-stone-900 border-b-2 border-amber-400 focus:outline-none pb-1"
          />
        ) : (
          <h2
            className="text-xl font-bold text-stone-900 cursor-pointer group flex items-center gap-2"
            onClick={() => setEditingTitle(true)}
          >
            {o.title}
            <Pencil size={14} className="text-gray-300 group-hover:text-amber-500 transition shrink-0" />
          </h2>
        )}

        {/* Theme */}
        <p className="text-sm italic text-amber-700 border-l-4 border-amber-300 pl-3">{o.theme}</p>

        {/* Introduction */}
        <div className="rounded-xl bg-stone-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Introduction</h3>
            <button type="button" onClick={() => setEditingIntro((v) => !v)} className="text-gray-300 hover:text-amber-500 transition"><Pencil size={13} /></button>
          </div>
          {editingIntro ? (
            <textarea
              autoFocus
              defaultValue={o.intro}
              onBlur={(e) => { updateOutline(o.title, { intro: e.target.value }); setEditingIntro(false); }}
              className="w-full text-sm text-gray-700 border border-amber-300 rounded-lg p-2 focus:outline-none min-h-[80px]"
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{o.intro}</p>
          )}
        </div>

        {/* Main Points */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Main Points</h3>
          {o.points.map((point, idx) => (
            <PointCard
              key={point.id}
              point={point}
              index={idx}
              onUpdate={(patch) => {
                const updatedPoints = o.points.map((p) => p.id === point.id ? { ...p, ...patch } : p);
                updateOutline(o.title, { points: updatedPoints });
              }}
              onDelete={() => {
                const updatedPoints = o.points.filter((p) => p.id !== point.id);
                updateOutline(o.title, { points: updatedPoints });
              }}
            />
          ))}

          {/* Add point */}
          <button
            type="button"
            onClick={() => {
              const newPoint: OutlinePoint = { id: uid(), text: "New Point", subPoints: ["Add sub-point here"] };
              updateOutline(o.title, { points: [...o.points, newPoint] });
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 hover:border-amber-300 hover:text-amber-600 transition"
          >
            <Plus size={14} /> Add Point
          </button>
        </div>

        {/* Conclusion */}
        <div className="rounded-xl bg-stone-50 border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Conclusion</h3>
            <button type="button" onClick={() => setEditingConclusion((v) => !v)} className="text-gray-300 hover:text-amber-500 transition"><Pencil size={13} /></button>
          </div>
          {editingConclusion ? (
            <textarea
              autoFocus
              defaultValue={o.conclusion}
              onBlur={(e) => { updateOutline(o.title, { conclusion: e.target.value }); setEditingConclusion(false); }}
              className="w-full text-sm text-gray-700 border border-amber-300 rounded-lg p-2 focus:outline-none min-h-[80px]"
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{o.conclusion}</p>
          )}
        </div>

        {/* Call to Action */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Call to Action</h3>
          <p className="text-sm font-medium text-amber-800">{o.callToAction}</p>
        </div>
      </div>
    );
  }

  // ── Render: List view ─────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-amber-700 flex items-center gap-2"><FileText size={18} /> Sermon Outlines</h2>
          <p className="text-xs text-gray-400 mt-0.5">AI-generated, fully editable sermon &amp; study outlines</p>
        </div>
        <button
          type="button"
          onClick={() => setView("generate")}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition"
        >
          <Plus size={14} /> New
        </button>
      </div>

      {outlines.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No outlines yet. Generate your first one!</p>
          <button type="button" onClick={() => setView("generate")} className="mt-4 rounded-xl bg-amber-500 px-6 py-2 text-sm font-semibold text-stone-900 hover:bg-amber-400 transition">
            Generate Outline
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {outlines.map((o) => (
            <button
              key={o.title}
              type="button"
              onClick={() => { setSelectedId(o.title); setView("detail"); }}
              className="w-full text-left rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-amber-300 hover:bg-amber-50 transition group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-amber-700 truncate">{o.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{o.passage} · {o.points.length} points · {new Date(o.generatedAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">{o.theme}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-amber-500 shrink-0 mt-1 transition" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Point Card ────────────────────────────────────────────────────────────────
function PointCard({
  point, index, onUpdate, onDelete,
}: {
  point: OutlinePoint;
  index: number;
  onUpdate: (patch: Partial<OutlinePoint>) => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editingText, setEditingText] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Point header */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-amber-500 text-stone-900 text-xs font-bold flex items-center justify-center">
          {index + 1}
        </span>

        {editingText ? (
          <input
            autoFocus
            type="text"
            defaultValue={point.text}
            onBlur={(e) => { onUpdate({ text: e.target.value }); setEditingText(false); }}
            className="flex-1 text-sm font-semibold text-gray-800 border-b border-amber-400 focus:outline-none"
          />
        ) : (
          <span
            className="flex-1 text-sm font-semibold text-gray-800 cursor-pointer hover:text-amber-700 transition"
            onClick={() => setEditingText(true)}
          >
            {point.text}
          </span>
        )}

        {point.verse && (
          <span className="text-xs text-amber-600 font-medium shrink-0">{point.verse}</span>
        )}

        <button type="button" onClick={() => setExpanded((v) => !v)} className="text-gray-300 hover:text-gray-500 transition shrink-0">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <button type="button" onClick={onDelete} className="text-gray-200 hover:text-red-400 transition shrink-0">
          <Trash2 size={13} />
        </button>
      </div>

      {/* Sub-points */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-3 space-y-1.5 bg-gray-50">
          {point.subPoints.map((sp, i) => (
            <div key={i} className="flex items-start gap-2 group">
              <span className="text-amber-400 text-xs mt-0.5 shrink-0">•</span>
              <input
                type="text"
                defaultValue={sp}
                onBlur={(e) => {
                  const updated = [...point.subPoints];
                  updated[i] = e.target.value;
                  onUpdate({ subPoints: updated });
                }}
                className="flex-1 text-xs text-gray-600 bg-transparent border-b border-transparent focus:border-amber-300 focus:outline-none py-0.5"
              />
              <button
                type="button"
                onClick={() => {
                  const updated = point.subPoints.filter((_, idx) => idx !== i);
                  onUpdate({ subPoints: updated });
                }}
                className="text-gray-200 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onUpdate({ subPoints: [...point.subPoints, "New sub-point"] })}
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-amber-500 transition mt-1"
          >
            <Plus size={11} /> Add sub-point
          </button>
        </div>
      )}
    </div>
  );
}
