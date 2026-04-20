"use client";
import { useEffect, useState } from "react";

interface SWState {
  registered: boolean;
  updateAvailable: boolean;
  applyUpdate: () => void;
}

export function useServiceWorker(): SWState {
  const [registered,      setRegistered]      = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker,   setWaitingWorker]   = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // Skip in development — avoids constant reloads from SW updates
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV === "development") return;

    let applyingUpdate = false;

    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((reg) => {
        setRegistered(true);

        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          setUpdateAvailable(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => console.warn("[SW] Registration failed:", err));

    // Only reload when the user triggered the update via applyUpdate()
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (applyingUpdate) window.location.reload();
    });

    // Expose setter so applyUpdate can flag the intentional reload
    (window as any).__swApplyingUpdate = (v: boolean) => { applyingUpdate = v; };
  }, []);

  function applyUpdate() {
    (window as any).__swApplyingUpdate?.(true);
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
  }

  return { registered, updateAvailable, applyUpdate };
}
