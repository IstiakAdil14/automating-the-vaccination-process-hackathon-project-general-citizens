"use client";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { HomeStats } from "@/types/home";

interface VaccinationStatusProps {
  stats: HomeStats;
}

function getTheme(progress: number) {
  if (progress >= 80) return { bar: "#10b981", label: "Well Protected",  bg: "rgba(16,185,129,0.08)",  text: "#10b981" };
  if (progress >= 50) return { bar: "#f59e0b", label: "In Progress",     bg: "rgba(245,158,11,0.08)", text: "#f59e0b" };
  return               { bar: "#ef4444", label: "Needs Attention", bg: "rgba(239,68,68,0.08)",  text: "#ef4444" };
}

const RADIUS = 32;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function VaccinationStatus({ stats }: VaccinationStatusProps) {
  const { bar, label, bg, text } = getTheme(stats.overallProgress);
  const barWidth = `${(stats.vaccinesReceived / stats.vaccinesScheduled) * 100}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Vaccination Status</h2>
        <span className="pill" style={{ background: bg, color: text, border: `1px solid ${text}30` }}>
          <ShieldCheck size={11} />
          {label}
        </span>
      </div>

      <div className="flex items-center gap-5 mb-5">
        {/* SVG ring */}
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r={RADIUS} fill="none" stroke="var(--border)" strokeWidth="8" />
            <motion.circle
              cx="40" cy="40" r={RADIUS}
              fill="none" stroke={bar} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - stats.overallProgress / 100) }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              {stats.overallProgress}%
            </span>
          </div>
        </div>

        {/* Bar */}
        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
              <span>Doses completed</span>
              <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {stats.vaccinesReceived}/{stats.vaccinesScheduled}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: bar }}
                initial={{ width: 0 }}
                animate={{ width: barWidth }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {stats.vaccinesScheduled - stats.vaccinesReceived} dose
            {stats.vaccinesScheduled - stats.vaccinesReceived !== 1 ? "s" : ""} remaining
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
        {[
          { color: "#10b981", label: "Completed" },
          { color: "#f59e0b", label: "Due Soon" },
          { color: "#ef4444", label: "Overdue" },
        ].map(({ color, label: l }) => (
          <div key={l} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>{l}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
