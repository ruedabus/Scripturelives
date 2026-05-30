/**
 * Scripture Lives — Service Worker
 * Handles daily devotional reminder notifications.
 */

const CACHE_NAME = "scripture-lives-v1";

// ── Install & activate ────────────────────────────────────────────────────────
self.addEventListener("install",  () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// ── Notification click — open/focus the app ───────────────────────────────────
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (self.clients.openWindow) {
        return self.clients.openWindow("/bible");
      }
    })
  );
});

// ── Message from page: show a notification now ────────────────────────────────
self.addEventListener("message", (e) => {
  if (e.data?.type === "SHOW_REMINDER") {
    const { title, body, icon } = e.data;
    self.registration.showNotification(title ?? "Scripture Lives 📖", {
      body:             body ?? "Hey! Don't forget your time with Jesus today 🙏",
      icon:             icon ?? "/Hand-painted cross_logo.png",
      badge:            "/Hand-painted cross_logo.png",
      tag:              "daily-reminder",   // replaces previous instead of stacking
      renotify:         true,
      requireInteraction: true,             // stays until user taps — like a text message
      vibrate:          [200, 100, 200],    // gentle double-buzz on mobile
      actions: [
        { action: "open",    title: "📖 Open Bible" },
        { action: "dismiss", title: "Later"          },
      ],
    });
  }
});
