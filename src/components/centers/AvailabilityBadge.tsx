"use client";
import type { AvailabilityStatus } from "@/types/centers";

interface Props {
  slots: number;
  total: number;
  size?: "sm" | "md";
}

export function getStatus(slots: number, total: number): AvailabilityStatus {
  if (slots === 0) return "full";
  if (slots / total < 0.2) return "limited";
  return "available";
}

const config = {
  available: { bg: "rgba(16,185,129,0.1)", color: "#10b981", border: "rgba(16,185,129,0.25)", dot: "#10b981", label: (s: number) => `${s} slots left` },
  limited:   { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.25)", dot: "#f59e0b", label: (s: number) => `${s} slots left` },
  full:      { bg: "rgba(239,68,68,0.1)",  color: "#ef4444", border: "rgba(239,68,68,0.25)",  dot: "#ef4444", label: () => "Fully Booked" },
};

export default function AvailabilityBadge({ slots, total, size = "md" }: Props) {
  const status = getStatus(slots, total);
  const c = config[status];
  const pad = size === "sm" ? "5px 13px" : "7px 16px";
  const fs  = size === "sm" ? "0.95rem"  : "1.05rem";

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: pad, borderRadius: 999, fontSize: fs, fontWeight: 600,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      }}
    >
      <span style={{ position: "relative", display: "inline-flex", width: 8, height: 8 }}>
        {status === "available" && (
          <span style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: c.dot, opacity: 0.4,
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }} />
        )}
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, display: "block" }} />
      </span>
      {c.label(slots)}
      <style>{`@keyframes ping{75%,100%{transform:scale(2);opacity:0}}`}</style>
    </span>
  );
}
