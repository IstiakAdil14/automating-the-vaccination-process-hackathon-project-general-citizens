"use client";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

export default function ServiceWorkerRegistrar() {
  const { updateAvailable, applyUpdate } = useServiceWorker();

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
          style={{
            background: "var(--surface-raised)",
            border: "1px solid var(--border-strong)",
            boxShadow: "var(--shadow-lg)",
          }}
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            A new version is available
          </p>
          <button
            onClick={applyUpdate}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "var(--accent)", color: "white" }}
            aria-label="Update app to latest version"
          >
            <RefreshCw size={12} aria-hidden="true" />
            Update
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
