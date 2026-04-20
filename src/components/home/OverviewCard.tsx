"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface OverviewCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  delay?: number;
}

export default function OverviewCard({
  label, value, sub, icon: Icon, color, bg, delay = 0,
}: OverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="card p-5 cursor-default"
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
        <Icon size={17} color={color} />
      </div>
      <p className="font-bold text-2xl mb-0.5" style={{ color: "var(--text-primary)" }}>{value}</p>
      <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{label}</p>
      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>
    </motion.div>
  );
}
