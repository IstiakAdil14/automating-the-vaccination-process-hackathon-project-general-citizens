"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import type { FamilyMember } from "@/types/home";

interface FamilySummaryProps {
  members: FamilyMember[];
}

function progressColor(p: number) {
  if (p >= 80) return "#10b981";
  if (p >= 50) return "#f59e0b";
  return "#ef4444";
}

export default function FamilySummary({ members }: FamilySummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.1)" }}>
            <Users size={16} color="#f59e0b" />
          </div>
          <h2 className="font-semibold" style={{ color: "var(--text-primary)" }}>Family Summary</h2>
        </div>
        <Link
          href="/family"
          className="text-xs font-medium flex items-center gap-1 transition-colors hover:gap-2"
          style={{ color: "var(--accent)" }}
        >
          Manage <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {members.map((member, i) => {
          const color = progressColor(member.progress);
          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.45 + i * 0.07 }}
              className="p-4 rounded-xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {member.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{member.relation}</p>
                </div>
                <span className="text-sm font-bold" style={{ color }}>
                  {member.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: "var(--border)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${member.progress}%` }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.07, ease: "easeOut" }}
                />
              </div>

              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {member.vaccinesGiven}/{member.vaccinesTotal} doses
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
