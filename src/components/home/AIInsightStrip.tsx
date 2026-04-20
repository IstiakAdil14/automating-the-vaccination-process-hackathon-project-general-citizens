"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { useState } from "react";

interface AIInsightStripProps {
  insight: string | null; // null = loading
}

export default function AIInsightStrip({ insight }: AIInsightStripProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(251,191,36,0.12)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
          role="status"
          aria-live="polite"
        >
          {/* Icon */}
          <span
            className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.18)" }}
          >
            <Lightbulb size={16} style={{ color: "#d97706" }} />
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {insight === null ? (
              /* Skeleton */
              <div className="flex flex-col gap-1.5">
                <div
                  className="h-3 rounded-full w-3/4"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(245,158,11,0.15) 25%, rgba(245,158,11,0.3) 50%, rgba(245,158,11,0.15) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s linear infinite",
                  }}
                />
                <div
                  className="h-3 rounded-full w-1/2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(245,158,11,0.15) 25%, rgba(245,158,11,0.3) 50%, rgba(245,158,11,0.15) 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.4s linear infinite 0.2s",
                  }}
                />
              </div>
            ) : (
              <p className="text-sm font-medium truncate" style={{ color: "#92400e" }}>
                {insight}
              </p>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 p-1 rounded-lg transition-colors hover:bg-amber-100"
            style={{ color: "#b45309" }}
            aria-label="Dismiss insight"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
