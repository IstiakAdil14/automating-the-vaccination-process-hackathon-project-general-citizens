"use client";
import { MapPin, Star, Clock, Users, ChevronRight, Syringe, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Center } from "@/types/centers";
import AvailabilityBadge from "./AvailabilityBadge";

interface Props {
  center: Center;
  selected: boolean;
  onClick: () => void;
  onBook: () => void;
  index: number;
}

const VACCINE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Pfizer:      { bg: "#eeedfe", text: "#3c3489", border: "#afa9ec" },
  Moderna:     { bg: "#e1f5ee", text: "#085041", border: "#5dcaa5" },
  AstraZeneca: { bg: "#faeeda", text: "#633806", border: "#ef9f27" },
  Sinopharm:   { bg: "#fcebeb", text: "#791f1f", border: "#f09595" },
  Covaxin:     { bg: "#eeedfe", text: "#3c3489", border: "#afa9ec" },
};
const FALLBACK = { bg: "#eeedfe", text: "#3c3489", border: "#afa9ec" };

const CARD_BG_PALETTE = [
  { card: "#f0effe", header: "#e8e6fd", footer: "#ebe9fe" }, // indigo
  { card: "#eaf3de", header: "#dff0cc", footer: "#e6f2d8" }, // green
  { card: "#faeeda", header: "#f5e3c0", footer: "#f8ecce" }, // amber
  { card: "#e1f5ee", header: "#cceee2", footer: "#d6f0e7" }, // teal
  { card: "#fce8f3", header: "#f8d4ea", footer: "#fae0f0" }, // pink
  { card: "#e8f4fd", header: "#d0eaf9", footer: "#dceef8" }, // sky
];

type AvailTier = "good" | "low" | "full";

function getAvailTier(slots: number, total: number): AvailTier {
  if (slots === 0) return "full";
  if (slots / total <= 0.2) return "low";
  return "good";
}

const AVAIL_STYLE: Record<AvailTier, { bg: string; text: string; border: string; dot: string; barColor: string }> = {
  good: { bg: "#eaf3de", text: "#27500a", border: "#97c459", dot: "#639922", barColor: "#639922" },
  low:  { bg: "#faeeda", text: "#633806", border: "#ef9f27", dot: "#ba7517", barColor: "#ba7517" },
  full: { bg: "#fcebeb", text: "#791f1f", border: "#f09595", dot: "#e24b4a", barColor: "#e24b4a" },
};

export default function CenterCard({ center, selected, onClick, onBook, index }: Props) {
  const isFull = center.slotsAvailable === 0;
  const tier = getAvailTier(center.slotsAvailable, center.totalCapacity);
  const avail = AVAIL_STYLE[tier];
  const usedPct = Math.round(((center.totalCapacity - center.slotsAvailable) / center.totalCapacity) * 100);
  const cardTheme = CARD_BG_PALETTE[index % CARD_BG_PALETTE.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      onClick={onClick}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        cursor: "pointer",
        border: selected ? "2px solid #4f46e5" : "1px solid #e2e0fa",
        background: selected ? "var(--surface-raised)" : cardTheme.card,
        transition: "border-color 0.2s, box-shadow 0.25s",
        boxShadow: selected
          ? "0 0 0 4px rgba(79,70,229,0.1), 0 8px 30px rgba(79,70,229,0.12)"
          : "0 2px 12px rgba(0,0,0,0.05)",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Tinted header ── */}
      <div style={{
        background: selected ? "#f0effe" : cardTheme.header,
        borderBottom: `1px solid ${selected ? "#e2e0fa" : "var(--border)"}`,
        padding: "15px 18px 13px",
        transition: "background 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {/* Icon block */}
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: selected ? "#dddafb" : "var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Building2 size={17} color={selected ? "#4f46e5" : "var(--text-muted)"} strokeWidth={2} />
          </div>

          {/* Name + distance */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontWeight: 800, fontSize: "0.96rem", lineHeight: 1.25,
              letterSpacing: "-0.025em",
              color: selected ? "#1e1b4b" : "var(--text-primary)",
            }}>
              {center.name}
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 3, marginTop: 3,
              fontSize: "0.72rem", fontWeight: 500,
              color: selected ? "#6366f1" : "var(--text-muted)",
            }}>
              <MapPin size={11} strokeWidth={2} />
              {center.distance} km away
            </div>
          </div>

          {/* Availability pill */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 10px", borderRadius: 999, flexShrink: 0,
            fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.01em",
            background: avail.bg, color: avail.text, border: `1px solid ${avail.border}`,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: avail.dot }} />
            {isFull ? "Full" : `${center.slotsAvailable} left`}
          </span>

          {/* Keep AvailabilityBadge for parent logic (hidden) */}
          <span style={{ display: "none" }}>
            <AvailabilityBadge slots={center.slotsAvailable} total={center.totalCapacity} size="sm" />
          </span>
        </div>
      </div>

      {/* ── Capacity bar ── */}
      <div style={{ padding: "13px 18px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--text-muted)",
          }}>
            Slot capacity
          </span>
          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)" }}>
            {center.slotsAvailable} / {center.totalCapacity} available
          </span>
        </div>
        <div style={{
          height: 5, borderRadius: 999,
          background: "var(--border)", overflow: "hidden",
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${usedPct}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: "100%", borderRadius: 999, background: avail.barColor }}
          />
        </div>
      </div>

      {/* ── Meta: hours + rating ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "13px 18px 0",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "4px 9px", borderRadius: 8,
          fontSize: "0.72rem", fontWeight: 600,
          background: "var(--surface)", border: "0.5px solid var(--border)",
          color: "var(--text-muted)",
        }}>
          <Clock size={11} strokeWidth={2} />
          {center.hours}
        </span>

        <div style={{ flex: 1 }} />

        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          padding: "4px 9px", borderRadius: 8,
          fontSize: "0.72rem", fontWeight: 700,
          background: "#faeeda", color: "#854f0b", border: "1px solid #fac775",
        }}>
          <Star size={11} fill="#ba7517" stroke="none" />
          {center.rating}
        </span>
      </div>

      {/* ── Vaccine & family chips ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "10px 18px 0" }}>
        {center.vaccines.map((v) => {
          const s = VACCINE_STYLE[v] ?? FALLBACK;
          return (
            <span key={v} style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "3px 9px", borderRadius: 6,
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.005em",
              background: s.bg, color: s.text, border: `1px solid ${s.border}`,
            }}>
              <Syringe size={9} strokeWidth={2.5} />{v}
            </span>
          );
        })}
        {center.familyFriendly && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 9px", borderRadius: 6,
            fontSize: "0.7rem", fontWeight: 700,
            background: "#eaf3de", color: "#27500a", border: "1px solid #97c459",
          }}>
            <Users size={9} strokeWidth={2.5} />Family
          </span>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 18px", marginTop: 13, height: 64, boxSizing: "border-box",
        background: selected ? "var(--surface)" : cardTheme.footer, borderTop: "0.5px solid var(--border)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{
            fontSize: "0.63rem", fontWeight: 700, lineHeight: 1,
            textTransform: "uppercase", letterSpacing: "0.09em",
            color: "var(--text-muted)",
          }}>
            Next Slot
          </span>
          <span style={{
            fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.3,
            color: "var(--text-primary)", letterSpacing: "-0.015em",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140,
          }}>
            {center.nextAvailableSlot}
          </span>
        </div>

        <motion.button
          whileTap={!isFull ? { scale: 0.93 } : {}}
          whileHover={!isFull ? { opacity: 0.87 } : {}}
          onClick={(e) => { e.stopPropagation(); onBook(); }}
          disabled={isFull}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "10px 20px", borderRadius: 12,
            fontSize: "0.82rem", fontWeight: 800, letterSpacing: "-0.02em",
            border: isFull ? "0.5px solid var(--border)" : "none",
            cursor: isFull ? "not-allowed" : "pointer",
            fontFamily: "inherit", transition: "opacity 0.15s",
            background: isFull ? "var(--surface)" : "#4f46e5",
            color: isFull ? "var(--text-muted)" : "#fff",
            boxShadow: isFull ? "none" : "0 4px 16px rgba(79,70,229,0.32)",
            flexShrink: 0,
          }}
        >
          {isFull ? "Fully Booked" : "Book Now"}
          {!isFull && <ChevronRight size={14} strokeWidth={2.5} />}
        </motion.button>
      </div>
    </motion.div>
  );
}