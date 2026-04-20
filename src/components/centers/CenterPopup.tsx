"use client";
import { X, MapPin, Phone, Clock, Star, Navigation, Syringe, Users, CalendarCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Center } from "@/types/centers";
import AvailabilityBadge from "./AvailabilityBadge";

interface Props {
  center: Center | null;
  onClose: () => void;
  onBook: (c: Center) => void;
}

const VACCINE_COLORS: Record<string, string> = {
  Pfizer: "#4f46e5", Moderna: "#10b981", AstraZeneca: "#f59e0b",
  Sinopharm: "#ef4444", Covaxin: "#8b5cf6",
};

export default function CenterPopup({ center, onClose, onBook }: Props) {
  return (
    <AnimatePresence>
      {center && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(10,14,26,0.45)", backdropFilter: "blur(4px)", zIndex: 50 }}
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              zIndex: 51, width: "min(480px, calc(100vw - 32px))",
              background: "var(--surface-raised)", borderRadius: 20,
              border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                  <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
                    {center.name}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <AvailabilityBadge slots={center.slotsAvailable} total={center.totalCapacity} />
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", color: "#f59e0b", fontWeight: 700 }}>
                      <Star size={13} fill="#f59e0b" /> {center.rating}
                    </div>
                    {center.familyFriendly && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.08)", padding: "2px 8px", borderRadius: 999, border: "1px solid rgba(16,185,129,0.2)" }}>
                        <Users size={10} /> Family Friendly
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={onClose} style={{ padding: 8, borderRadius: 10, border: "none", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-muted)", display: "flex", flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 20px" }}>
              {/* Info rows */}
              {[
                { icon: <MapPin size={14} />, text: center.address },
                { icon: <Phone size={14} />, text: center.phone },
                { icon: <Clock size={14} />, text: center.hours },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>{icon}</span>
                  {text}
                </div>
              ))}

              {/* Next slot */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", background: "var(--accent-subtle)", borderRadius: 12, border: "1px solid var(--border)" }}>
                <Zap size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Next Available Slot</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--accent)" }}>{center.nextAvailableSlot}</p>
                </div>
              </div>

              {/* Vaccines */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Available Vaccines</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {center.vaccines.map((v) => (
                    <span key={v} style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "4px 10px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600,
                      background: `${VACCINE_COLORS[v] ?? "#6366f1"}15`,
                      color: VACCINE_COLORS[v] ?? "#6366f1",
                      border: `1px solid ${VACCINE_COLORS[v] ?? "#6366f1"}30`,
                    }}>
                      <Syringe size={11} /> {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Capacity bar */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 6 }}>
                  <span>Today's capacity</span>
                  <span style={{ fontWeight: 700, color: "var(--text-secondary)" }}>
                    {center.slotsAvailable} / {center.totalCapacity} slots
                  </span>
                </div>
                <div style={{ height: 6, background: "var(--bg-secondary)", borderRadius: 999, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(center.slotsAvailable / center.totalCapacity) * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      height: "100%", borderRadius: 999,
                      background: center.slotsAvailable === 0 ? "#ef4444"
                        : center.slotsAvailable / center.totalCapacity < 0.2 ? "#f59e0b"
                        : "var(--accent)",
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => onBook(center)}
                  disabled={center.slotsAvailable === 0}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "11px 0", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem",
                    background: center.slotsAvailable === 0 ? "var(--border)" : "var(--accent)",
                    color: center.slotsAvailable === 0 ? "var(--text-muted)" : "#fff",
                    border: "none", cursor: center.slotsAvailable === 0 ? "not-allowed" : "pointer",
                    boxShadow: center.slotsAvailable > 0 ? "0 4px 14px var(--accent-glow)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <CalendarCheck size={15} />
                  {center.slotsAvailable === 0 ? "Fully Booked" : "Book Now"}
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${center.location.lat},${center.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "11px 16px", borderRadius: 12, fontWeight: 700, fontSize: "0.88rem",
                    background: "transparent", color: "var(--accent)",
                    border: "1.5px solid var(--accent)", textDecoration: "none", transition: "all 0.2s",
                  }}
                >
                  <Navigation size={15} /> Directions
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
