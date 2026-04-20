"use client";
import { SlidersHorizontal, X } from "lucide-react";
import type { Filters } from "@/types/centers";

const ALL_VACCINES = ["Pfizer", "Moderna", "AstraZeneca", "Sinopharm", "Covaxin"];
const RADII = [5, 10, 20, 50];
const TIME_SLOTS = [
  { value: "morning" as const, label: "Morning", sub: "8AM–12PM" },
  { value: "afternoon" as const, label: "Afternoon", sub: "12PM–5PM" },
  { value: "evening" as const, label: "Evening", sub: "5PM–9PM" },
];

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
  activeCount: number;
}

export default function FilterPanel({ filters, onChange, onReset, activeCount }: Props) {
  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const chip = (active: boolean) => ({
    padding: "5px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 600,
    cursor: "pointer", border: "1.5px solid",
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--text-secondary)",
    borderColor: active ? "var(--accent)" : "var(--border-strong)",
    transition: "all 0.15s",
  } as React.CSSProperties);

  return (
    <div style={{ padding: "16px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
          <SlidersHorizontal size={16} style={{ color: "var(--accent)" }} />
          Filters
          {activeCount > 0 && (
            <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: "0.7rem" }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            <X size={12} /> Reset
          </button>
        )}
      </div>

      {/* Vaccine Type */}
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Vaccine Type</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ALL_VACCINES.map((v) => (
            <button key={v} style={chip(filters.vaccines.includes(v))}
              onClick={() => onChange({ ...filters, vaccines: toggle(filters.vaccines, v) })}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Distance Radius */}
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Distance Radius</p>
        <div style={{ display: "flex", gap: 6 }}>
          {RADII.map((r) => (
            <button key={r} style={chip(filters.radius === r)}
              onClick={() => onChange({ ...filters, radius: r })}>
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Time Slot */}
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Time Slot</p>
        <div style={{ display: "flex", gap: 6 }}>
          {TIME_SLOTS.map(({ value, label, sub }) => (
            <button key={value} style={{ ...chip(filters.timeSlots.includes(value)), display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 12px" }}
              onClick={() => onChange({ ...filters, timeSlots: toggle(filters.timeSlots, value) })}>
              <span>{label}</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.75 }}>{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Date</p>
        <input
          type="date"
          className="input-field"
          value={filters.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
          style={{ fontSize: "0.85rem" }}
        />
      </div>

      {/* Available Only */}
      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div
          onClick={() => onChange({ ...filters, availableOnly: !filters.availableOnly })}
          style={{
            width: 40, height: 22, borderRadius: 999, position: "relative", transition: "background 0.2s",
            background: filters.availableOnly ? "var(--accent)" : "var(--border-strong)",
            flexShrink: 0,
          }}
        >
          <div style={{
            position: "absolute", top: 3, left: filters.availableOnly ? 21 : 3,
            width: 16, height: 16, borderRadius: "50%", background: "#fff",
            transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }} />
        </div>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>Available slots only</span>
      </label>
    </div>
  );
}
