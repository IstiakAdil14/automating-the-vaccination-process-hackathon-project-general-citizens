"use client";
import { motion } from "framer-motion";
import { Bell, BellOff, Syringe, Calendar, Info } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const PREFS = [
  { key: "doseReminders"        as const, icon: Syringe,  label: "Dose Reminders",         desc: "Alerts when a vaccine dose is due within 7 days" },
  { key: "appointmentReminders" as const, icon: Calendar, label: "Appointment Reminders",   desc: "Reminders 24 hours before a booked appointment"  },
  { key: "systemAlerts"         as const, icon: Info,     label: "System & Health Alerts",  desc: "Vaccination drives, outbreaks, and platform news" },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-colors shrink-0"
      style={{ background: on ? "var(--accent)" : "var(--border-strong)" }}
    >
      <motion.span
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const { supported, subscribed, preferences, subscribe, unsubscribe, updatePrefs } =
    usePushNotifications();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          Notifications
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Manage how VaxCare alerts you about your health schedule.
        </p>
      </div>

      {/* Push toggle card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="card p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: subscribed ? "var(--accent-subtle)" : "var(--bg-secondary)" }}
            >
              {subscribed
                ? <Bell size={18} style={{ color: "var(--accent)" }} />
                : <BellOff size={18} style={{ color: "var(--text-muted)" }} />
              }
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                Push Notifications
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {!supported
                  ? "Not supported in this browser"
                  : subscribed
                  ? "Enabled on this device"
                  : "Disabled — tap to enable"}
              </p>
            </div>
          </div>
          {supported && (
            <Toggle
              on={subscribed}
              onToggle={() => (subscribed ? unsubscribe() : subscribe())}
            />
          )}
        </div>
      </motion.div>

      {/* Per-type preferences */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="card p-5 space-y-1"
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--text-muted)" }}>
          Notification Types
        </p>
        {PREFS.map(({ key, icon: Icon, label, desc }, i) => (
          <div
            key={key}
            className="flex items-center justify-between gap-4 py-3"
            style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "var(--accent-subtle)" }}
              >
                <Icon size={15} style={{ color: "var(--accent)" }} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            </div>
            <Toggle
              on={preferences[key]}
              onToggle={() => updatePrefs({ [key]: !preferences[key] })}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
