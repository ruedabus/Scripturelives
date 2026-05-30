"use client";

import { useEffect, useState } from "react";
import { X, Bell, BellOff, Check, Smartphone, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import {
  scheduleReminder,
  disableReminder,
  getReminderSettings,
  sendTestNotification,
} from "@/lib/reminderService";

const GOLD = "#C9952A";
const NAVY = "#1a2640";

const QUICK_TIMES = [
  { label: "6:00 AM",  value: "06:00" },
  { label: "7:00 AM",  value: "07:00" },
  { label: "8:00 AM",  value: "08:00" },
  { label: "9:00 AM",  value: "09:00" },
  { label: "12:00 PM", value: "12:00" },
  { label: "6:00 PM",  value: "18:00" },
  { label: "8:00 PM",  value: "20:00" },
  { label: "9:00 PM",  value: "21:00" },
];

// Detect browser for platform-specific instructions
function detectBrowser(): "chrome" | "firefox" | "safari" | "edge" | "other" {
  if (typeof window === "undefined") return "other";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("edg/"))     return "edge";
  if (ua.includes("chrome"))   return "chrome";
  if (ua.includes("firefox"))  return "firefox";
  if (ua.includes("safari"))   return "safari";
  return "other";
}

const UNBLOCK_STEPS: Record<string, { title: string; steps: string[] }> = {
  chrome: {
    title: "Re-enable in Chrome",
    steps: [
      "Click the 🔒 lock icon in the address bar",
      'Select "Notifications" → change to "Allow"',
      "Refresh this page and try again",
    ],
  },
  edge: {
    title: "Re-enable in Edge",
    steps: [
      "Click the 🔒 lock icon in the address bar",
      'Select "Notifications" → change to "Allow"',
      "Refresh this page and try again",
    ],
  },
  firefox: {
    title: "Re-enable in Firefox",
    steps: [
      "Click the 🔒 shield icon in the address bar",
      'Click "Connection Secure" → "More Information"',
      'Go to "Permissions" tab → find Notifications → uncheck "Block"',
      "Refresh this page and try again",
    ],
  },
  safari: {
    title: "Re-enable in Safari",
    steps: [
      'Go to Safari → Settings → Websites → "Notifications"',
      "Find scripturelives.com → set to Allow",
      "Refresh this page and try again",
    ],
  },
  other: {
    title: "Re-enable notifications",
    steps: [
      "Open your browser's site settings for scripturelives.com",
      'Find "Notifications" and set it to "Allow"',
      "Refresh this page and try again",
    ],
  },
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DailyReminderModal({ open, onClose }: Props) {
  const [mounted,     setMounted]     = useState(false);
  const [enabled,     setEnabled]     = useState(false);
  const [time,        setTime]        = useState("07:00");
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [testing,     setTesting]     = useState(false);
  const [permission,  setPermission]  = useState<NotificationPermission | "unknown">("unknown");
  const [supported,   setSupported]   = useState(true);

  // Load saved settings + check permission state on open
  useEffect(() => {
    if (!open) { setMounted(false); return; }
    setMounted(true);
    setSaved(false);

    const settings = getReminderSettings();
    setEnabled(settings.on);
    setTime(settings.time);

    const hasSupport = "Notification" in window && "serviceWorker" in navigator;
    setSupported(hasSupport);
    if (hasSupport) setPermission(Notification.permission);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  async function handleSave() {
    setSaving(true);
    const ok = await scheduleReminder(time);
    setSaving(false);
    // Re-check permission after the request
    if ("Notification" in window) setPermission(Notification.permission);
    if (ok) {
      setEnabled(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function handleDisable() {
    disableReminder();
    setEnabled(false);
    setSaved(false);
  }

  async function handleTest() {
    setTesting(true);
    await sendTestNotification();
    setTesting(false);
  }

  if (!open) return null;

  const isDenied = permission === "denied";
  const browser  = detectBrowser();
  const unblock  = UNBLOCK_STEPS[browser] ?? UNBLOCK_STEPS.other;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: mounted ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 left-1/2 -translate-x-1/2 w-full transition-all duration-300"
        style={{
          bottom: "env(safe-area-inset-bottom, 0px)",
          maxWidth: 440,
          transform: mounted
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(40px)",
          opacity: mounted ? 1 : 0,
        }}
      >
        <div
          className="mx-3 mb-3 rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: NAVY, border: `1px solid rgba(201,149,42,0.25)` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full w-9 h-9"
                style={{ background: `${GOLD}22` }}
              >
                <Bell size={16} style={{ color: GOLD }} />
              </div>
              <div>
                <p className="text-sm font-black text-white">Daily Reminder</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Spend time with Jesus every day
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 transition hover:bg-white/10"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">

            {!supported ? (
              <div className="rounded-xl px-4 py-3 mb-4 text-sm" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>
                Your browser doesn&apos;t support notifications. Try Chrome or Edge, or save this app to your home screen.
              </div>
            ) : isDenied ? (
              /* ── Permission was previously denied ── */
              <div>
                <div
                  className="rounded-xl px-4 py-4 mb-4 flex items-start gap-3"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" style={{ color: "#f87171" }} />
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: "#fca5a5" }}>
                      Notifications are blocked
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Your browser previously blocked notifications for this site. You&apos;ll need to re-enable them manually — it only takes a few seconds.
                    </p>
                  </div>
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: GOLD }}>
                  {unblock.title}
                </p>
                <ol className="space-y-2.5 mb-5">
                  {unblock.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                      <span
                        className="shrink-0 flex items-center justify-center rounded-full w-5 h-5 text-[10px] font-black mt-0.5"
                        style={{ background: `${GOLD}22`, color: GOLD }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>

                <a
                  href="https://support.google.com/chrome/answer/3220216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs transition hover:opacity-80"
                  style={{ color: GOLD }}
                >
                  <ExternalLink size={11} />
                  More help with browser notifications
                </a>
              </div>
            ) : (
              <>
                {/* Current status */}
                {enabled && (
                  <div
                    className="flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-xs font-semibold"
                    style={{ background: `${GOLD}18`, border: `1px solid ${GOLD}44`, color: GOLD }}
                  >
                    <Check size={13} />
                    Reminders active · {QUICK_TIMES.find(t => t.value === time)?.label ?? time}
                  </div>
                )}

                {/* Verse teaser */}
                <p
                  className="text-xs italic mb-5 leading-relaxed text-center px-2"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  &ldquo;But seek first the kingdom of God…&rdquo; — Matthew 6:33
                </p>

                {/* Quick time selector */}
                <p className="text-[10px] font-black uppercase tracking-widest mb-2.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Remind me at
                </p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {QUICK_TIMES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTime(t.value)}
                      className="py-2 rounded-xl text-xs font-semibold transition active:scale-95"
                      style={{
                        background: time === t.value ? GOLD : "rgba(255,255,255,0.07)",
                        color:      time === t.value ? NAVY : "rgba(255,255,255,0.7)",
                        border:     time === t.value ? "none" : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Custom time input */}
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>Custom time:</p>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold outline-none"
                    style={{ background: "rgba(255,255,255,0.08)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}
                  />
                </div>

                {/* Saved confirmation */}
                {saved && (
                  <div className="rounded-xl px-4 py-3 mb-4 text-xs font-semibold flex items-center gap-2" style={{ background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" }}>
                    <Check size={13} />
                    Reminder set! You&apos;ll hear from us daily at {QUICK_TIMES.find(t => t.value === time)?.label ?? time}.
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition active:scale-95 disabled:opacity-60"
                    style={{ background: GOLD, color: NAVY }}
                  >
                    <Bell size={15} />
                    {saving ? "Setting up…" : enabled ? "Update Reminder" : "Set Reminder"}
                  </button>

                  {enabled && (
                    <button
                      onClick={handleDisable}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition hover:bg-white/10"
                      style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <BellOff size={15} />
                      Off
                    </button>
                  )}
                </div>

                {/* Test notification */}
                {enabled && (
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="w-full mt-2 py-2 rounded-xl text-xs font-semibold transition hover:bg-white/10 disabled:opacity-50"
                    style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {testing ? "Sending…" : "Send a test notification now"}
                  </button>
                )}

                {/* PWA tip */}
                <div
                  className="mt-4 rounded-xl px-4 py-3 flex items-start gap-2.5 text-[11px] leading-relaxed"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
                >
                  <Smartphone size={13} className="shrink-0 mt-0.5" />
                  <span>
                    For reminders when your browser is closed, add Scripture Lives to your home screen
                    {" "}(tap the Share icon in Safari, or the ⋮ menu in Chrome, then &ldquo;Add to Home Screen&rdquo;).
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
