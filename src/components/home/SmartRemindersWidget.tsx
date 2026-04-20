"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bell, Calendar, ChevronRight, PartyPopper } from "lucide-react";
import { useMemo, useState } from "react";
import type { VaccineReminder, ReminderPriority } from "@/types/home";

// ── Priority config ───────────────────────────────────────────────────────────
const PRIORITY: Record<ReminderPriority, { dot: string; label: string }> = {
  high:   { dot: "#ef4444", label: "High"   },
  medium: { dot: "#f59e0b", label: "Medium" },
  low:    { dot: "#10b981", label: "Low"    },
};

// ── Filter tabs ───────────────────────────────────────────────────────────────
type Filter = "All" | "Overdue" | "This Week" | "This Month";
const FILTERS: Filter[] = ["All", "Overdue", "This Week", "This Month"];

// ── Countdown logic ───────────────────────────────────────────────────────────
function daysUntil(isoDate: string): number {
  const now  = new Date(); now.setHours(0, 0, 0, 0);
  const due  = new Date(isoDate); due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - now.getTime()) / 86_400_000);
}

function countdownLabel(days: number): { text: string; color: string; bg: string } {
  if (days < 0)  return { text: `${Math.abs(days)}d overdue`, color: "#dc2626", bg: "rgba(220,38,38,0.09)"  };
  if (days === 0) return { text: "Due today",                  color: "#d97706", bg: "rgba(217,119,6,0.09)"  };
  if (days <= 7)  return { text: `${days}d left`,              color: "#d97706", bg: "rgba(217,119,6,0.09)"  };
  return               { text: `${days}d left`,              color: "#4f46e5", bg: "rgba(79,70,229,0.09)"  };
}

function applyFilter(reminders: VaccineReminder[], filter: Filter): VaccineReminder[] {
  return reminders.filter((r) => {
    const d = daysUntil(r.dueDate);
    if (filter === "Overdue")    return d < 0;
    if (filter === "This Week")  return d >= 0 && d <= 7;
    if (filter === "This Month") return d >= 0 && d <= 30;
    return true;
  });
}

// ── Reminder row ──────────────────────────────────────────────────────────────
function ReminderRow({
  reminder,
  index,
  onBook,
}: {
  reminder: VaccineReminder;
  index: number;
  onBook: (r: VaccineReminder) => void;
}) {
  const days = daysUntil(reminder.dueDate);
  const { text, color, bg } = countdownLabel(days);
  const { dot } = PRIORITY[reminder.priority];
  const displayDate = new Date(reminder.dueDate).toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <motion.li
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 14 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
    >
      {/* Priority dot */}
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ background: dot }}
        aria-label={`${reminder.priority} priority`}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
          {reminder.vaccine}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Calendar size={11} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>{displayDate}</span>
        </div>
      </div>

      {/* Countdown badge */}
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
        style={{ background: bg, color }}
        aria-label={text}
      >
        {text}
      </span>

      {/* Book Now */}
      <button
        onClick={() => onBook(reminder)}
        className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-90 hover:-translate-y-0.5"
        style={{
          background: "var(--accent)",
          color: "white",
          boxShadow: "0 2px 8px var(--accent-glow)",
        }}
        aria-label={`Book appointment for ${reminder.vaccine}`}
      >
        Book Now
      </button>
    </motion.li>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface SmartRemindersWidgetProps {
  reminders: VaccineReminder[];
  onBook?: (reminder: VaccineReminder) => void;
}

export default function SmartRemindersWidget({
  reminders,
  onBook,
}: SmartRemindersWidgetProps) {
  const [filter, setFilter] = useState<Filter>("All");

  const sorted = useMemo(
    () => [...reminders].sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate)),
    [reminders],
  );

  const filtered  = useMemo(() => applyFilter(sorted, filter), [sorted, filter]);
  const displayed = filtered.slice(0, 3);
  const hasMore   = filtered.length > 3;

  function handleBook(r: VaccineReminder) {
    onBook?.(r);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
      role="region"
      aria-label="Smart reminders"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={16} style={{ color: "var(--accent)" }} aria-hidden="true" />
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Smart Reminders
          </h2>
          {filtered.length > 0 && (
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
              aria-label={`${filtered.length} reminders`}
            >
              {filtered.length}
            </span>
          )}
        </div>

        {hasMore && (
          <Link
            href="/appointments"
            className="flex items-center gap-0.5 text-xs font-semibold transition-colors hover:opacity-80"
            style={{ color: "var(--accent)" }}
            aria-label="See all reminders"
          >
            See all <ChevronRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div
        className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-none pb-0.5"
        role="tablist"
        aria-label="Filter reminders"
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all"
            style={
              filter === f
                ? { background: "var(--accent)", color: "white" }
                : { background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── List / Empty state ── */}
      <AnimatePresence mode="wait">
        {displayed.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-10 gap-3"
            role="status"
            aria-live="polite"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "var(--accent-subtle)" }}
              aria-hidden="true"
            >
              <PartyPopper size={26} style={{ color: "var(--accent)" }} />
            </div>
            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                You&apos;re all caught up! 🎉
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                No reminders for this period.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.ul
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
            aria-label="Reminder list"
          >
            {displayed.map((r, i) => (
              <ReminderRow key={r.id} reminder={r} index={i} onBook={handleBook} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
