"use client";
import { X, CalendarCheck, Syringe, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Center } from "@/types/centers";

interface Props {
  center: Center | null;
  date: string;
  onClose: () => void;
}

const SLOT_TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

export default function BookingModal({ center, date, onClose }: Props) {
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!center) return null;

  const handleSubmit = () => {
    if (!selectedVaccine || !selectedTime) return;
    setSubmitted(true);
    setTimeout(onClose, 2200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(10,14,26,0.5)", backdropFilter: "blur(6px)", zIndex: 60 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 61, width: "min(460px, calc(100vw - 32px))",
          background: "var(--surface-raised)", borderRadius: 20,
          border: "1px solid var(--border-strong)", boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ padding: 40, textAlign: "center" }}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(16,185,129,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={32} style={{ color: "#10b981" }} />
            </div>
            <h3 style={{ fontWeight: 800, fontSize: "1.15rem", color: "var(--text-primary)", marginBottom: 8 }}>Appointment Booked!</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {selectedVaccine} at {center.name}<br />
              {date || "Today"} · {selectedTime}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CalendarCheck size={18} style={{ color: "var(--accent)" }} />
                </div>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>Book Appointment</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Fill in the details below</p>
                </div>
              </div>
              <button onClick={onClose} style={{ padding: 8, borderRadius: 10, border: "none", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "16px 20px 20px" }}>
              {/* Pre-filled center info */}
              <div style={{ padding: "10px 14px", background: "var(--accent-subtle)", borderRadius: 12, border: "1px solid var(--border)", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", color: "var(--accent)", fontWeight: 700, marginBottom: 4 }}>
                  <MapPin size={13} /> {center.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  <Clock size={12} /> {date || "Today"} · {center.hours}
                </div>
              </div>

              {/* Vaccine select */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Select Vaccine
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {center.vaccines.map((v) => (
                    <button key={v}
                      onClick={() => setSelectedVaccine(v)}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "6px 12px", borderRadius: 999, fontSize: "0.8rem", fontWeight: 600,
                        background: selectedVaccine === v ? "var(--accent)" : "transparent",
                        color: selectedVaccine === v ? "#fff" : "var(--text-secondary)",
                        border: `1.5px solid ${selectedVaccine === v ? "var(--accent)" : "var(--border-strong)"}`,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      <Syringe size={11} /> {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                  Select Time Slot
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                  {SLOT_TIMES.map((t) => (
                    <button key={t}
                      onClick={() => setSelectedTime(t)}
                      style={{
                        padding: "8px 4px", borderRadius: 10, fontSize: "0.8rem", fontWeight: 600, textAlign: "center",
                        background: selectedTime === t ? "var(--accent)" : "var(--bg-secondary)",
                        color: selectedTime === t ? "#fff" : "var(--text-secondary)",
                        border: `1.5px solid ${selectedTime === t ? "var(--accent)" : "var(--border)"}`,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedVaccine || !selectedTime}
                style={{
                  width: "100%", padding: "12px 0", borderRadius: 12, fontWeight: 700, fontSize: "0.92rem",
                  background: !selectedVaccine || !selectedTime ? "var(--border)" : "var(--accent)",
                  color: !selectedVaccine || !selectedTime ? "var(--text-muted)" : "#fff",
                  border: "none", cursor: !selectedVaccine || !selectedTime ? "not-allowed" : "pointer",
                  boxShadow: selectedVaccine && selectedTime ? "0 4px 14px var(--accent-glow)" : "none",
                  transition: "all 0.2s",
                }}
              >
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
