"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Printer, ChevronDown, ChevronUp, X } from "lucide-react";

const GOLD = "#C9952A";
const NAVY = "#1a2640";
const STORAGE_KEY = "scripture-lives-study-notes";

type StudyNote = {
  id:           string;
  date:         string;
  sermonTitle:  string;
  speaker:      string;
  verses:       string;
  notes:        string;
  createdAt:    number;
};

const emptyNote = (): Omit<StudyNote, "id" | "createdAt"> => ({
  date:        new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
  sermonTitle: "",
  speaker:     "",
  verses:      "",
  notes:       "",
});

function Field({
  label, value, onChange, type = "text", placeholder, rows,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: "text" | "textarea"; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows ?? 6}
          className="w-full rounded-xl px-4 py-3 text-sm resize-y focus:outline-none focus:ring-2 leading-relaxed"
          style={{
            border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY,
            minHeight: "120px", focusRingColor: GOLD,
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"
          style={{ border: "1px solid #ddd6c8", background: "#faf8f3", color: NAVY }}
        />
      )}
    </div>
  );
}

export default function StudyNotes() {
  const [notes,      setNotes]      = useState<StudyNote[]>([]);
  const [mode,       setMode]       = useState<"list" | "new" | "edit">("list");
  const [editId,     setEditId]     = useState<string | null>(null);
  const [form,       setForm]       = useState(emptyNote());
  const [expanded,   setExpanded]   = useState<string | null>(null);
  const [printNote,  setPrintNote]  = useState<StudyNote | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setNotes(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((updated: StudyNote[]) => {
    setNotes(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }, []);

  const openNew = () => {
    setForm(emptyNote());
    setEditId(null);
    setMode("new");
  };

  const openEdit = (note: StudyNote) => {
    setForm({
      date: note.date, sermonTitle: note.sermonTitle,
      speaker: note.speaker, verses: note.verses, notes: note.notes,
    });
    setEditId(note.id);
    setMode("edit");
  };

  const save = () => {
    if (!form.sermonTitle.trim() && !form.notes.trim()) return;
    if (mode === "edit" && editId) {
      persist(notes.map((n) => n.id === editId ? { ...n, ...form } : n));
    } else {
      const newNote: StudyNote = { id: crypto.randomUUID(), createdAt: Date.now(), ...form };
      persist([newNote, ...notes]);
    }
    setMode("list");
    setEditId(null);
  };

  const deleteNote = (id: string) => {
    if (!confirm("Delete this study note?")) return;
    persist(notes.filter((n) => n.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const handlePrint = (note: StudyNote) => {
    setPrintNote(note);
    setTimeout(() => { window.print(); setPrintNote(null); }, 100);
  };

  const f = (key: keyof typeof form) => (v: string) => setForm((prev) => ({ ...prev, [key]: v }));

  // ── Print view (hidden except during print) ───────────────────────────────
  if (printNote) {
    return (
      <div className="print:block hidden p-8">
        <div className="mb-6 pb-4" style={{ borderBottom: "2px solid #C9952A" }}>
          <h1 className="text-3xl font-black" style={{ color: NAVY }}>Scripture Lives — Study Notes</h1>
          <p className="text-sm text-gray-500 mt-1">scripturelives.com</p>
        </div>
        <div className="space-y-3 mb-6">
          <div><span className="text-xs font-black uppercase tracking-widest text-gray-400">Date</span><p className="text-lg font-semibold mt-0.5" style={{ color: NAVY }}>{printNote.date}</p></div>
          <div><span className="text-xs font-black uppercase tracking-widest text-gray-400">Sermon Title</span><p className="text-xl font-black mt-0.5" style={{ color: NAVY }}>{printNote.sermonTitle || "—"}</p></div>
          {printNote.speaker && <div><span className="text-xs font-black uppercase tracking-widest text-gray-400">Speaker</span><p className="mt-0.5" style={{ color: NAVY }}>{printNote.speaker}</p></div>}
          {printNote.verses && <div><span className="text-xs font-black uppercase tracking-widest text-gray-400">Verses Used</span><p className="mt-0.5 italic" style={{ color: NAVY }}>{printNote.verses}</p></div>}
        </div>
        <div><span className="text-xs font-black uppercase tracking-widest text-gray-400">Notes</span>
          <p className="mt-2 leading-relaxed whitespace-pre-wrap" style={{ color: NAVY }}>{printNote.notes}</p>
        </div>
      </div>
    );
  }

  // ── Form view (new / edit) ─────────────────────────────────────────────────
  if (mode === "new" || mode === "edit") {
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: GOLD }}>
              {mode === "new" ? "New" : "Edit"}
            </p>
            <h2 className="text-xl font-black" style={{ color: NAVY }}>Study Notes</h2>
          </div>
          <button onClick={() => setMode("list")}
            className="p-1.5 rounded-lg transition hover:bg-gray-100" style={{ color: "#9ca3af" }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <Field label="Date" value={form.date} onChange={f("date")} placeholder="May 6, 2026" />
          <Field label="Sermon Title" value={form.sermonTitle} onChange={f("sermonTitle")} placeholder="e.g. Walking by Faith" />
          <Field label="Speaker / Pastor" value={form.speaker} onChange={f("speaker")} placeholder="e.g. Pastor John" />
          <Field label="Verses Used" value={form.verses} onChange={f("verses")} placeholder="e.g. Romans 8:28, John 3:16, Psalm 23" />
          <Field label="Notes" value={form.notes} onChange={f("notes")}
            type="textarea" rows={10}
            placeholder={"Key points from the sermon...\n\nWhat stood out to me...\n\nHow I can apply this..."}
          />

          <div className="flex gap-3 pt-2">
            <button onClick={save}
              className="flex-1 py-3 rounded-xl font-black text-sm text-white transition hover:brightness-110"
              style={{ background: GOLD }}>
              {mode === "new" ? "Save Note" : "Update Note"}
            </button>
            <button onClick={() => setMode("list")}
              className="px-5 py-3 rounded-xl font-semibold text-sm transition hover:opacity-70"
              style={{ background: "#faf8f3", border: "1px solid #ede8de", color: "#6b7280" }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: GOLD }}>Scripture Lives</p>
          <h2 className="text-xl font-black" style={{ color: NAVY }}>Study Notes</h2>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-black text-white transition hover:brightness-110"
          style={{ background: GOLD }}>
          <Plus size={15} /> New Note
        </button>
      </div>

      {/* Empty state */}
      {notes.length === 0 && (
        <div className="rounded-2xl py-14 text-center" style={{ border: "1px dashed #ddd6c8" }}>
          <div className="text-4xl mb-3">📝</div>
          <p className="font-bold mb-1" style={{ color: NAVY }}>No study notes yet</p>
          <p className="text-sm mb-5" style={{ color: "#9ca3af" }}>
            Capture your sermon notes, key verses, and reflections
          </p>
          <button onClick={openNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition hover:brightness-110"
            style={{ background: GOLD }}>
            <Plus size={15} /> Add your first note
          </button>
        </div>
      )}

      {/* Note cards */}
      {notes.length > 0 && (
        <div className="space-y-3">
          {notes.map((note) => {
            const open = expanded === note.id;
            return (
              <div key={note.id} className="rounded-2xl bg-white overflow-hidden"
                style={{ border: "1px solid #ede8de", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>

                {/* Card header — always visible */}
                <button
                  onClick={() => setExpanded(open ? null : note.id)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: GOLD }}>
                      {note.date}
                    </p>
                    <p className="font-black text-sm mt-0.5 truncate" style={{ color: NAVY }}>
                      {note.sermonTitle || "Untitled Note"}
                    </p>
                    {note.speaker && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>{note.speaker}</p>
                    )}
                  </div>
                  <div className="shrink-0 mt-0.5" style={{ color: "#9ca3af" }}>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {/* Expanded body */}
                {open && (
                  <div className="px-5 pb-5" style={{ borderTop: "1px solid #f0ece3" }}>

                    {note.verses && (
                      <div className="mt-4">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: GOLD }}>Verses Used</p>
                        <p className="text-sm italic" style={{ color: "#6b7280" }}>{note.verses}</p>
                      </div>
                    )}

                    {note.notes && (
                      <div className="mt-4">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: GOLD }}>Notes</p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: NAVY }}>
                          {note.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-5 pt-4" style={{ borderTop: "1px solid #f0ece3" }}>
                      <button onClick={() => openEdit(note)}
                        className="flex-1 py-2 rounded-xl text-xs font-black transition hover:brightness-105"
                        style={{ background: "rgba(201,149,42,0.10)", color: GOLD }}>
                        Edit
                      </button>
                      <button onClick={() => handlePrint(note)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition hover:opacity-70"
                        style={{ background: "#faf8f3", border: "1px solid #ede8de", color: "#6b7280" }}>
                        <Printer size={13} /> Print
                      </button>
                      <button onClick={() => deleteNote(note.id)}
                        className="p-2 rounded-xl transition hover:bg-red-50"
                        style={{ color: "#fca5a5" }} title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Print all hint */}
      {notes.length > 0 && (
        <p className="text-center text-xs mt-5" style={{ color: "#9ca3af" }}>
          Notes are saved in your browser. Use Print on individual notes to save as PDF.
        </p>
      )}
    </div>
  );
}
