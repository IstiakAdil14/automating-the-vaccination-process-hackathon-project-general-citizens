"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight, Radio, Clock, CheckCircle2 } from "lucide-react";
import type { Event } from "@/types/home";

interface EventCardsProps {
  events: Event[];
}

const STATUS_MAP = {
  upcoming:  { label: "Upcoming",  color: "#4f46e5", bg: "var(--accent-subtle)",        Icon: Clock         },
  ongoing:   { label: "Ongoing",   color: "#10b981", bg: "rgba(16,185,129,0.08)",        Icon: Radio         },
  completed: { label: "Completed", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)",        Icon: CheckCircle2  },
};

export default function EventCards({ events }: EventCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6 h-full"
    >
      <h2 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Vaccination Events</h2>

      <div className="space-y-3">
        {events.map((event, i) => {
          const { label, color, bg, Icon: StatusIcon } = STATUS_MAP[event.status];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-4 rounded-xl transition-colors"
              style={{ border: "1px solid var(--border)", background: "var(--surface-raised)" }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-semibold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  {event.title}
                </p>
                <span
                  className="pill flex-shrink-0"
                  style={{ background: bg, color, border: `1px solid ${color}25` }}
                >
                  <StatusIcon size={10} />
                  {label}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {event.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <CalendarDays size={12} color="var(--accent)" />
                  {event.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <MapPin size={12} color="var(--accent)" />
                  {event.location}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={event.ctaHref}
                className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:gap-2.5"
                style={{ color: "var(--accent)" }}
              >
                {event.ctaLabel}
                <ArrowRight size={12} />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
