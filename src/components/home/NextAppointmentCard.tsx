"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarCheck, Clock, MapPin, Navigation,
  CalendarClock, ChevronDown, User, FileText, Syringe,
} from "lucide-react";
import { useState } from "react";
import type { Appointment } from "@/types/home";

// ── Teal palette ──────────────────────────────────────────────────────────────
const TEAL = {
  solid:  "#0d9488",
  light:  "rgba(13,148,136,0.10)",
  border: "rgba(13,148,136,0.22)",
  text:   "#0f766e",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
export function NextAppointmentSkeleton() {
  return (
    <div
      className="card p-6 flex flex-col gap-4"
      style={{ borderLeft: `3px solid ${TEAL.border}` }}
      aria-busy="true"
      aria-label="Loading appointment"
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 rounded-full" style={{ background: "var(--border)" }} />
        <div className="h-5 w-20 rounded-full" style={{ background: "var(--border)" }} />
      </div>
      <div className="h-8 w-48 rounded-lg" style={{ background: "var(--border)" }} />
      <div className="space-y-2.5">
        {[80, 60, 70].map((w) => (
          <div
            key={w}
            className="h-3 rounded-full"
            style={{
              width: `${w}%`,
              background:
                "linear-gradient(90deg,var(--border) 25%,var(--bg-secondary) 50%,var(--border) 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.4s linear infinite",
            }}
          />
        ))}
      </div>
      <div className="flex gap-3 pt-1">
        <div className="h-10 flex-1 rounded-full" style={{ background: "var(--border)" }} />
        <div className="h-10 flex-1 rounded-full" style={{ background: "var(--border)" }} />
      </div>
    </div>
  );
}

// ── Detail row helper ─────────────────────────────────────────────────────────
function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: TEAL.light }}
      >
        <Icon size={14} style={{ color: TEAL.solid }} aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface NextAppointmentCardProps {
  appointment: Appointment | null; // null = loading
  onReschedule?: () => void;
}

export default function NextAppointmentCard({
  appointment,
  onReschedule,
}: NextAppointmentCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (!appointment) return (
    <div
      className="card p-6 flex flex-col items-center justify-center gap-3 text-center"
      style={{ borderLeft: `3px solid ${TEAL.border}`, minHeight: "180px" }}
    >
      <span className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: TEAL.light }}>
        <CalendarCheck size={22} style={{ color: TEAL.solid }} />
      </span>
      <div>
        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>No upcoming appointment</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Book one to get started</p>
      </div>
      <a href="/appointments/book" className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.82rem" }}>
        Book Now
      </a>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 flex flex-col gap-4"
      style={{ borderLeft: `3px solid ${TEAL.solid}` }}
      role="region"
      aria-label="Next appointment"
    >
      {/* ── Header row ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarCheck size={16} style={{ color: TEAL.solid }} aria-hidden="true" />
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Next Appointment
          </span>
        </div>

        {/* Confirmed chip */}
        <span
          className="pill text-xs"
          style={{ background: TEAL.light, color: TEAL.text, border: `1px solid ${TEAL.border}` }}
          aria-label="Status: Confirmed"
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: TEAL.solid }}
            aria-hidden="true"
          />
          Confirmed
        </span>
      </div>

      {/* ── Vaccine name + dose ── */}
      <div>
        <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
          {appointment.vaccineName}
        </h3>
        {appointment.doseNumber && (
          <span
            className="inline-flex items-center gap-1 mt-1 text-xs font-medium"
            style={{ color: TEAL.text }}
          >
            <Syringe size={11} aria-hidden="true" />
            {appointment.doseNumber}
          </span>
        )}
      </div>

      {/* ── Prominent date/time block ── */}
      <div
        className="flex items-center gap-4 px-4 py-3 rounded-xl"
        style={{ background: TEAL.light, border: `1px solid ${TEAL.border}` }}
      >
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: TEAL.text }}>
            Date
          </p>
          <p className="font-bold text-base mt-0.5" style={{ color: "var(--text-primary)" }}>
            {appointment.date}
          </p>
        </div>
        <div
          className="w-px self-stretch"
          style={{ background: TEAL.border }}
          aria-hidden="true"
        />
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: TEAL.text }}>
            Time
          </p>
          <p className="font-bold text-base mt-0.5" style={{ color: "var(--text-primary)" }}>
            {appointment.time}
          </p>
        </div>
      </div>

      {/* ── Compact info ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <MapPin size={13} style={{ color: TEAL.solid }} aria-hidden="true" />
          <span className="truncate">{appointment.centerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          <Clock size={13} style={{ color: TEAL.solid }} aria-hidden="true" />
          <span>{appointment.centerAddress}</span>
        </div>
      </div>

      {/* ── Expandable details ── */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="flex items-center gap-1.5 text-xs font-semibold self-start transition-colors"
        style={{ color: TEAL.text }}
        aria-expanded={expanded}
        aria-controls="apt-details-panel"
      >
        <CalendarClock size={13} aria-hidden="true" />
        {expanded ? "Hide details" : "View full details"}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="inline-flex"
        >
          <ChevronDown size={13} aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="apt-details-panel"
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className="pt-4 mt-1 space-y-3"
              style={{ borderTop: `1px solid ${TEAL.border}` }}
            >
              <DetailRow icon={MapPin}    label="Full Address"  value={appointment.centerAddress} />
              {appointment.doctorName && (
                <DetailRow icon={User}    label="Assigned Doctor" value={appointment.doctorName} />
              )}
              {appointment.doseNumber && (
                <DetailRow icon={Syringe} label="Dose"          value={appointment.doseNumber} />
              )}
              {appointment.notes && (
                <DetailRow icon={FileText} label="Notes"        value={appointment.notes} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CTAs ── */}
      <div className="flex gap-3 pt-1">
        <a
          href={appointment.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{
            background: TEAL.solid,
            color: "white",
            boxShadow: `0 4px 14px ${TEAL.border}`,
          }}
          aria-label="Get directions to vaccination center"
        >
          <Navigation size={14} aria-hidden="true" />
          Get Directions
        </a>

        <button
          onClick={onReschedule}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{
            background: TEAL.light,
            color: TEAL.text,
            border: `1px solid ${TEAL.border}`,
          }}
          aria-label="Reschedule this appointment"
        >
          <CalendarClock size={14} aria-hidden="true" />
          Reschedule
        </button>
      </div>
    </motion.div>
  );
}
