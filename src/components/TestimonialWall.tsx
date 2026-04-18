"use client";

import React, { useState, useEffect } from "react";
import { Heart, Plus, X, Star, ChevronRight, MessageSquare } from "lucide-react";

const STORAGE_KEY = "scripture-lives-testimonials";

type Testimonial = {
  id: string;
  name: string;
  location?: string;
  role?: string;
  text: string;
  feature?: string;
  rating: number;
  createdAt: string;
  approved: boolean;
};

const FEATURES = [
  "Parallel Bible",
  "Ancient World Map",
  "Study Prompts",
  "Full Bible Reader",
  "Topical Bible",
  "Prayer Journal",
  "Timeline",
  "Commentary",
  "Dictionary / Lexicon",
  "Passage Presenter",
  "General",
];

// Seed testimonials to show on first visit
const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: "seed-1",
    name: "Pastor James R.",
    location: "Texas",
    role: "Senior Pastor",
    text: "Scripture Lives has completely transformed how I prep my sermons. The ancient world maps and study prompts save me hours every week. I recommend it to every leader in my congregation.",
    feature: "Ancient World Map",
    rating: 5,
    createdAt: "2025-12-01T10:00:00Z",
    approved: true,
  },
  {
    id: "seed-2",
    name: "Maria L.",
    location: "Florida",
    role: "Small Group Leader",
    text: "I lead a women's Bible study and this site has everything we need in one place. The parallel Bible view is incredible for comparing translations during our discussions.",
    feature: "Parallel Bible",
    rating: 5,
    createdAt: "2025-12-10T14:30:00Z",
    approved: true,
  },
  {
    id: "seed-3",
    name: "David K.",
    location: "Georgia",
    role: "New Believer",
    text: "I just started my faith journey and Scripture Lives made the Bible feel so much more accessible. The topical Bible helped me find verses when I was going through a really hard time.",
    feature: "Topical Bible",
    rating: 5,
    createdAt: "2026-01-05T09:00:00Z",
    approved: true,
  },
  {
    id: "seed-4",
    name: "Rev. Cynthia M.",
    location: "Ohio",
    role: "Bible Teacher",
    text: "The study prompts are brilliant. They rotate through different angles on each passage — historical, theological, personal — and my Sunday school class loves the discussions they spark.",
    feature: "Study Prompts",
    rating: 5,
    createdAt: "2026-01-20T11:00:00Z",
    approved: true,
  },
  {
    id: "seed-5",
    name: "Thomas B.",
    location: "California",
    role: "Daily Reader",
    text: "I use the Full Bible Reader every morning for my devotions. Having NIV, KJV, and Amplified Bible all in one place — completely free — is something I never thought I'd find.",
    feature: "Full Bible Reader",
    rating: 5,
    createdAt: "2026-02-01T08:00:00Z",
    approved: true,
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function StarRating({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`transition ${onChange ? "cursor-pointer" : "cursor-default"}`}
          disabled={!onChange}
        >
          <Star
            size={16}
            className={
              n <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-200"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function TestimonialWall() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formText, setFormText] = useState("");
  const [formFeature, setFormFeature] = useState("General");
  const [formRating, setFormRating] = useState(5);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setTestimonials(JSON.parse(raw));
      } else {
        setTestimonials(SEED_TESTIMONIALS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TESTIMONIALS));
      }
    } catch {
      setTestimonials(SEED_TESTIMONIALS);
    }
  }, []);

  const save = (updated: Testimonial[]) => {
    setTestimonials(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const submitTestimonial = () => {
    if (!formName.trim() || !formText.trim()) return;
    const entry: Testimonial = {
      id: Date.now().toString(),
      name: formName.trim(),
      location: formLocation.trim() || undefined,
      role: formRole.trim() || undefined,
      text: formText.trim(),
      feature: formFeature,
      rating: formRating,
      createdAt: new Date().toISOString(),
      approved: true, // Auto-approve for now; can add moderation later
    };
    save([entry, ...testimonials]);
    setFormName(""); setFormLocation(""); setFormRole("");
    setFormText(""); setFormFeature("General"); setFormRating(5);
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const approved = testimonials.filter((t) => t.approved);
  const avgRating = approved.length
    ? (approved.reduce((s, t) => s + t.rating, 0) / approved.length).toFixed(1)
    : "5.0";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-800">Testimonials</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} size={11} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-gray-500">{avgRating} · {approved.length} stories</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition"
          >
            <Plus size={13} /> Share Yours
          </button>
        </div>

        {submitted && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs text-green-700 font-medium flex items-center gap-2">
            <Heart size={12} className="fill-green-500 text-green-500" /> Thank you for sharing your story!
          </div>
        )}
      </div>

      {/* Submit form modal */}
      {showForm && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Share Your Story</h3>
                <p className="text-xs text-gray-400 mt-0.5">How has Scripture Lives helped your faith journey?</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
                  <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)}
                    placeholder="First name or initials"
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
                  <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Role / Title</label>
                <input type="text" value={formRole} onChange={(e) => setFormRole(e.target.value)}
                  placeholder="e.g. Pastor, Small Group Leader, Student…"
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Your Testimonial *</label>
                <textarea value={formText} onChange={(e) => setFormText(e.target.value)}
                  placeholder="Share how Scripture Lives has impacted your Bible study, ministry, or faith…"
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-amber-400 resize-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Favourite Feature</label>
                <select value={formFeature} onChange={(e) => setFormFeature(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400">
                  {FEATURES.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rating</label>
                <StarRating value={formRating} onChange={setFormRating} />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 rounded-lg border border-gray-200 py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button type="button" onClick={submitTestimonial}
                disabled={!formName.trim() || !formText.trim()}
                className="flex-1 rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-40 transition">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial cards */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {approved.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <MessageSquare size={28} className="text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">No testimonials yet — be the first!</p>
            <button type="button" onClick={() => setShowForm(true)}
              className="mt-3 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition">
              Share Your Story
            </button>
          </div>
        ) : (
          approved.map((t) => (
            <div key={t.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 hover:border-amber-200 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">
                    {[t.role, t.location].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <StarRating value={t.rating} />
                  <p className="text-[10px] text-gray-300 mt-0.5">{formatDate(t.createdAt)}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">"{t.text}"</p>

              {t.feature && t.feature !== "General" && (
                <span className="inline-block rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                  {t.feature}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
