"use client";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import type { VaccineEntry, VaccineStatus } from "@/types/home";

interface VaccinationStatusCardProps {
  vaccines: VaccineEntry[];
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS: Record<VaccineStatus, { bg: string; text: string; border: string }> = {
  Complete:  { bg: "rgba(16,185,129,0.1)",  text: "#059669", border: "rgba(16,185,129,0.25)"  },
  "Due Soon":{ bg: "rgba(245,158,11,0.1)",  text: "#d97706", border: "rgba(245,158,11,0.25)"  },
  Overdue:   { bg: "rgba(239,68,68,0.1)",   text: "#dc2626", border: "rgba(239,68,68,0.25)"   },
  Scheduled: { bg: "rgba(99,102,241,0.1)",  text: "#4f46e5", border: "rgba(99,102,241,0.25)"  },
};

const BAR_COLOR: Record<VaccineStatus, string> = {
  Complete:  "#10b981",
  "Due Soon":"#f59e0b",
  Overdue:   "#ef4444",
  Scheduled: "#6366f1",
};

// ── Ring constants ────────────────────────────────────────────────────────────
const R = 36;
const CIRC = 2 * Math.PI * R;

export default function VaccinationStatusCard({ vaccines }: VaccinationStatusCardProps) {
  const total     = vaccines.length;
  const completed = vaccines.filter((v) => v.status === "Complete").length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const offset    = CIRC * (1 - pct / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 h-full"
      role="region"
      aria-label="Vaccination status overview"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
          Vaccination Status
        </h2>
        <span
          className="pill"
          style={{
            background: "var(--accent-subtle)",
            color: "var(--accent)",
            border: "1px solid rgba(79,70,229,0.15)",
          }}
        >
          <ShieldCheck size={11} aria-hidden="true" />
          {completed}/{total} Complete
        </span>
      </div>

      {/* ── Ring ── */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center gap-1">
          <div className="relative w-24 h-24" aria-hidden="true">
            <svg viewBox="0 0 88 88" className="w-full h-full -rotate-90">
              {/* Track */}
              <circle
                cx="44" cy="44" r={R}
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              {/* Progress */}
              <motion.circle
                cx="44" cy="44" r={R}
                fill="none"
                stroke={pct === 100 ? "#10b981" : pct > 0 ? "#f59e0b" : "#6366f1"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
            {/* Centre label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-bold text-xl"
                style={{ color: "var(--text-primary)" }}
                aria-label={`${pct} percent overall completion`}
              >
                {pct}%
              </span>
            </div>
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            In Progress
          </span>
        </div>
      </div>

      {/* ── Vaccine rows ── */}
      <ul className="space-y-4" aria-label="Vaccine list">
        {vaccines.map((v, i) => {
          const barPct = v.doses > 0 ? (v.completed / v.doses) * 100 : 0;
          const { bg, text, border } = STATUS[v.status];
          const barColor = BAR_COLOR[v.status];

          return (
            <li key={v.name}>
              {/* Name + badge */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {v.name}
                </span>
                <span
                  className="pill text-xs"
                  style={{ background: bg, color: text, border: `1px solid ${border}` }}
                  aria-label={`Status: ${v.status}`}
                >
                  {v.status}
                </span>
              </div>

              {/* Progress bar */}
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "var(--border)" }}
                role="progressbar"
                aria-valuenow={v.completed}
                aria-valuemin={0}
                aria-valuemax={v.doses}
                aria-label={`${v.name}: ${v.completed} of ${v.doses} doses`}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: barColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{
                    duration: 0.9,
                    delay: 0.4 + i * 0.12,
                    ease: "easeOut",
                  }}
                />
              </div>

              {/* Dose count */}
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                {v.completed} / {v.doses} doses
              </p>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
