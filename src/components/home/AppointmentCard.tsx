"use client";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Navigation, CheckCircle } from "lucide-react";
import type { Appointment } from "@/types/home";

interface AppointmentCardProps {
  appointment: Appointment;
}

const STATUS_MAP: Record<
  Appointment["status"],
  { bg: string; color: string; Icon: typeof CheckCircle; label: string }
> = {
  confirmed: { bg: "rgba(16,185,129,0.08)",  color: "#10b981", Icon: CheckCircle, label: "Confirmed" },
  pending:   { bg: "rgba(245,158,11,0.08)",  color: "#f59e0b", Icon: Clock,       label: "Pending"   },
  completed: { bg: "rgba(16,185,129,0.08)",  color: "#10b981", Icon: CheckCircle, label: "Completed" },
  cancelled: { bg: "rgba(239,68,68,0.08)",   color: "#ef4444", Icon: Clock,       label: "Cancelled" },
};

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { bg, color, Icon: StatusIcon, label } = STATUS_MAP[appointment.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Next Appointment</h2>
        <span className="pill" style={{ background: bg, color, border: `1px solid ${color}30` }}>
          <StatusIcon size={11} />
          {label}
        </span>
      </div>

      <div
        className="p-4 rounded-xl mb-4 flex-1"
        style={{ background: "var(--accent-subtle)", border: "1px solid rgba(79,70,229,0.12)" }}
      >
        <p className="font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
          {appointment.vaccineName}
        </p>
        <div className="space-y-2">
          {[
            { Icon: Calendar, text: appointment.date },
            { Icon: Clock,    text: appointment.time },
            { Icon: MapPin,   text: appointment.centerName },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <Icon size={13} color="var(--accent)" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <a
        href={appointment.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full justify-center text-sm"
      >
        <Navigation size={14} />
        Get Directions
      </a>
    </motion.div>
  );
}
