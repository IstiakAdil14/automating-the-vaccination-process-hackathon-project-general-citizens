"use client";
import { Search, X, Mic } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Search
        size={20}
        style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
      />
      <input
        className="input-field"
        style={{ paddingLeft: 44, paddingRight: 80, fontSize: "0.9rem", padding: "8px 80px 8px 44px" }}
        placeholder="Search by center name or area…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
        {value && (
          <button
            onClick={() => onChange("")}
            style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
          >
            <X size={14} />
          </button>
        )}
        <button
          title="Voice search"
          style={{ padding: 4, borderRadius: 6, border: "none", background: "var(--accent-subtle)", cursor: "pointer", color: "var(--accent)", display: "flex" }}
        >
          <Mic size={14} />
        </button>
      </div>
    </div>
  );
}
