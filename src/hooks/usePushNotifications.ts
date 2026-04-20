"use client";
import { useEffect, useState } from "react";

export interface PushPreferences {
  doseReminders:        boolean;
  appointmentReminders: boolean;
  systemAlerts:         boolean;
}

interface UsePushReturn {
  supported:   boolean;
  subscribed:  boolean;
  preferences: PushPreferences;
  subscribe:   () => Promise<void>;
  unsubscribe: () => Promise<void>;
  updatePrefs: (prefs: Partial<PushPreferences>) => Promise<void>;
}

const DEFAULT_PREFS: PushPreferences = {
  doseReminders:        true,
  appointmentReminders: true,
  systemAlerts:         true,
};

export function usePushNotifications(): UsePushReturn {
  const [supported,   setSupported]   = useState(false);
  const [subscribed,  setSubscribed]  = useState(false);
  const [preferences, setPreferences] = useState<PushPreferences>(DEFAULT_PREFS);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = "serviceWorker" in navigator && "PushManager" in window;
    setSupported(ok);
    if (!ok) return;

    navigator.serviceWorker.ready.then((reg) => {
      setRegistration(reg);
      reg.pushManager.getSubscription().then((sub) => setSubscribed(!!sub));
    });
  }, []);

  async function subscribe() {
    if (!registration) return;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) { console.warn("VAPID public key not set"); return; }

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    const json = sub.toJSON() as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    await fetch("/api/push/subscribe", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...json, preferences }),
    });

    setSubscribed(true);
  }

  async function unsubscribe() {
    if (!registration) return;
    const sub = await registration.pushManager.getSubscription();
    if (!sub) return;

    await fetch("/api/push/subscribe", {
      method:  "DELETE",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ endpoint: sub.endpoint }),
    });

    await sub.unsubscribe();
    setSubscribed(false);
  }

  async function updatePrefs(prefs: Partial<PushPreferences>) {
    const next = { ...preferences, ...prefs };
    setPreferences(next);

    if (!registration) return;
    const sub = await registration.pushManager.getSubscription();
    if (!sub) return;

    const json = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };
    await fetch("/api/push/subscribe", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...json, preferences: next }),
    });
  }

  return { supported, subscribed, preferences, subscribe, unsubscribe, updatePrefs };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64  = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw     = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
