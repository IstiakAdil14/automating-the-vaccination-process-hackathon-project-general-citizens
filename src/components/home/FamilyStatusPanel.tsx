"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import type { FamilyMember } from "@/types/home";

// ── Helpers ───────────────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  "#4f46e5", "#0891b2", "#7c3aed", "#0d9488",
  "#d97706", "#dc2626", "#059669", "#9333ea",
];

function avatarColor(member: FamilyMember, index: number): string {
  return member.avatarColor ?? AVATAR_PALETTE[index % AVATAR_PALETTE.length];
}

function initials(member: FamilyMember): string {
  const src = member.name ?? member.label;
  return src
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function progressColor(p: number): string {
  if (p >= 80) return "#10b981";
  if (p >= 50) return "#f59e0b";
  return "#ef4444";
}

// ── Member card ───────────────────────────────────────────────────────────────
function MemberCard({
  member,
  index,
}: {
  member: FamilyMember;
  index: number;
}) {
  const color  = avatarColor(member, index);
  const bar    = progressColor(member.progress);
  const isFullyVaccinated = member.progress === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3 p-4 rounded-2xl shrink-0 w-36 sm:w-auto"
      style={{
        background: "var(--surface-raised)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Avatar */}
      <div className="relative">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-base select-none"
          style={{
            background: `linear-gradient(135deg, ${color}cc, ${color})`,
            boxShadow: `0 4px 14px ${color}40`,
          }}
          aria-hidden="true"
        >
          {initials(member)}
        </div>
        {isFullyVaccinated && (
          <span
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "white" }}
            aria-label="Fully vaccinated"
          >
            <CheckCircle2 size={16} style={{ color: "#10b981" }} />
          </span>
        )}
      </div>

      {/* Name + relation */}
      <div className="text-center">
        <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
          {member.name ?? member.label}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {member.relation}
        </p>
      </div>

      {/* Mini progress bar */}
      <div className="w-full space-y-1">
        <div
          className="h-1.5 rounded-full overflow-hidden w-full"
          style={{ background: "var(--border)" }}
          role="progressbar"
          aria-valuenow={member.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${member.name ?? member.label}: ${member.progress}% vaccinated`}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: bar }}
            initial={{ width: 0 }}
            animate={{ width: `${member.progress}%` }}
            transition={{ duration: 0.9, delay: 0.2 + index * 0.08, ease: "easeOut" }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {member.vaccinesGiven}/{member.vaccinesTotal}
          </span>
          <span className="text-xs font-bold" style={{ color: bar }}>
            {member.progress}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Add member button ─────────────────────────────────────────────────────────
function AddMemberButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl shrink-0 w-36 sm:w-auto transition-colors"
      style={{
        border: "1.5px dashed var(--border-strong)",
        background: "transparent",
        minHeight: "160px",
        cursor: "pointer",
      }}
      aria-label="Add family member"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: "var(--accent-subtle)" }}
      >
        <Plus size={20} style={{ color: "var(--accent)" }} aria-hidden="true" />
      </div>
      <span className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
        Add Member
      </span>
    </motion.button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface FamilyStatusPanelProps {
  members: FamilyMember[];
  onAddMember?: () => void;
}

export default function FamilyStatusPanel({
  members,
  onAddMember,
}: FamilyStatusPanelProps) {
  const fullyVaccinated = members.filter((m) => m.progress === 100).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
      role="region"
      aria-label="Family vaccination status"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.10)" }}
            aria-hidden="true"
          >
            <Users size={16} style={{ color: "#d97706" }} />
          </div>
          <div>
            <h2 className="font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
              Family Status
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {fullyVaccinated}/{members.length} fully vaccinated
            </p>
          </div>
        </div>

        <Link
          href="/family"
          className="flex items-center gap-1 text-xs font-semibold transition-all hover:gap-1.5"
          style={{ color: "var(--accent)" }}
          aria-label="Manage family members"
        >
          Manage <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>

      {/* ── Member grid — horizontal scroll on mobile, grid on sm+ ── */}
      <div
        className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto pb-1 sm:pb-0 scrollbar-none"
        role="list"
        aria-label="Family members"
      >
        {members.map((m, i) => (
          <div key={m.id} role="listitem" className="shrink-0 sm:shrink flex-1">
            <MemberCard member={m} index={i} />
          </div>
        ))}

        {/* Add member */}
        <div role="listitem" className="shrink-0 sm:shrink flex-1">
          <AddMemberButton onClick={onAddMember} />
        </div>
      </div>
    </motion.div>
  );
}
