"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    // Initialise from current state (avoids SSR mismatch)
    setIsOffline(!navigator.onLine);
    const goOnline  = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline-banner"
          initial={{ opacity: 0, y: -40, height: 0 }}
          animate={{ opacity: 1, y: 0,   height: "auto" }}
          exit={{   opacity: 0, y: -40,  height: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
          role="status"
          aria-live="assertive"
          aria-label="Offline warning"
        >
          <div
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.30)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <div className="flex items-center gap-2">
              <WifiOff size={14} aria-hidden="true" style={{ color: "#d97706", flexShrink: 0 }} />
              <p className="text-xs font-semibold" style={{ color: "#92400e" }}>
                ⚠️ You&apos;re offline — showing cached data
              </p>
              <span className="hidden sm:inline text-xs" style={{ color: "var(--text-muted)" }}>
                · Last synced {lastSync}
              </span>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors"
              style={{
                background: "rgba(245,158,11,0.18)",
                color: "#b45309",
                border: "1px solid rgba(245,158,11,0.30)",
              }}
              aria-label="Retry connection"
            >
              <RefreshCw size={11} aria-hidden="true" />
              Retry
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
