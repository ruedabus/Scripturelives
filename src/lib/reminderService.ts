/**
 * Reminder Service
 * ----------------
 * Registers the service worker and manages the daily devotional reminder timer.
 * Reminders are stored in localStorage and re-armed on each page load.
 *
 * Storage keys:
 *   scripture-lives-reminder-time   → "07:00" (HH:MM)
 *   scripture-lives-reminder-on     → "true" | "false"
 *   scripture-lives-reminder-fired  → ISO date string of last fire
 */

const STORAGE_TIME  = "scripture-lives-reminder-time";
const STORAGE_ON    = "scripture-lives-reminder-on";
const STORAGE_FIRED = "scripture-lives-reminder-fired";

let timerHandle: ReturnType<typeof setTimeout> | null = null;

// Rotating daily messages — written like a personal text from a friend
const MESSAGES = [
  "Hey! Just checking in — have you spent time with Jesus today? 🙏",
  "Don't forget Him today. Even 5 minutes in the Word can change everything ✝️",
  "Good morning! He's been waiting to hear from you 🌅",
  "Quick reminder: open the Bible today, even just one chapter. You'll be glad you did 📖",
  "\"Come to Me, all who are weary...\" — Jesus is calling. Take a moment with Him ❤️",
  "His mercies are brand new this morning. Don't miss it 🌄",
  "Hey — life is busy, but don't let today go by without a moment with God 🙏",
];

function todayMessage(): string {
  const day = new Date().getDay(); // 0–6
  return MESSAGES[day % MESSAGES.length];
}

function isSameDay(date: Date, other: Date): boolean {
  return (
    date.getFullYear() === other.getFullYear() &&
    date.getMonth()    === other.getMonth()    &&
    date.getDate()     === other.getDate()
  );
}

/** Register /sw.js if not already registered */
async function ensureSW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js");
    return reg;
  } catch (err) {
    console.warn("[reminder] SW registration failed:", err);
    return null;
  }
}

/** Fire the notification right now via the service worker */
async function fireNotification() {
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  if (!reg) {
    console.warn("[reminder] No service worker registration available");
    return;
  }

  // Use whichever SW state is available — active is ideal, but installing/waiting
  // can also receive messages right after a fresh registration
  const sw = reg.active ?? reg.installing ?? reg.waiting;
  if (!sw) {
    console.warn("[reminder] No service worker instance found");
    return;
  }

  sw.postMessage({
    type:  "SHOW_REMINDER",
    title: "Scripture Lives 📖",
    body:  todayMessage(),
    icon:  "/Hand-painted cross_logo.png",
  });

  // Only record fired AFTER successfully posting the message
  localStorage.setItem(STORAGE_FIRED, new Date().toISOString());
}

/** Fire a test notification immediately (for debugging/UX verification) */
export async function sendTestNotification(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;
  await ensureSW();
  // Small delay to ensure SW is active after registration
  await new Promise(r => setTimeout(r, 500));
  await fireNotification();
  return true;
}

/** Calculate ms until the next occurrence of HH:MM */
function msUntil(hhmm: string): number {
  const [hh, mm] = hhmm.split(":").map(Number);
  const now  = new Date();
  const next = new Date();
  next.setHours(hh, mm, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1); // schedule for tomorrow
  return next.getTime() - now.getTime();
}

/** Cancel any pending timer */
export function cancelReminder() {
  if (timerHandle !== null) {
    clearTimeout(timerHandle);
    timerHandle = null;
  }
}

/** Save settings and arm the timer */
export async function scheduleReminder(time: string): Promise<boolean> {
  // Request permission first
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;

  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return false;

  await ensureSW();

  localStorage.setItem(STORAGE_TIME, time);
  localStorage.setItem(STORAGE_ON, "true");

  armTimer(time);
  return true;
}

/** Turn reminders off */
export function disableReminder() {
  localStorage.setItem(STORAGE_ON, "false");
  cancelReminder();
}

/** Arm a setTimeout for the next occurrence of the reminder time */
function armTimer(time: string) {
  cancelReminder();

  // Check if we already fired today
  const lastFired = localStorage.getItem(STORAGE_FIRED);
  if (lastFired && isSameDay(new Date(lastFired), new Date())) {
    // Already fired today — schedule for tomorrow
    timerHandle = setTimeout(async () => {
      await fireNotification();
      armTimer(time); // re-arm for following day
    }, msUntil(time));
    return;
  }

  // Check if the time has already passed today (and we haven't fired yet)
  const [hh, mm] = time.split(":").map(Number);
  const now = new Date();
  const todayTarget = new Date();
  todayTarget.setHours(hh, mm, 0, 0);

  if (todayTarget <= now) {
    // Missed today — fire immediately, then re-arm for tomorrow
    fireNotification().then(() => {
      timerHandle = setTimeout(async () => {
        await fireNotification();
        armTimer(time);
      }, msUntil(time));
    });
  } else {
    // Still ahead of time today
    timerHandle = setTimeout(async () => {
      await fireNotification();
      armTimer(time); // re-arm for tomorrow
    }, todayTarget.getTime() - now.getTime());
  }
}

/**
 * Call on app startup to restore and re-arm any active reminder.
 * Safe to call multiple times.
 */
export async function restoreReminder() {
  if (typeof window === "undefined") return;
  const on   = localStorage.getItem(STORAGE_ON);
  const time = localStorage.getItem(STORAGE_TIME);
  if (on === "true" && time && Notification.permission === "granted") {
    await ensureSW();
    armTimer(time);
  }
}

/** Read current reminder settings */
export function getReminderSettings(): { on: boolean; time: string } {
  if (typeof window === "undefined") return { on: false, time: "07:00" };
  return {
    on:   localStorage.getItem(STORAGE_ON) === "true",
    time: localStorage.getItem(STORAGE_TIME) ?? "07:00",
  };
}
