"use client";
import { motion } from "framer-motion";
import { Calendar, Syringe, AlertTriangle, Info } from "lucide-react";
import type { Reminder } from "@/types/home";

interface RemindersFeedProps {
  reminders: Reminder[];
}

const TYPE_MAP = {
  appointment: { Icon: Calendar,      color: "#4f46e5", bg: "var(--accent-subtle)" },
  dose:        { Icon: Syringe,       color: "#10b981", bg: "rgba(16,185,129,0.08)" },
  alert:       { Icon: AlertTriangle, color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  info:        { Icon: Info,          color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
};

export default function RemindersFeed({ reminders }: RemindersFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Reminders</h2>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
        >
          {reminders.filter((r) => !r.read).length} new
        </span>
      </div>

      <div className="space-y-3">
        {reminders.map((reminder, i) => {
          const { Icon, color, bg } = TYPE_MAP[reminder.type];
          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.35 + i * 0.07 }}
              className="flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg-secondary)]"
              style={{ opacity: reminder.read ? 0.65 : 1 }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: bg }}
              >
                <Icon size={14} color={color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {reminder.title}
                  </p>
                  {!reminder.read && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                  )}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {reminder.description}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
                  {reminder.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
