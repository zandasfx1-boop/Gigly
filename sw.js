self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const ios = /iPhone|iPad|iPod/i.test(self.navigator.userAgent);
    // App is open and in front: the app shows its own in-app alert instead.
    if (!ios && wins.some(w => w.focused && w.visibilityState === "visible")) return;
    await self.registration.showNotification(d.title || "Lagos Gig", {
      body: d.body || "New message",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: d.tag || "lagos-gig",
      renotify: true,
      data: { conv: d.conv || null }
    });
  })());
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  const conv = e.notification.data && e.notification.data.conv;
  e.waitUntil((async () => {
    const wins = await clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) {
      if ("focus" in w) { await w.focus(); w.postMessage({ type: "open-chat", conv }); return; }
    }
    await clients.openWindow("/?chat=" + (conv || "") + "#inbox");
  })());
});
